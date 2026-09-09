// src/lib/curriculum/pythonFullStack/batch022.ts
// Single Source of Truth for PINIT BATCH 022 (PARTIAL): Month 6 · Week 22 · Days 108–111
// Semantic HTML5, Accessible Forms, Declarative WCAG 2.2 AA Accessibility & Web Performance (CLS)
// Pedagogical Flow: UNDERSTAND (Semantic DOM Trees & Parser) -> APPLY (Forms, Encodings & Validation) -> BUILD (Declarative WCAG 2.2 AA Components) -> DEBUG (A11y Antipatterns & DevTools CLS)
// NOTE: Day 112 (TRANSFER / Assessment) is deferred to the subsequent planning horizon.

import {
  BatchContentManifest,
  DayContentManifest,
  TheoryBlock,
  ExampleBlock,
  GuidedPracticeBlock,
  KnowledgeCheckBlock,
  DebuggingChallengeBlock,
  ReflectionBlock,
  ReferenceBlock,
} from '../contentTypes';

export const COMPETENCY_ID_SEMANTIC_HTML_AND_ACCESSIBILITY = 'comp-pfs-m6-022';
export const COMPETENCY_ID_WEB_MARKUP_AND_ACCESSIBILITY = COMPETENCY_ID_SEMANTIC_HTML_AND_ACCESSIBILITY;

// ── CANONICAL DOMAIN EXCEPTIONS & DEFINED CONSTRAINTS ──
// Strict Prerequisite Firewall: Days 108–111 feature ZERO JavaScript.
// Custom JS focus trapping, DOM scripting, and PerformanceObserver are strictly deferred to Day 113+.

// ── DAY 108: UNDERSTAND — Semantic HTML5 Document Trees, Parser Mechanics & Heading Hierarchies ──
export const DAY_108_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m6-w22-022',
  dayNumber: 1,
  title: 'Semantic HTML5 Document Trees, Parser Mechanics & Heading Hierarchies',
  pedagogicalIntent: 'UNDERSTAND',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b22-d108-01',
      type: 'THEORY',
      order: 1,
      title: 'HTML5 Parsing Mechanics, DOM Tree Construction & Semantic Landmark Architecture',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      summary: 'Understand how browsers parse HTML into the Document Object Model (DOM), the error-tolerant tokenization algorithm, semantic landmark elements, heading hierarchy rules, and the distinction between links and buttons in the Critical Rendering Path.',
      whatItIs: 'HTML is not XML; the browser HTML parser operates under the WHATWG Living Standard parsing algorithm, converting raw byte streams through tokenization and tree construction into the Document Object Model (DOM). The parser is deliberately error-tolerant, automatically synthesizing missing tags (such as <tbody>) and repairing ill-formed nests, but silent error correction often degrades accessibility and layout performance.\n\nSemantic HTML elements convey structural and programmatic meaning directly to the browser and assistive technologies (such as screen readers) without custom scripting:\n- Landmark elements: <header>, <nav>, <main>, <article>, <section>, <aside>, <footer>.\n- Heading hierarchy: Logical progression (<h1> through <h6>) establishes a navigable outline. Unnecessary heading-level jumps (such as skipping from <h1> to <h4>) degrade screen-reader outline navigation.\n- Links (<a>) vs Buttons (<button>): Links navigate to a new resource or URI (updating the browser address bar); buttons perform actions or manipulate client state within the current context.\n\nThe Critical Rendering Path (CRP) flows deterministically: HTML Parsing -> DOM Tree; CSS Parsing -> CSSOM; DOM + CSSOM -> Render Tree -> Layout (Reflow) -> Paint -> GPU Compositing.',
      whyItExists: 'Ensures web content is universally navigable, accessible to assistive technologies, indexed accurately by search engine crawlers, and rendered efficiently by browser layout engines.',
      problemSolved: 'Eliminates "div soup" architectures where generic <div> containers fail to expose roles, landmarks, or keyboard affordances to screen readers and search spiders.',
      mentalModel: 'The Architectural Blueprints vs Plain Cardboard Boxes: Using <div> elements everywhere is like building a house out of blank, unmarked cardboard boxes. Sighted humans might paint a label on the outside, but a blind inspector (screen reader) cannot tell which box is the kitchen, front door, or hallway. Semantic landmarks (<header>, <nav>, <main>, <footer>) are structural architectural blueprints with built-in signs and accessibility affordances.',
      realWorldUse: 'Accessible enterprise design systems, web publishing platforms, e-commerce storefronts, and government portals complying with Section 508 and European Accessibility Act (EAA).',
      commonMistakes: [
        'Using <div onclick="..."> instead of a native <button>, which strips out default keyboard focusability (Enter/Space activation) and screen-reader button roles.',
        'Using <button> to navigate to another URL instead of <a href="...">, breaking middle-click "open in new tab", bookmarking, and link crawlers.',
        'Skipping heading levels (e.g., jumping from <h1> directly to <h3> or <h4>) purely to change visual font size rather than using CSS typography classes.',
        'Including multiple <main> landmark elements visible at the same time in a single document tree.',
      ],
    } as TheoryBlock,
    {
      id: 'blk-b22-d108-02',
      type: 'EXAMPLE',
      order: 2,
      title: 'Refactoring Inaccessible "Div Soup" into Semantic Landmark Architecture',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      description: 'Demonstrates refactoring an inaccessible div-based page layout into an accessible semantic HTML5 document tree with proper landmarks and heading hierarchies.',
      codeSnippet: `<!-- INACCESSIBLE DIV SOUP (ANTI-PATTERN) -->
<div class="header">
  <div class="logo">Career OS</div>
  <div class="menu">
    <div class="item" onclick="goTo('/jobs')">Jobs</div>
    <div class="item" onclick="goTo('/profile')">Profile</div>
  </div>
</div>
<div class="content">
  <div class="title">Software Engineer Roadmap</div>
  <div class="section">
    <div class="subheading">Core Competencies</div>
    <p>Systems architecture, networking, and accessibility.</p>
  </div>
</div>
<div class="footer">
  <p>&copy; 2026 Career OS</p>
</div>

<!-- ACCESSIBLE SEMANTIC HTML5 ARCHITECTURE (STANDARD) -->
<header>
  <div class="logo">Career OS</div>
  <nav aria-label="Main Navigation">
    <ul>
      <li><a href="/jobs">Jobs</a></li>
      <li><a href="/profile">Profile</a></li>
    </ul>
  </nav>
</header>
<main>
  <article>
    <header>
      <h1>Software Engineer Roadmap</h1>
    </header>
    <section aria-labelledby="core-comp-heading">
      <h2 id="core-comp-heading">Core Competencies</h2>
      <p>Systems architecture, networking, and accessibility.</p>
    </section>
  </article>
</main>
<footer>
  <p>&copy; 2026 Career OS</p>
</footer>`,
      explanation: 'The refactored document uses semantic landmarks (<header>, <nav>, <main>, <article>, <section>, <footer>) which automatically generate accessibility landmark regions in the browser accessibility tree. Navigation items use semantic <a> links inside <ul>/<li> lists rather than clickable <div>s. Heading levels proceed logically from <h1> to <h2> without skipping levels.',
    } as ExampleBlock,
    {
      id: 'blk-b22-d108-03',
      type: 'GUIDED_PRACTICE',
      order: 3,
      title: 'Guided Practice: Landmark Mapping & Heading Hierarchy Audit',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      instructions: [
        'Convert all generic container divs serving structural landmark roles into appropriate HTML5 elements (<header>, <nav>, <main>, <aside>, <footer>).',
        'Repair the broken heading hierarchy: ensure exactly one logical <h1> for the primary page topic, followed sequentially by <h2> and <h3> without level skips.',
        'Replace all action-triggering divs with native <button> elements and navigation links with <a href="...">.',
      ],
      starterArtifact: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Engineering Portal</title>
</head>
<body>
  <div class="site-header">
    <div class="nav-bar">
      <div class="nav-item" onclick="navigate('dashboard.html')">Dashboard</div>
    </div>
  </div>
  <div class="page-body">
    <h4>Welcome to Portal</h4>
    <div class="article-box">
      <h1>Release Notes v2.4</h1>
      <p>Performance improvements included.</p>
    </div>
    <div class="sidebar">
      <div class="heading">Related Docs</div>
      <div class="btn" onclick="triggerExport()">Export PDF</div>
    </div>
  </div>
</body>
</html>`,
      expectedOutcome: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Engineering Portal</title>
</head>
<body>
  <header>
    <nav aria-label="Site Navigation">
      <a href="dashboard.html">Dashboard</a>
    </nav>
  </header>
  <main>
    <h1>Engineering Portal</h1>
    <article>
      <h2>Release Notes v2.4</h2>
      <p>Performance improvements included.</p>
    </article>
    <aside aria-label="Related Information">
      <h3>Related Docs</h3>
      <button type="button">Export PDF</button>
    </aside>
  </main>
  <footer>
    <p>&copy; 2026 Engineering Portal</p>
  </footer>
</body>
</html>`,
      hints: [
        'Use <main> for the central document content; only one visible <main> should exist per page.',
        'Ensure heading levels do not jump: <h1> -> <h2> -> <h3>.',
        'Use <button type="button"> for actions like Export PDF, and <a href="..."> for navigating to dashboard.html.',
      ],
      targetCompetencyId: COMPETENCY_ID_SEMANTIC_HTML_AND_ACCESSIBILITY,
    } as GuidedPracticeBlock,
    {
      id: 'blk-b22-d108-04',
      type: 'KNOWLEDGE_CHECK',
      order: 4,
      title: 'Knowledge Check: Semantic Landmarks & Link vs Button Semantics',
      estimatedMinutes: 10,
      status: 'PUBLISHED',
      version: '1.0.0',
      diagnosticQuestion: 'Why is using <div onclick="..."> instead of a native <button> considered a severe accessibility failure in web applications?',
      options: [
        'Because generic divs do not receive keyboard focus by default, do not respond to Enter or Space keys, and do not announce a button role to screen readers.',
        'Because divs require twice as much CSS memory to render in the browser GPU pipeline.',
        'Because modern web browsers block all click events attached to div elements.',
        'Because divs can only be styled using inline CSS attributes.',
      ],
      correctIndex: 0,
      explanation: 'Native <button> elements provide built-in keyboard focusability (tabindex=0 behavior), default activation on Space and Enter keystrokes, and automatically announce the "button" role to the accessibility tree. A <div> lacks all of these built-in behaviors unless manually reconstructed with extensive ARIA and event listeners.',
      misconceptionIdentified: 'Assuming visual appearance and mouse-click handlers alone constitute an interactive button.',
    } as KnowledgeCheckBlock,
    {
      id: 'blk-b22-d108-05',
      type: 'REFLECTION',
      order: 5,
      title: 'Reflection: The Hidden Cost of Div Soup for Assistive Technologies',
      estimatedMinutes: 5,
      status: 'PUBLISHED',
      version: '1.0.0',
      prompt: 'Reflect on how a user navigating exclusively via screen reader or keyboard experiences a page composed entirely of unlabelled <div> elements versus a semantic HTML5 document tree.',
      guidingQuestions: [
        'How does a screen reader user jump directly to main content when landmarks are absent?',
        'What keyboard commands do native buttons provide that div click listeners silently drop?',
        'Why does relying on CSS classes for structure fail assistive technology users?',
      ],
    } as ReflectionBlock,
    {
      id: 'blk-b22-d108-06',
      type: 'REFERENCE',
      order: 6,
      title: 'Batch 022 Reference Sheet: HTML5 Elements & Living Standard Specifications',
      estimatedMinutes: 5,
      status: 'PUBLISHED',
      version: '1.0.0',
      links: [
        {
          title: 'WHATWG HTML Living Standard: Sections & Headings',
          url: 'https://html.spec.whatwg.org/multipage/sections.html',
        },
        {
          title: 'MDN Web Docs: HTML Sectioning Elements',
          url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Heading_Elements',
        },
      ],
      documentationExtracts: [
        'A document should have a clear heading hierarchy. Headings represent levels in an outline; skipping heading levels (e.g. from <h1> to <h3>) is confusing to users of screen readers.',
        'Links are for navigating to resources; buttons are for triggering user actions.',
      ],
    } as ReferenceBlock,
  ],
};

// ── DAY 109: APPLY — Forms, Input Types, Multipart Encoding, Client Validation & Keyboard Accessibility ──
export const DAY_109_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m6-w22-022',
  dayNumber: 2,
  title: 'Forms, Input Types, Multipart Encoding, Client Validation & Keyboard Accessibility',
  pedagogicalIntent: 'APPLY',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b22-d109-01',
      type: 'THEORY',
      order: 1,
      title: 'HTML Form Mechanics, Encoding Types, Explicit Labeling & Keyboard Navigation',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      summary: 'Master HTML form mechanics, payload encodings (urlencoded vs multipart), explicit labeling via <label for>, native constraint validation attributes, CSS validation pseudo-classes, and sequential keyboard tab navigation.',
      whatItIs: 'HTML forms are the primary mechanism for user data transmission to HTTP backends:\n- Form Container: <form action="/endpoint" method="POST" enctype="...">. The "name" attribute on form controls provides the payload dictionary key; controls without a "name" attribute are not submitted.\n- Encodings: "application/x-www-form-urlencoded" is the standard default for ASCII key-value pairs. "multipart/form-data" is mandatory whenever transmitting binary payloads (<input type="file">) separated by boundary strings.\n- Accessible Labeling: Every form control MUST have an explicit programmatic label via <label for="control-id"> matching the input id, or by nesting the input inside <label>. Placeholder text is NOT a replacement for a label: placeholders vanish upon input, lack contrast, and are not reliably announced as the primary label by screen readers.\n- Native Constraint Validation: Uses HTML attributes (required, pattern, min, max, minlength, maxlength, type="email|tel|number|url"). The browser validates constraints before submission, preventing invalid HTTP requests.\n- CSS Validation Pseudo-Classes: :valid, :invalid, :user-invalid, :required, and :focus-visible allow styling feedback without custom JavaScript.\n- Keyboard Navigation & Tabindex: Natural tab order follows DOM source order. tabindex="0" makes a non-focusable element focusable in sequential order; tabindex="-1" makes an element programmatically focusable (via scripts) but skips sequential tab order. Positive tabindex (e.g. tabindex="1", tabindex="5") is a dangerous anti-pattern that destroys natural tab order.',
      whyItExists: 'Provides declarative, zero-JavaScript user input collection, client-side validation, and keyboard accessibility out of the box across all modern web browsers.',
      problemSolved: 'Eliminates unlabelled inputs, broken mobile keyboards (by selecting appropriate type="tel", type="email"), form submission failures for file uploads, and erratic focus jumping caused by positive tabindex values.',
      mentalModel: 'The Passport Application Form: Each blank line must have a clearly printed header ("Surname", "Passport Number") printed next to it (<label for>). If the text is merely faint gray sample text inside the blank box (placeholder), it vanishes the moment you begin writing, leaving you unsure of what belongs there. When handing the form to the officer (POST submission), multiple loose documents and photographs require a folder with dividers (multipart/form-data).',
      realWorldUse: 'User authentication, registration forms, file upload portals, checkout flows, and surveys across high-compliance enterprise software.',
      commonMistakes: [
        'Using placeholder="..." as the sole label for an input field: placeholder text vanishes on typing and fails WCAG 3.3.2 (Labels or Instructions).',
        'Forgetting enctype="multipart/form-data" on a form with <input type="file">: results in only the file name string being sent instead of binary file contents.',
        'Using positive tabindex (e.g. tabindex="1", tabindex="2"): breaks natural document tab order and confuses keyboard users.',
        'Omitting the name attribute on form controls: browser excludes the input value from the submitted form payload.',
      ],
    } as TheoryBlock,
    {
      id: 'blk-b22-d109-02',
      type: 'EXAMPLE',
      order: 2,
      title: 'Zero-JS Accessible Registration & File Upload Form with Native Validation',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      description: 'Demonstrates a complete, accessible HTML form featuring explicit labels, fieldsets with legends, native validation attributes, multipart encoding, and natural tab navigation.',
      codeSnippet: `<!-- ZERO-JS ACCESSIBLE REGISTRATION FORM -->
<form action="/api/register" method="POST" enctype="multipart/form-data" novalidate class="accessible-form">
  <fieldset>
    <legend>Account Credentials</legend>

    <div class="form-group">
      <label for="reg-email">Email Address <span aria-hidden="true">*</span></label>
      <input 
        type="email" 
        id="reg-email" 
        name="email" 
        required 
        autocomplete="email"
        aria-describedby="email-hint"
      >
      <p id="email-hint" class="field-hint">We will send your verification token here.</p>
    </div>

    <div class="form-group">
      <label for="reg-password">Password <span aria-hidden="true">*</span></label>
      <input 
        type="password" 
        id="reg-password" 
        name="password" 
        required 
        minlength="12"
        autocomplete="new-password"
        aria-describedby="password-hint"
      >
      <p id="password-hint" class="field-hint">Must be at least 12 characters.</p>
    </div>
  </fieldset>

  <fieldset>
    <legend>Profile Details</legend>

    <div class="form-group">
      <label for="reg-resume">Resume (PDF, max 5MB) <span aria-hidden="true">*</span></label>
      <input 
        type="file" 
        id="reg-resume" 
        name="resume" 
        accept=".pdf,application/pdf"
        required
      >
    </div>
  </fieldset>

  <div class="form-actions">
    <button type="submit">Complete Registration</button>
  </div>
</form>`,
      explanation: 'Every form control has an explicit <label for="..."> referencing its matching id. Related inputs are grouped into <fieldset> elements with descriptive <legend> tags. Enctype is set to multipart/form-data to support file uploads. Native constraints (required, minlength="12", type="email", accept=".pdf") validate user input declaratively with zero JavaScript.',
    } as ExampleBlock,
    {
      id: 'blk-b22-d109-03',
      type: 'GUIDED_PRACTICE',
      order: 3,
      title: 'Guided Practice: Accessible Form Construction with Native Validation',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      instructions: [
        'Audit the starter form: add missing explicit <label for> tags and eliminate placeholder-as-label anti-patterns.',
        'Add enctype="multipart/form-data" to support the profile photo file upload.',
        'Remove all positive tabindex attributes (e.g. tabindex="3", tabindex="1") to restore natural DOM tab sequence.',
        'Enforce native validation constraints: required fields, minlength on password, and correct input types (email, tel).',
      ],
      starterArtifact: `<!-- BROKEN / INACCESSIBLE FORM -->
<form action="/submit-profile" method="POST">
  <div>
    <input type="text" name="user" placeholder="Enter your username" tabindex="2">
  </div>
  <div>
    <input type="text" name="mail" placeholder="Enter your email" tabindex="1">
  </div>
  <div>
    <input type="password" name="pass" placeholder="Password" tabindex="4">
  </div>
  <div>
    Upload Avatar: <input type="file" name="avatar" tabindex="3">
  </div>
  <div>
    <div class="submit-button" onclick="submitForm()">Submit</div>
  </div>
</form>`,
      expectedOutcome: `<form action="/submit-profile" method="POST" enctype="multipart/form-data">
  <div class="form-group">
    <label for="prof-username">Username <span aria-hidden="true">*</span></label>
    <input type="text" id="prof-username" name="username" required>
  </div>
  <div class="form-group">
    <label for="prof-email">Email Address <span aria-hidden="true">*</span></label>
    <input type="email" id="prof-email" name="email" required>
  </div>
  <div class="form-group">
    <label for="prof-password">Password <span aria-hidden="true">*</span></label>
    <input type="password" id="prof-password" name="password" minlength="8" required>
  </div>
  <div class="form-group">
    <label for="prof-avatar">Profile Avatar</label>
    <input type="file" id="prof-avatar" name="avatar" accept="image/*">
  </div>
  <div class="form-group">
    <button type="submit">Submit Profile</button>
  </div>
</form>`,
      hints: [
        'Ensure each input has an id matching the corresponding label for attribute.',
        'Set enctype="multipart/form-data" whenever <input type="file"> is used.',
        'Remove all tabindex attributes to allow natural top-to-bottom keyboard tab navigation.',
      ],
      targetCompetencyId: COMPETENCY_ID_SEMANTIC_HTML_AND_ACCESSIBILITY,
    } as GuidedPracticeBlock,
    {
      id: 'blk-b22-d109-04',
      type: 'KNOWLEDGE_CHECK',
      order: 4,
      title: 'Knowledge Check: Accessible Form Labeling & Tabindex',
      estimatedMinutes: 10,
      status: 'PUBLISHED',
      version: '1.0.0',
      diagnosticQuestion: 'Why does setting positive tabindex attributes (e.g. tabindex="1", tabindex="2") on form elements violate accessibility best practices?',
      options: [
        'Positive tabindex forces the browser to jump through elements in arbitrary numeric order before unnumbered elements, creating an unpredictable and disorienting tab sequence for keyboard users.',
        'Positive tabindex causes the browser form parser to reject HTTP POST submissions.',
        'Positive tabindex prevents CSS pseudo-classes from applying to form inputs.',
        'Positive tabindex disables native browser spellcheck on text inputs.',
      ],
      correctIndex: 0,
      explanation: 'Setting positive tabindex creates a separate tab traversal tier that navigates all positive elements in numeric order before visiting standard DOM-order elements (tabindex="0" or native controls). This creates an unpredictable, jumping focus experience for keyboard users. The golden rule is: rely on natural DOM source order or use tabindex="-1" for script focus.',
      misconceptionIdentified: 'Believing manual positive tabindex numbering helps keyboard users navigate faster.',
    } as KnowledgeCheckBlock,
    {
      id: 'blk-b22-d109-05',
      type: 'REFLECTION',
      order: 5,
      title: 'Reflection: The Usability Impact of Native Form Validation',
      estimatedMinutes: 5,
      status: 'PUBLISHED',
      version: '1.0.0',
      prompt: 'Consider how declarative HTML validation attributes (required, pattern, type="email") improve accessibility and performance compared to heavy JavaScript validation libraries.',
      guidingQuestions: [
        'How do screen readers announce required fields and validation constraints natively?',
        'What happens when a mobile user encounters an input with type="tel" versus type="text"?',
        'Why does relying on client-side HTML validation never eliminate the need for server-side validation?',
      ],
    } as ReflectionBlock,
    {
      id: 'blk-b22-d109-06',
      type: 'REFERENCE',
      order: 6,
      title: 'Batch 022 Reference Sheet: HTML Form Specification & Keyboard Navigation',
      estimatedMinutes: 5,
      status: 'PUBLISHED',
      version: '1.0.0',
      links: [
        {
          title: 'W3C Web Accessibility Initiative (WAI): Form Labels Tutorial',
          url: 'https://www.w3.org/WAI/tutorials/forms/labels/',
        },
        {
          title: 'MDN Web Docs: The HTML form element',
          url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form',
        },
      ],
      documentationExtracts: [
        'Placeholder text should not be used as an alternative to a label. It disappears when the user starts typing and often has insufficient color contrast.',
        'Form encoding enctype="multipart/form-data" is required when submitting binary file inputs.',
      ],
    } as ReferenceBlock,
  ],
};

// ── DAY 110: BUILD — Declarative Accessible Components: Native <details>/<summary>, <dialog> & WCAG Criteria ──
export const DAY_110_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m6-w22-022',
  dayNumber: 3,
  title: 'Declarative Accessible Components: Native <details>/<summary>, <dialog> & WCAG Criteria',
  pedagogicalIntent: 'BUILD',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b22-d110-01',
      type: 'THEORY',
      order: 1,
      title: 'The First Rule of ARIA, Native Disclosure Components & WCAG 2.2 AA Criteria',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      summary: 'Master the First Rule of ARIA, build declarative accessible disclosures with native <details> and <summary>, structure semantic <dialog> components without breaking the zero-JavaScript prerequisite firewall, and implement specific WCAG 2.2 Level AA criteria.',
      whatItIs: 'The First Rule of ARIA states: "If you can use a native HTML element or attribute with the semantics and behavior you require already built-in, then do so instead of re-purposing an element and adding an ARIA role, state or property to make it accessible."\n\nDeclarative Interactive Disclosures:\n- The <details> and <summary> elements provide native expand/collapse functionality completely without JavaScript. The browser automatically handles keyboard focus, Space/Enter activation, and updates the accessibility tree state (open/expanded attributes) natively.\n\nSemantic <dialog> Structural Markup:\n- The <dialog> element provides standard structural markup for modal and non-modal dialogs. It communicates dialog semantics and supports accessible labeling via aria-labelledby="dialog-title". (Note: Programmatic showModal() methods, backdrop styling, and custom JavaScript focus trapping algorithms are strictly deferred to Day 113+ when the JavaScript/DOM curriculum opens).\n\nSpecific WCAG 2.2 Level AA Criteria:\n- 1.4.3 Contrast (Minimum): Normal body text requires a contrast ratio of at least 4.5:1 against its background. Large text (at least 18pt / 24px, or 14pt / 18.66px bold) requires at least 3:1.\n- 1.4.11 Non-text Contrast: User interface components (active input borders, focus indicators, icons) require a contrast ratio of at least 3:1 against adjacent colors.\n- 2.4.7 Focus Visible: Any keyboard operable user interface has a mode of operation where the keyboard focus indicator is visible. (CSS implementation technique: :focus-visible ensures focus rings appear during keyboard navigation while suppressing unnecessary mouse-click outlines. Note: WCAG 2.4.13 Focus Appearance is Level AAA and outside the AA baseline).\n- 2.4.11 Focus Not Obscured (Minimum): When an item receives keyboard focus, it must not be entirely hidden by author-created sticky headers, banners, or floating footers.\n- 2.5.8 Target Size (Minimum): For pointer-input targets (touch/mouse), targets must be at least 24x24 CSS pixels, or provide sufficient spacing/offset, with standard exceptions (inline links in sentences, user-agent defaults, and essential presentation).\n\nConceptual ARIA Tabs Reference:\n- Accessible tabs require specific keyboard interaction models: ArrowLeft/ArrowRight to cycle tabs, roving tabindex (tabindex="0" on selected tab, tabindex="-1" on unselected tabs), and synchronized tabpanel visibility.',
      whyItExists: 'Enables developers to create accessible, interactive web interfaces while minimizing fragile custom JavaScript and ensuring strict compliance with legal accessibility mandates.',
      problemSolved: 'Eliminates inaccessible custom accordion widgets, invisible keyboard focus rings, unreadable low-contrast text, and tiny unclickable touch targets.',
      mentalModel: 'The Pre-Built Accessible Ramp vs Custom Timber Scaffold: Using native <details>/<summary> is like installing a pre-fabricated, code-certified concrete ramp with handrails and textured steps built in. Building a custom accordion with <div>, role="button", and aria-expanded is like nailing wooden boards together yourself—if you forget even one nail (like Enter key activation or focus management), the entire ramp collapses for disabled users.',
      realWorldUse: 'Enterprise documentation accordions, FAQ disclosure panels, accessible navigation menus, high-contrast user interfaces, and mobile-friendly touch targets.',
      commonMistakes: [
        'Re-implementing an accordion using <div class="accordion" onclick="..."> instead of using native <details> and <summary>.',
        'Removing focus outlines with * { outline: none; } without providing a high-contrast replacement, violating WCAG 2.4.7.',
        'Using light gray text (#9ca3af) on white backgrounds (#ffffff), yielding ~2.5:1 contrast and violating WCAG 1.4.3 (requires 4.5:1).',
        'Creating tiny icon buttons (e.g. 16x16 px) without 24x24 CSS px hit areas or spacing offsets, violating WCAG 2.5.8.',
      ],
    } as TheoryBlock,
    {
      id: 'blk-b22-d110-02',
      type: 'EXAMPLE',
      order: 2,
      title: 'Building Declarative FAQ Accordions & Semantic Dialog Markup',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      description: 'Demonstrates declarative accessible disclosures with <details>/<summary>, WCAG 2.2 AA compliant CSS styling, and semantic <dialog> structure.',
      codeSnippet: `<!-- DECLARATIVE ACCESSIBLE ACCORDION (ZERO JAVASCRIPT) -->
<section aria-labelledby="faq-heading" class="faq-section">
  <h2 id="faq-heading">Frequently Asked Questions</h2>

  <details class="faq-item">
    <summary class="faq-summary">
      <span>What is the prerequisite for Batch 022?</span>
    </summary>
    <div class="faq-content">
      <p>Batches 001 through 021 covering Python foundations, systems architecture, and HTTP/1.1 networking.</p>
    </div>
  </details>

  <details class="faq-item">
    <summary class="faq-summary">
      <span>How does WCAG 2.2 AA govern target size?</span>
    </summary>
    <div class="faq-content">
      <p>Criterion 2.5.8 requires interactive pointer targets to be at least 24x24 CSS pixels or have adequate spacing offsets.</p>
    </div>
  </details>
</section>

<!-- SEMANTIC DIALOG STRUCTURAL MARKUP (DECLARATIVE) -->
<dialog id="terms-modal" aria-labelledby="dialog-title" class="accessible-dialog">
  <article>
    <header>
      <h2 id="dialog-title">Terms of Service</h2>
    </header>
    <p>Please review our service agreement and privacy policies.</p>
    <footer>
      <form method="dialog">
        <button type="submit" value="accept">I Accept</button>
        <button type="submit" value="cancel">Close</button>
      </form>
    </footer>
  </article>
</dialog>

<!-- WCAG 2.2 LEVEL AA COMPLIANT CSS -->
<style>
  /* 1.4.3 Contrast: #111827 text on #ffffff yields 15.3:1 (exceeds 4.5:1) */
  body {
    color: #111827;
    background-color: #ffffff;
    font-size: 16px;
    line-height: 1.5;
  }

  /* 2.5.8 Target Size: min-height and padding guarantee >= 24x24 px */
  .faq-summary {
    display: flex;
    align-items: center;
    min-height: 44px; /* Exceeds 24px floor */
    padding: 8px 12px;
    cursor: pointer;
    font-weight: 600;
  }

  /* 2.4.7 Focus Visible: Clear 2px outline with high contrast */
  .faq-summary:focus-visible,
  button:focus-visible {
    outline: 3px solid #2563eb;
    outline-offset: 2px;
  }

  /* 1.4.11 Non-text contrast: Border is #6b7280 on #ffffff (4.5:1, exceeds 3:1) */
  .faq-item {
    border: 1px solid #6b7280;
    border-radius: 6px;
    margin-bottom: 8px;
  }
</style>`,
      explanation: 'The FAQ section uses native <details> and <summary> to deliver fully keyboard-accessible disclosures without any JavaScript. The CSS implements WCAG 2.2 AA requirements: text contrast exceeds 4.5:1, focus indicators use high-contrast :focus-visible outlines, interactive summary targets exceed 24x24 CSS pixels, and borders exceed 3:1 contrast.',
    } as ExampleBlock,
    {
      id: 'blk-b22-d110-03',
      type: 'GUIDED_PRACTICE',
      order: 3,
      title: 'Guided Practice: Constructing Accessible Native Disclosures with WCAG 2.2 AA Conformance',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      instructions: [
        'Replace the custom div-based toggle with native <details> and <summary> elements.',
        'Fix the text color contrast: increase contrast from failing ~2.2:1 to at least 4.5:1 against the background.',
        'Restore visible focus indicators using :focus-visible with at least 3px solid high-contrast outline.',
        'Ensure the interactive trigger target size is at least 24x24 CSS pixels.',
      ],
      starterArtifact: `<!-- FAILING ACCORDION ITEM -->
<style>
  .accordion-header {
    color: #9ca3af; /* FAILS WCAG 1.4.3: 2.5:1 on #ffffff */
    background: #ffffff;
    height: 18px;   /* FAILS WCAG 2.5.8: Target size < 24px */
    outline: none;  /* FAILS WCAG 2.4.7: Focus outline suppressed */
    cursor: pointer;
  }
</style>
<div class="accordion-header" onclick="toggleDetails()">
  System Architecture Overview
</div>
<div class="accordion-body" style="display: none;">
  Microservices communicate over HTTP/1.1 framing.
</div>`,
      expectedOutcome: `<style>
  .native-disclosure {
    border: 1px solid #4b5563; /* PASSES WCAG 1.4.11: >= 3:1 */
    border-radius: 4px;
    margin-bottom: 8px;
  }
  .native-disclosure summary {
    color: #1f2937; /* PASSES WCAG 1.4.3: 12.6:1 on #ffffff (>= 4.5:1) */
    background: #ffffff;
    min-height: 40px; /* PASSES WCAG 2.5.8: Target size >= 24px */
    padding: 8px 12px;
    cursor: pointer;
    font-weight: 600;
  }
  .native-disclosure summary:focus-visible {
    outline: 3px solid #1d4ed8; /* PASSES WCAG 2.4.7: Visible focus indicator */
    outline-offset: 2px;
  }
  .disclosure-content {
    padding: 12px;
    color: #374151;
  }
</style>
<details class="native-disclosure">
  <summary>System Architecture Overview</summary>
  <div class="disclosure-content">
    <p>Microservices communicate over HTTP/1.1 framing.</p>
  </div>
</details>`,
      hints: [
        'Use <details> and <summary> to get keyboard Space/Enter toggling for free.',
        'Set color to #1f2937 for dark body text on white to achieve > 12:1 contrast.',
        'Use summary:focus-visible to provide visible focus rings without showing outlines on mouse clicks.',
      ],
      targetCompetencyId: COMPETENCY_ID_SEMANTIC_HTML_AND_ACCESSIBILITY,
    } as GuidedPracticeBlock,
    {
      id: 'blk-b22-d110-04',
      type: 'KNOWLEDGE_CHECK',
      order: 4,
      title: 'Knowledge Check: WCAG 2.2 AA Criteria & Declarative Components',
      estimatedMinutes: 10,
      status: 'PUBLISHED',
      version: '1.0.0',
      diagnosticQuestion: 'Which of the following correctly pairs a WCAG 2.2 Level AA criterion with its specific threshold requirement?',
      options: [
        'Criterion 1.4.3 requires at least 4.5:1 contrast for normal text; Criterion 2.5.8 requires at least 24x24 CSS pixels for pointer target size.',
        'Criterion 1.4.3 requires at least 10:1 contrast for all text; Criterion 2.5.8 requires at least 100x100 pixels for buttons.',
        'Criterion 2.4.7 requires removing all focus outlines with CSS outline: none.',
        'Criterion 2.4.11 requires all modals to hide the document body.',
      ],
      correctIndex: 0,
      explanation: 'Under WCAG 2.2 Level AA: Criterion 1.4.3 mandates a minimum contrast ratio of 4.5:1 for normal text (3:1 for large text). Criterion 2.5.8 mandates a minimum pointer target size of 24x24 CSS pixels (or adequate spacing offsets). Criterion 2.4.7 mandates that keyboard focus indicators must be visible.',
      misconceptionIdentified: 'Confusing WCAG 2.2 AA target size and contrast requirements with Level AAA or incorrect values.',
    } as KnowledgeCheckBlock,
    {
      id: 'blk-b22-d110-05',
      type: 'REFLECTION',
      order: 5,
      title: 'Reflection: Why Native HTML Outperforms Custom ARIA Widgets',
      estimatedMinutes: 5,
      status: 'PUBLISHED',
      version: '1.0.0',
      prompt: 'Reflect on why building custom widgets with ARIA attributes often introduces more accessibility defects than using native HTML elements like <details> and <dialog>.',
      guidingQuestions: [
        'What accessibility features does a browser vendor implement in native elements that custom JavaScript widgets frequently overlook?',
        'How does the First Rule of ARIA protect software teams from technical debt?',
        'Why are native disclosures and forms resilient when JavaScript fails to load or execute?',
      ],
    } as ReflectionBlock,
    {
      id: 'blk-b22-d110-06',
      type: 'REFERENCE',
      order: 6,
      title: 'Batch 022 Reference Sheet: W3C WCAG 2.2 AA Standards & ARIA Authoring Practices',
      estimatedMinutes: 5,
      status: 'PUBLISHED',
      version: '1.0.0',
      links: [
        {
          title: 'W3C Web Content Accessibility Guidelines (WCAG) 2.2',
          url: 'https://www.w3.org/TR/WCAG22/',
        },
        {
          title: 'WAI-ARIA Authoring Practices Guide (APG): Disclosure (Show/Hide)',
          url: 'https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/',
        },
      ],
      documentationExtracts: [
        'WCAG 2.2 Criterion 1.4.3 Contrast (Minimum): The visual presentation of text and images of text has a contrast ratio of at least 4.5:1, except for large-scale text (3:1).',
        'WCAG 2.2 Criterion 2.5.8 Target Size (Minimum): The size of the target for pointer inputs is at least 24 by 24 CSS pixels, except where spacing or inline context applies.',
        'WCAG 2.2 Criterion 2.4.7 Focus Visible: Any keyboard operable user interface has a mode of operation where the keyboard focus indicator is visible.',
      ],
    } as ReferenceBlock,
  ],
};

// ── DAY 111: DEBUG — Accessibility Auditing & Web Performance Debugging (Focus, Contrast, DevTools CLS) ──
export const DAY_111_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m6-w22-022',
  dayNumber: 4,
  title: 'Accessibility Auditing & Web Performance Debugging (Focus, Contrast, DevTools CLS)',
  pedagogicalIntent: 'DEBUG',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b22-d111-01',
      type: 'THEORY',
      order: 1,
      title: 'Accessibility Inspection, Antipattern Remediation & Cumulative Layout Shift (CLS) Mechanics',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      summary: 'Master accessibility tree inspection in browser developer tools, remediate common accessibility antipatterns, understand automated auditing boundaries, and debug visual stability with Cumulative Layout Shift (CLS).',
      whatItIs: 'Web debugging encompasses both programmatic accessibility compliance and visual runtime stability:\n\nAccessibility Inspection & Antipatterns:\n- Accessibility Tree Inspection: Modern browser developer tools display the computed accessibility tree, revealing the computed role, accessible name, accessible description, and keyboard states for every DOM node.\n- Outline Suppression Antipattern: Setting * { outline: none; } or button { outline: 0; } strips visible focus rings, blinding keyboard users. Must be replaced with high-contrast :focus-visible rules.\n- Unlabelled Icon Buttons: An interactive button containing only an icon (<button><svg>...</svg></button>) has an empty accessible name. Must provide an accessible name via aria-label="Search" or an internal <span class="sr-only">Search</span> element.\n- Automated Audit Limitations: Automated scanners (axe-core, Lighthouse) detect only ~30-40% of accessibility barriers (such as missing labels, low contrast, duplicate IDs). A score of 100% or 0 automated violations does NOT guarantee full WCAG 2.2 AA conformance; manual keyboard navigation and screen-reader verification are mandatory.\n\nCumulative Layout Shift (CLS) Mechanics:\n- CLS is a Core Web Vital metric measuring visual stability during the user session by quantifying unexpected layout shifts of visible elements.\n- Thresholds: CLS <= 0.1 is Good (75th percentile of page loads); 0.1 < CLS <= 0.25 Needs Improvement; CLS > 0.25 is Poor.\n- Primary Root Causes: (1) Images or videos without explicit width and height attributes or CSS aspect-ratio; (2) Web fonts causing FOIT/FOUT layout jumps without font-display: optional or size-adjust metric overrides; (3) Dynamic asynchronous content injected above existing content without reserved container dimensions.\n- CSS Layout Shift Remedies: Always define width and height attributes on <img> tags (allowing the browser to calculate aspect ratio before image bytes arrive), use CSS aspect-ratio, and reserve minimum container heights for dynamic components.\n- Tooling Scope: Measure and debug CLS using browser Developer Tools (Performance panel, Rendering panel Web Vitals HUD) and Lighthouse CLI in a defined lab scenario without custom JavaScript observer scripts (preserving the zero-JS prerequisite firewall).',
      whyItExists: 'Prevents frustrating layout shifts that cause users to mis-click links or buttons, and eliminates hidden accessibility barriers that exclude users with disabilities.',
      problemSolved: 'Eliminates sudden content jumping during page loading, invisible keyboard focus states, unlabelled buttons, and false confidence from automated auditing tools.',
      mentalModel: 'The Moving Target at the Shooting Range: Clicking a button that suddenly jumps 200 pixels down because an un-dimensioned image just loaded above it is like trying to shoot a moving target that suddenly shifts right when you pull the trigger. Reserving aspect-ratio and image dimensions is building fixed stalls so targets never jump.',
      realWorldUse: 'Core Web Vitals compliance for Google search ranking, high-converting checkout flows, accessibility compliance audits, and enterprise web performance budgets.',
      commonMistakes: [
        'Assuming an axe-core audit with 0 violations means the site is fully accessible: automated tools cannot verify keyboard tab order logic, logical heading sequence, or accurate semantic descriptions.',
        'Omitting width and height attributes on <img> elements, forcing the browser to perform unexpected layout reflows when the image downloads.',
        'Relying on * { outline: none; } to remove focus rings for aesthetic reasons without providing an alternative :focus-visible indicator.',
        'Treating CLS as a WCAG accessibility criterion: CLS is a web performance Core Web Vital metric, not a WCAG guideline (though layout shifts harm usability).',
      ],
    } as TheoryBlock,
    {
      id: 'blk-b22-d111-02',
      type: 'EXAMPLE',
      order: 2,
      title: 'Remediating Outline Suppression and Layout Shifts in CSS',
      estimatedMinutes: 15,
      status: 'PUBLISHED',
      version: '1.0.0',
      description: 'Demonstrates fixing focus outline suppression, adding accessible names to icon buttons, and eliminating layout shift with aspect-ratio and explicit dimensions.',
      codeSnippet: `<!-- DEFECTIVE CSS & HTML (HIGH CLS & ACCESSIBILITY DEFECTS) -->
<style>
  /* DEFECT 1: Strips keyboard focus rings */
  button { outline: none; }

  /* DEFECT 2: No dimensions; causes massive CLS when image loads */
  .hero-img { width: 100%; height: auto; }
</style>
<button onclick="openMenu()"><svg class="hamburger-icon"></svg></button>
<img src="/banner.webp" class="hero-img" alt="Platform dashboard">

<!-- REMEDIATED ACCESSIBLE & STABLE CSS & HTML -->
<style>
  /* FIX 1: Provide high-contrast focus rings for keyboard navigation */
  button:focus-visible {
    outline: 3px solid #2563eb;
    outline-offset: 2px;
  }

  /* FIX 2: Set aspect-ratio and reserved dimensions to eliminate CLS */
  .hero-img-fixed {
    width: 100%;
    height: auto;
    aspect-ratio: 16 / 9;
    background-color: #f3f4f6; /* Placeholder skeleton while image loads */
    display: block;
  }
</style>
<!-- FIX 3: Add explicit accessible name to icon-only button -->
<button type="button" aria-label="Open Navigation Menu">
  <svg class="hamburger-icon" aria-hidden="true" width="24" height="24">
    <!-- SVG paths -->
  </svg>
</button>
<!-- FIX 4: Explicit width and height attributes calculate aspect ratio upfront -->
<img 
  src="/banner.webp" 
  width="1200" 
  height="675" 
  class="hero-img-fixed" 
  alt="Platform dashboard analytics overview"
>`,
      explanation: 'The remediated code restores visible keyboard focus rings using button:focus-visible with a 3px high-contrast outline. The icon button receives an accessible name via aria-label="Open Navigation Menu" and hides the decorative SVG with aria-hidden="true". The image includes explicit width="1200", height="675", and CSS aspect-ratio: 16 / 9, allowing the browser to reserve the exact layout box during initial DOM construction, reducing CLS to 0.',
    } as ExampleBlock,
    {
      id: 'blk-b22-d111-03',
      type: 'DEBUGGING_CHALLENGE',
      order: 3,
      title: 'Debugging Challenge: Repairing an Inaccessible, Shifting E-Commerce Interface',
      estimatedMinutes: 30,
      status: 'PUBLISHED',
      version: '1.0.0',
      problemDescription: 'An e-commerce product showcase has multiple critical accessibility and performance defects: focus outlines are completely suppressed, product images lack dimensions causing severe Cumulative Layout Shift (CLS = 0.38 in DevTools), icon-only cart buttons have empty accessible names, and price text fails WCAG 1.4.3 color contrast.',
      symptom: 'Automated axe-core scan reports 4 critical violations (button-name, color-contrast), keyboard users cannot tell which element has focus, and DevTools Performance audit records a failing CLS score of 0.38 upon image load.',
      brokenArtifact: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Developer Store</title>
  <style>
    * { outline: none !important; }
    body { font-family: sans-serif; background: #ffffff; color: #111; }
    .product-card { border: 1px solid #e5e7eb; padding: 16px; width: 300px; }
    .product-img { width: 100%; height: auto; } /* No aspect ratio or height! */
    .price { color: #a1a1aa; font-size: 14px; }  /* FAILS 1.4.3: 2.4:1 contrast */
    .btn-cart { background: #3b82f6; border: none; padding: 6px; } /* Target size < 24px */
  </style>
</head>
<body>
  <div class="product-card">
    <img src="keyboard.jpg" class="product-img" alt="Mechanical Keyboard">
    <h2>Mechanical Keyboard</h2>
    <p class="price">$149.00</p>
    <button class="btn-cart">
      <svg width="16" height="16"><path d="M0 0h16v16H0z"/></svg>
    </button>
  </div>
</body>
</html>`,
      targetCompetencyId: COMPETENCY_ID_SEMANTIC_HTML_AND_ACCESSIBILITY,
      remediationSteps: [
        'Remove the global * { outline: none !important; } rule and add a high-contrast :focus-visible style for interactive elements.',
        'Add width="600" height="400" and CSS aspect-ratio: 3 / 2 to the product image to eliminate the layout shift, reducing CLS to <= 0.1.',
        'Add aria-label="Add Mechanical Keyboard to Cart" to the icon button, and mark the internal SVG with aria-hidden="true".',
        'Increase button padding or min-height to ensure pointer target size is at least 24x24 CSS pixels complying with WCAG 2.5.8.',
        'Fix the price text color to #374151 or darker to achieve at least 4.5:1 contrast against #ffffff, satisfying WCAG 1.4.3.',
      ],
      fixedArtifact: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Developer Store</title>
  <style>
    body { font-family: sans-serif; background: #ffffff; color: #111827; }
    .product-card { border: 1px solid #4b5563; padding: 16px; width: 300px; border-radius: 8px; }
    .product-img { 
      width: 100%; 
      height: auto; 
      aspect-ratio: 3 / 2; 
      display: block; 
      background-color: #f3f4f6;
    }
    .price { color: #1f2937; font-size: 16px; font-weight: 600; } /* 12.6:1 contrast (>= 4.5:1) */
    .btn-cart { 
      background: #1d4ed8; 
      color: #ffffff;
      border: none; 
      min-width: 44px; 
      min-height: 44px; /* >= 24x24 px target size */
      padding: 10px; 
      border-radius: 6px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    .btn-cart:focus-visible {
      outline: 3px solid #1d4ed8;
      outline-offset: 2px;
    }
  </style>
</head>
<body>
  <div class="product-card">
    <img src="keyboard.jpg" width="600" height="400" class="product-img" alt="Ergonomic mechanical keyboard with backlit keys">
    <h2>Mechanical Keyboard</h2>
    <p class="price">$149.00</p>
    <button type="button" class="btn-cart" aria-label="Add Mechanical Keyboard to Cart">
      <svg width="20" height="20" aria-hidden="true"><path d="M0 0h20v20H0z"/></svg>
    </button>
  </div>
</body>
</html>`,
    } as DebuggingChallengeBlock,
    {
      id: 'blk-b22-d111-04',
      type: 'KNOWLEDGE_CHECK',
      order: 4,
      title: 'Knowledge Check: CLS Root Causes & Accessibility Antipatterns',
      estimatedMinutes: 10,
      status: 'PUBLISHED',
      version: '1.0.0',
      diagnosticQuestion: 'Why does adding explicit width and height attributes on an <img> element in HTML eliminate Cumulative Layout Shift (CLS), even when CSS sets width: 100% and height: auto?',
      options: [
        'Modern browsers use the HTML width and height attributes to compute the intrinsic aspect ratio before the image file is downloaded, allowing layout space to be reserved immediately.',
        'The width and height attributes force the image to download over a high-speed TCP channel.',
        'HTML width and height disable browser reflow completely for the entire page.',
        'The attributes convert the image into an SVG vector graphic automatically.',
      ],
      correctIndex: 0,
      explanation: 'Modern browsers automatically map the HTML width and height attributes into a default aspect-ratio CSS property. When CSS specifies width: 100% and height: auto, the browser calculates the corresponding height from the aspect ratio and reserves the space during initial layout, preventing layout shifts when image bytes arrive.',
      misconceptionIdentified: 'Believing HTML width and height attributes are ignored when CSS responsive sizing is applied.',
    } as KnowledgeCheckBlock,
    {
      id: 'blk-b22-d111-05',
      type: 'REFLECTION',
      order: 5,
      title: 'Reflection: Bridging the Gap Between Automated Scans and Manual Verification',
      estimatedMinutes: 5,
      status: 'PUBLISHED',
      version: '1.0.0',
      prompt: 'Reflect on why automated auditing tools like axe-core and Lighthouse can only detect a fraction of real-world accessibility issues, and what manual tests a developer must always perform.',
      guidingQuestions: [
        'Can an automated scanner verify whether an alt attribute accurately describes an image?',
        'How can a developer test whether tab order makes logical sense without using a mouse?',
        'Why is manual keyboard navigation with Tab and Shift+Tab an indispensable testing skill?',
      ],
    } as ReflectionBlock,
    {
      id: 'blk-b22-d111-06',
      type: 'REFERENCE',
      order: 6,
      title: 'Batch 022 Reference Sheet: Web Vitals CLS Guide & axe-core Rule Documentation',
      estimatedMinutes: 5,
      status: 'PUBLISHED',
      version: '1.0.0',
      links: [
        {
          title: 'web.dev: Cumulative Layout Shift (CLS) Guide',
          url: 'https://web.dev/articles/cls',
        },
        {
          title: 'Deque University: axe-core Rule Descriptions',
          url: 'https://dequeuniversity.com/rules/axe/4.9',
        },
      ],
      documentationExtracts: [
        'A good CLS score is 0.1 or less. A score greater than 0.25 is poor.',
        'Automated tools typically find 30% to 40% of accessibility issues. Manual testing with keyboards and screen readers is required for comprehensive verification.',
      ],
    } as ReferenceBlock,
  ],
};

// ═══════════════════════════════════════════════════════════════════════════════
// DAY 112: FORMATIVE ASSESSMENT — Declarative Accessible Web Component & Layout Stability Engine
// ═══════════════════════════════════════════════════════════════════════════════
export const DAY_112_ASSESSMENT: Assessment = {
  id: 'asm-pfs-m6-w22-022',
  assessmentCode: 'ASM-PFS-M6-W22-022',
  title: 'Formative Assessment: Declarative Accessible Web Component & Layout Stability Engine',
  summary: 'Architect a production-grade, zero-JavaScript semantic web page combining accessible forms, declarative <details>/<summary> disclosures, semantic <dialog> structure, WCAG 2.2 AA target size and contrast conformance, and layout stability.',
  difficulty: 'ADVANCED',
  type: 'PROJECT',
  mode: 'FORMATIVE',
  passingScorePercentage: 70,
  timeLimitMinutes: 95,
  status: 'PUBLISHED',
  version: '1.0.0',
  targetCompetencyId: COMPETENCY_ID_WEB_MARKUP_AND_ACCESSIBILITY,
  rubricDimensions: [
    {
      id: 'dim-b22-01',
      name: 'Semantic Document Tree & Landmark Hierarchy',
      weight: 0.20,
      maxPoints: 20,
      minimumPassingScore: 10,
      isMandatory: true,
      description: 'Validates strict HTML5 semantic landmarks (<header>, <nav>, <main>, <article>, <section>, <footer>) and strictly ordered heading levels (h1 -> h2 -> h3). MANDATORY COMPETENCY FLOOR: Minimum 50% score (10 / 20 pts) required to pass.',
      criteria: 'One main per document; proper landmark hierarchy; zero heading skips.',
    },
    {
      id: 'dim-b22-02',
      name: 'Accessible Form Architecture & Native Validation',
      weight: 0.20,
      maxPoints: 20,
      description: 'Validates explicit 1:1 label association (for="id"), grouped fieldsets with legends for radio/checkbox groups, and declarative constraint validation attributes.',
      criteria: 'All inputs explicitly labeled; fieldsets group related controls; native constraints enforced.',
    },
    {
      id: 'dim-b22-03',
      name: 'Native Declarative Disclosures & Semantic Dialogs',
      weight: 0.20,
      maxPoints: 20,
      minimumPassingScore: 10,
      isMandatory: true,
      description: 'Validates zero-JS interactive disclosure via native <details>/<summary> and semantic <dialog> structural markup. MANDATORY COMPETENCY FLOOR: Minimum 50% score (10 / 20 pts) required to pass.',
      criteria: 'Interactive disclosures function purely in HTML/CSS; dialog markup provides semantic structure.',
    },
    {
      id: 'dim-b22-04',
      name: 'WCAG 2.2 AA Contrast & Target Size Metrics',
      weight: 0.15,
      maxPoints: 15,
      description: 'Validates 4.5:1 text contrast (1.4.3), 3:1 UI component contrast (1.4.11), and 24x24 CSS pixel minimum pointer target sizes (2.5.8).',
      criteria: 'All text and UI elements meet or exceed WCAG AA contrast; interactive targets >= 24x24px.',
    },
    {
      id: 'dim-b22-05',
      name: 'Keyboard Operability & Focus Visibility',
      weight: 0.10,
      maxPoints: 10,
      description: 'Validates high-contrast :focus-visible outlines and zero outline suppression antipatterns.',
      criteria: 'Visible focus indicators preserved; outlines never stripped without accessible replacement.',
    },
    {
      id: 'dim-b22-06',
      name: 'Layout Stability & Zero-Shift CLS Architecture',
      weight: 0.10,
      maxPoints: 10,
      description: 'Validates explicit width and height attributes on media and CSS aspect-ratio to reserve layout geometry and prevent layout shifts.',
      criteria: 'Media elements define explicit aspect ratios; container dimensions reserved.',
    },
    {
      id: 'dim-b22-07',
      name: 'Zero-JavaScript Prerequisite Firewall Integrity',
      weight: 0.05,
      maxPoints: 5,
      description: 'Verifies strict adherence to the zero-JavaScript prerequisite firewall for Batch 022.',
      criteria: 'Strictly zero script tags, inline event attributes, or JS pseudo-protocols.',
    },
  ],
  items: [
    {
      id: 'item-b22-d112-01',
      type: 'PROJECT',
      title: 'Declarative Accessible Web Component & Layout Stability Engine',
      description: 'Construct a complete, zero-JavaScript semantic web portal with accessible forms, native disclosure components, WCAG 2.2 AA compliant CSS styling, and zero layout shift.',
      prompt: 'Refactor and complete the provided web portal markup and stylesheet according to the strict declarative accessibility specification. Your implementation must execute entirely without JavaScript.',
      starterCode: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Customer Service Portal</title>
  <style>
    /* TODO: Implement WCAG 2.2 AA compliant CSS */
    button { outline: none; }
  </style>
</head>
<body>
  <div>
    <div>Navigation</div>
    <div>
      <div>Account Settings</div>
      <form>
        <input type="text" placeholder="Username">
        <input type="email" placeholder="Email">
        <button type="submit">Save</button>
      </form>
    </div>
  </div>
</body>
</html>`,
      solutionCode: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Accessible Customer Service Portal</title>
  <style>
    :root {
      --color-bg: #ffffff;
      --color-text: #1a202c;       /* Contrast 15.6:1 against #ffffff (WCAG AA >= 4.5:1) */
      --color-primary: #2b6cb0;    /* Contrast 4.6:1 against #ffffff */
      --color-focus: #0056b3;
      --color-border: #4a5568;     /* Contrast 4.6:1 against #ffffff (WCAG AA >= 3:1) */
    }

    body {
      font-family: system-ui, -apple-system, sans-serif;
      line-height: 1.6;
      color: var(--color-text);
      background-color: var(--color-bg);
      margin: 0;
      padding: 1.5rem;
    }

    /* WCAG 2.4.7 Focus Visible: Ensure keyboard focus indicator is prominent */
    :focus-visible {
      outline: 3px solid var(--color-focus);
      outline-offset: 2px;
    }

    /* WCAG 2.5.8 Target Size (Minimum): Minimum 24x24 CSS pixels */
    button, summary, input, select, textarea {
      min-width: 24px;
      min-height: 24px;
      font-size: 1rem;
      padding: 0.5rem 0.75rem;
      border: 1.5px solid var(--color-border);
      border-radius: 4px;
      box-sizing: border-box;
    }

    button {
      background-color: var(--color-primary);
      color: #ffffff;
      cursor: pointer;
      font-weight: 600;
      min-height: 44px;
      min-width: 44px;
    }

    fieldset {
      border: 1.5px solid var(--color-border);
      border-radius: 6px;
      padding: 1rem;
      margin-bottom: 1.5rem;
    }

    legend {
      font-weight: 700;
      padding: 0 0.5rem;
    }

    .form-group {
      margin-bottom: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    label {
      font-weight: 600;
    }

    /* CLS Mitigation: Reserve dimensions and aspect ratio */
    .hero-banner {
      width: 100%;
      max-width: 800px;
      height: auto;
      aspect-ratio: 16 / 9;
      display: block;
      border-radius: 6px;
    }

    details {
      border: 1.5px solid var(--color-border);
      border-radius: 6px;
      padding: 0.75rem;
      margin-bottom: 1rem;
    }

    summary {
      cursor: pointer;
      font-weight: 700;
      padding: 0.5rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
  </style>
</head>
<body>
  <header>
    <h1>Customer Service & Account Portal</h1>
    <nav aria-label="Main Navigation">
      <ul>
        <li><a href="#settings">Settings</a></li>
        <li><a href="#faq">FAQ</a></li>
      </ul>
    </nav>
  </header>

  <main>
    <section id="settings" aria-labelledby="heading-settings">
      <h2 id="heading-settings">Account Profile & Notification Settings</h2>
      
      <img src="https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80" 
           alt="Team collaboration in modern office setting" 
           class="hero-banner" 
           width="800" 
           height="450">

      <form action="/api/profile" method="POST">
        <fieldset>
          <legend>Personal Information</legend>
          <div class="form-group">
            <label for="user-full-name">Full Name (Required)</label>
            <input type="text" id="user-full-name" name="full_name" required minlength="2" autocomplete="name">
          </div>
          <div class="form-group">
            <label for="user-email-address">Email Address (Required)</label>
            <input type="email" id="user-email-address" name="email" required autocomplete="email">
          </div>
        </fieldset>

        <fieldset>
          <legend>Delivery Preference</legend>
          <div>
            <input type="radio" id="pref-standard" name="delivery" value="standard" checked>
            <label for="pref-standard">Standard Delivery (3-5 business days)</label>
          </div>
          <div>
            <input type="radio" id="pref-express" name="delivery" value="express">
            <label for="pref-express">Express Delivery (1-2 business days)</label>
          </div>
        </fieldset>

        <button type="submit">Save Profile Settings</button>
      </form>
    </section>

    <section id="faq" aria-labelledby="heading-faq">
      <h2 id="heading-faq">Frequently Asked Questions</h2>
      
      <details>
        <summary>How do I reset my secure password?</summary>
        <p>You can request a password reset link by submitting your registered email address on the security recovery page.</p>
      </details>

      <details>
        <summary>Where can I download my audited statement?</summary>
        <p>Audited statements are accessible under the Billing and Compliance tab at the end of each billing cycle.</p>
      </details>
    </section>

    <!-- Semantic Dialog Structural Markup (Declarative structure) -->
    <dialog id="session-timeout-dialog" aria-labelledby="dialog-heading">
      <h2 id="dialog-heading">Session Timeout Notice</h2>
      <p>Your secure session is scheduled to expire in 2 minutes due to inactivity.</p>
      <form method="dialog">
        <button type="submit">Acknowledge</button>
      </form>
    </dialog>
  </main>

  <footer>
    <p>&copy; 2026 PinIT Career OS. All rights reserved. Conforms to WCAG 2.2 Level AA guidelines.</p>
  </footer>
</body>
</html>`,
      rubric: [
        {
          id: 'dim-b22-01',
          name: 'Semantic Document Tree & Landmark Hierarchy',
          weight: 0.20,
          maxPoints: 20,
          minimumPassingScore: 10,
          isMandatory: true,
          description: 'Validates strict HTML5 semantic landmarks and heading hierarchy.',
          criteria: 'One main per document; proper landmark hierarchy; zero heading skips.',
        },
        {
          id: 'dim-b22-02',
          name: 'Accessible Form Architecture & Native Validation',
          weight: 0.20,
          maxPoints: 20,
          description: 'Validates explicit 1:1 label association and grouped fieldsets.',
          criteria: 'All inputs explicitly labeled; fieldsets group related controls.',
        },
        {
          id: 'dim-b22-03',
          name: 'Native Declarative Disclosures & Semantic Dialogs',
          weight: 0.20,
          maxPoints: 20,
          minimumPassingScore: 10,
          isMandatory: true,
          description: 'Validates zero-JS interactive disclosure via native <details>/<summary>.',
          criteria: 'Interactive disclosures function purely in HTML/CSS.',
        },
        {
          id: 'dim-b22-04',
          name: 'WCAG 2.2 AA Contrast & Target Size Metrics',
          weight: 0.15,
          maxPoints: 15,
          description: 'Validates 4.5:1 text contrast and 24x24 CSS px target sizes.',
          criteria: 'All text meets contrast; interactive targets >= 24x24px.',
        },
        {
          id: 'dim-b22-05',
          name: 'Keyboard Operability & Focus Visibility',
          weight: 0.10,
          maxPoints: 10,
          description: 'Validates high-contrast :focus-visible outlines.',
          criteria: 'Visible focus indicators preserved.',
        },
        {
          id: 'dim-b22-06',
          name: 'Layout Stability & Zero-Shift CLS Architecture',
          weight: 0.10,
          maxPoints: 10,
          description: 'Validates explicit width and height attributes and aspect-ratio.',
          criteria: 'Media elements define explicit aspect ratios.',
        },
        {
          id: 'dim-b22-07',
          name: 'Zero-JavaScript Prerequisite Firewall Integrity',
          weight: 0.05,
          maxPoints: 5,
          description: 'Verifies strict adherence to the zero-JavaScript prerequisite firewall.',
          criteria: 'Zero script tags, inline event attributes, or JS pseudo-protocols.',
        },
      ],
      visibleTests: [
        {
          name: 'test_semantic_landmarks_present',
          assertion: 'assert("<header" in solution and "<nav" in solution and "<main" in solution and "<footer" in solution)',
          points: 15,
          tier: 'VISIBLE',
        },
        {
          name: 'test_accessible_labels_and_fieldsets',
          assertion: 'assert("<fieldset>" in solution and "<legend>" in solution and "for=" in solution)',
          points: 15,
          tier: 'VISIBLE',
        },
        {
          name: 'test_declarative_details_summary_disclosures',
          assertion: 'assert("<details>" in solution and "<summary>" in solution)',
          points: 15,
          tier: 'VISIBLE',
        },
      ],
      adversarialTests: [
        {
          name: 'test_no_outline_suppression_antipattern',
          assertion: 'assert("outline: none" not in solution and "outline: 0" not in solution or ":focus-visible" in solution)',
          points: 15,
          tier: 'ADVERSARIAL',
        },
        {
          name: 'test_cls_image_dimensions_and_aspect_ratio',
          assertion: 'assert("width=" in solution and "height=" in solution and "aspect-ratio" in solution)',
          points: 15,
          tier: 'ADVERSARIAL',
        },
        {
          name: 'test_wcag_target_size_governance',
          assertion: 'assert("min-height" in solution or "min-width" in solution or "24px" in solution)',
          points: 15,
          tier: 'ADVERSARIAL',
        },
      ],
      integrityTests: [
        {
          name: 'test_zero_javascript_firewall_enforcement',
          assertion: 'assert(("<" + "script") not in solution.lower() and "onclick=" not in solution.lower() and "javascript:" not in solution.lower())',
          points: 10,
          tier: 'INTEGRITY',
        },
      ],
    },
  ],
};

export const DAY_112_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m6-w22-022',
  dayNumber: 5,
  title: 'Formative Assessment: Declarative Accessible Web Component & Layout Stability Engine',
  pedagogicalIntent: 'TRANSFER',
  assessmentId: 'asm-pfs-m6-w22-022',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b22-d112-01',
      type: 'TRANSFER_CHALLENGE',
      order: 1,
      title: 'Transfer Challenge: Declarative Accessible Web Component & Layout Stability Engine',
      estimatedMinutes: 75,
      status: 'PUBLISHED',
      version: '1.0.0',
      targetCompetencyId: COMPETENCY_ID_WEB_MARKUP_AND_ACCESSIBILITY,
      unfamiliarDomainContext: 'High-Integrity Public Utility & Government Services Portal',
      task: 'Refactor and author a complete, accessible web portal adhering to WCAG 2.2 AA foundations, explicit form associations, native declarative disclosures, and zero-shift layout rules without using any JavaScript.',
    } as TransferChallengeBlock,
    {
      id: 'blk-b22-d112-02',
      type: 'KNOWLEDGE_CHECK',
      order: 2,
      title: 'Knowledge Check: Declarative Accessibility & CLS Invariants',
      estimatedMinutes: 10,
      status: 'PUBLISHED',
      version: '1.0.0',
      diagnosticQuestion: 'Which combination of HTML and CSS techniques guarantees keyboard-accessible disclosures and prevents Cumulative Layout Shift without executing JavaScript?',
      options: [
        'Using native <details> and <summary> for disclosure, with explicit width/height attributes and CSS aspect-ratio on media elements.',
        'Using custom <div> elements with JavaScript click handlers and window.onload dimension calculation.',
        'Setting * { outline: none; } and display: flex on all parent containers.',
        'Using CSS display: none with hover pseudo-classes to show submenus.',
      ],
      correctIndex: 0,
      explanation: 'The native <details> and <summary> elements provide built-in keyboard accessibility, focus management, and accessibility tree updates completely without JavaScript. Providing explicit width and height attributes allows browsers to compute aspect ratio and reserve layout dimensions before image bytes arrive, eliminating CLS.',
      misconceptionIdentified: 'Believing JavaScript is required for accessible expand/collapse disclosures or layout shift prevention.',
    } as KnowledgeCheckBlock,
    {
      id: 'blk-b22-d112-03',
      type: 'REFLECTION',
      order: 3,
      title: 'Batch 022 Engineering Retrospective: Declarative Power Before Imperative Code',
      estimatedMinutes: 5,
      status: 'PUBLISHED',
      version: '1.0.0',
      prompt: 'Reflect on how utilizing native semantic HTML and declarative CSS simplifies architecture, reduces failure points, and inherently boosts accessibility compared to imperative JavaScript.',
      guidingQuestions: [
        'How does maximizing native HTML semantics and declarative CSS reduce the defect surface compared to imperative JavaScript UI implementations?',
        'Why must accessibility and layout stability be architected into markup from day one rather than retrofitted as an afterthought?',
      ],
    } as ReflectionBlock,
    {
      id: 'blk-b22-d112-04',
      type: 'REFERENCE',
      order: 4,
      title: 'Batch 022 Reference Sheet: Declarative Web Engineering Standards',
      estimatedMinutes: 5,
      status: 'PUBLISHED',
      version: '1.0.0',
      links: [
        {
          title: 'W3C HTML 5.3: The details and summary elements',
          url: 'https://www.w3.org/TR/html53/interactive-elements.html#the-details-element',
        },
        {
          title: 'W3C WCAG 2.2: Understanding Target Size (Minimum)',
          url: 'https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html',
        },
      ],
      documentationExtracts: [
        'HTML Living Standard: The details element represents a disclosure widget from which the user can obtain additional information or controls.',
        'WCAG 2.2 Level AA Criterion 2.5.8: Pointer target size must be at least 24 by 24 CSS pixels, or provide sufficient offset spacing.',
      ],
    } as ReferenceBlock,
  ],
};

// ── BATCH 022 MANIFEST (COMPLETE 5-DAY BATCH) ──
export const BATCH_022_MANIFEST: BatchContentManifest = {
  batchId: 'batch-pfs-m6-w22-022',
  batchCode: 'P2-M6-W22-BATCH022',
  title: 'Semantic HTML5, Accessible Forms, Declarative Accessibility & Web Performance',
  difficulty: 'ADVANCED',
  days: [
    DAY_108_MANIFEST,
    DAY_109_MANIFEST,
    DAY_110_MANIFEST,
    DAY_111_MANIFEST,
    DAY_112_MANIFEST,
  ],
  isPartial: false,
  version: '1.0.0',
  status: 'PUBLISHED',
  createdAt: '2026-09-07T00:00:00.000Z',
  updatedAt: '2026-09-08T00:00:00.000Z',
};

