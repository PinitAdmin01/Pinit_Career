import { buildEnrichedDayQuests } from './curriculumEnricher';
export interface DayConfig {
  title: string;
  desc: string;
  syllabus: string[];
  eTitle: string;
  eDesc: string;
  eStarter: string;
  eHint: string;
  eTest: string;
  aTitle: string;
  aDesc: string;
  aStarter: string;
  aHint: string;
  aTest: string;
}

export const DESIGN_30_DAYS_CONFIGS: DayConfig[] = [
  {
    title: "What is HTML? — Document Structures, Tags and Semantic Layout Rules",
    desc: "Every website you visit is built on HTML (HyperText Markup Language). Think of a web page like a house: HTML is the brick-and-mortar skeleton (structure), CSS is the paint and furniture (styling), and JavaScript is the electricity and water piping (functionality). HTML works using TAGS enclosed in angle brackets, like <p>This is a paragraph</p>. Tags usually come in pairs: an opening tag (<p>) and a closing tag (</p>). Let us learn the difference between standard tags and SEMANTIC TAGS. A non-semantic tag (like <div> or <span>) tells the browser absolutely nothing about its content — it is just a generic box. A semantic tag (like <header>, <nav>, <main>, or <footer>) tells the browser and screen readers exactly what purpose that section serves. Why does this matter? (1) Accessibility: visually impaired users use software called screen readers to read web pages aloud. Semantic tags allow screen readers to skip headers and jump straight to the <main> content. (2) SEO (Search Engine Optimization): Google's web crawler reads your semantic tags to understand what your website is about, ranking it higher in search results. (3) Code Readability: clean semantic structures make it easy for other developers to read and maintain your code. (Real world: If you inspect the HTML code of a news site like The New York Times, you will see they do not just use generic div tags. They wrap their navigation in a <nav> tag, their primary article in an <article> tag, and the side ads in an <aside> tag. Doing this makes their site highly accessible and ranks it at the top of search queries.)",
    syllabus: ["HTML structure = the blueprint of a web page. Tags (opening and closing) wrap text to define elements. Document outline structure starts with <html>, <head> (metadata), and <body> (visible content).", "Semantic HTML = tags with meaning. <header> (navigation/branding), <nav> (menu links), <main> (core content), <article> (isolated articles/posts), <section> (related groupings), <footer> (page bottom).", "Heading hierarchy rules: <h1> is the single most important heading per page (the title). Subheadings must nested logically: <h2> for main topics, <h3> for subtopics, <h4> for minor details. Never skip levels."],
    eTitle: "Exam: HTML Structure Checker",
    eDesc: "Not tested on day 1",
    eStarter: "",
    eHint: "",
    eTest: "",
    aTitle: "Assignment: Semantic Layout Map",
    aDesc: "Not tested on day 1",
    aStarter: "",
    aHint: "",
    aTest: ""
  },
  {
    title: "The CSS Box Model — Content, Padding, Border, Margin and Box-Sizing",
    desc: "In CSS, every single element on a web page is treated as a rectangular box. Even if a button has rounded corners or look like a circle, the browser still calculates its layout as a rectangle. The CSS Box Model defines how the dimensions of these elements are calculated. The Box Model has four nested layers: (1) Content: the core area where text, images, or child elements are displayed. (2) Padding: the clear space immediately surrounding the content, inside the border. (3) Border: the line wrapped around the padding and content. You can set its thickness, style (solid, dashed), and color. (4) Margin: the empty space outside the border that separates this element from adjacent elements on the page. BOX-SIZING MODES: by default, CSS uses 'content-box'. If you set width: 300px, padding: 20px, and border: 5px, the final visible width of your element on the screen is 350px (300 + 20*2 + 5*2). This makes layout calculations difficult and frequently breaks grid layouts. To fix this, we use 'border-box'. When you set 'box-sizing: border-box', the padding and border are subtracted from the width. Setting width: 300px with 20px padding means the content area shrinks to 250px, but the total visible element remains exactly 300px. (Real world: Almost 100 percent of professional websites reset the default box model by adding * { box-sizing: border-box; } at the top of their CSS files. This simple reset ensures that adding padding to buttons or card grids never breaks your website layouts.)",
    syllabus: ["The CSS Box Model: 4 layers. Content (inner area), Padding (internal space inside border), Border (outer edge line), Margin (external space separating elements).", "box-sizing modes: content-box (default, width applies only to content, padding adds to size) vs border-box (width includes padding and border, keeping layout sizes fixed).", "Vertical margin collapse: adjacent vertical margins of elements merge together to share the larger value instead of stacking. Margin collapse does not affect horizontal margins."],
    eTitle: "Exam: Box Model sizing",
    eDesc: "Not tested on day 2",
    eStarter: "",
    eHint: "",
    eTest: "",
    aTitle: "Assignment: Display Box Mapper",
    aDesc: "Not tested on day 2",
    aStarter: "",
    aHint: "",
    aTest: ""
  },
  {
    title: "CSS Position, Z-Index & Layout Coordinates",
    desc: "Master static, relative, absolute, fixed, sticky properties, z-index stacks, overflow controls. (Real world: Floating dropdown containers require relative anchor nodes and z-indexes.)",
    syllabus: ["Static relative absolute configurations rules", "Fixed and sticky position behaviors", "Z-index stacking contexts margins rules"],
    eTitle: "Exam: Absolute Anchor Offset Validator",
    eDesc: "Write a JS function `validateAbsoluteAnchor(parentPos, childPos)` returning true if parentPos is not 'static' and childPos is 'absolute'.",
    eStarter: "function validateAbsoluteAnchor(parentPos, childPos) {\n    // Write your code here\n    \n}",
    eHint: "Check parentPos !== 'static' and childPos === 'absolute'.",
    eTest: "if (typeof validateAbsoluteAnchor !== 'function') throw new Error('Method validateAbsoluteAnchor not found.');\nif (validateAbsoluteAnchor('relative', 'absolute') !== true) throw new Error('Validation failed');\nif (validateAbsoluteAnchor('static', 'absolute') !== false) throw new Error('Static parent allowed incorrectly');",
    aTitle: "Assignment: Z-Index Stack Order Inspector",
    aDesc: "Write a JS function `isStackOrderValid(z1, z2)` returning true if z2 > z1 (assuring z2 is layered above z1).",
    aStarter: "function isStackOrderValid(z1, z2) {\n    // Write your code here\n    \n}",
    aHint: "Check if z2 is numerically greater than z1.",
    aTest: "if (typeof isStackOrderValid !== 'function') throw new Error('Method isStackOrderValid not found.');\nif (isStackOrderValid(10, 20) !== true) throw new Error('Stack order validator failed');"
  },
  {
    title: "Typography scale grids & responsive font scaling",
    desc: "Master layout scales. (Real world: Corporate portals define typography grids using root em (rem) parameters, ensuring clean page zooming.)",
    syllabus: ["Typography scaling ranges configuration", "Root font-size rem conversions", "Fluid typography responsive bounds"],
    eTitle: "Exam: Typography Rem Converter",
    eDesc: "Write a JS function `convertPxToRem(px, base)` returning rem decimal value: `px / base`. Return 1 if base <= 0.",
    eStarter: "function convertPxToRem(px, base) {\n    // Write your code here\n    \n}",
    eHint: "Divide px by base unit directly.",
    eTest: "if (typeof convertPxToRem !== 'function') throw new Error('Method convertPxToRem not found');\nif (convertPxToRem(32, 16) !== 2) throw new Error('Rem conversion failed');",
    aTitle: "Assignment: Responsive font boundary",
    aDesc: "Write a JS function `isFontScaleAllowed(sizeRem, minRem, maxRem)` returning true if sizeRem >= minRem and sizeRem <= maxRem.",
    aStarter: "function isFontScaleAllowed(sizeRem, minRem, maxRem) {\n    // Write your code here\n    \n}",
    aHint: "Compare input size against bounds.",
    aTest: "if (typeof isFontScaleAllowed !== 'function') throw new Error('Method isFontScaleAllowed not found');"
  },
  {
    title: "Design Tokens: Color Palette system builders",
    desc: "Master design token colors schemas. (Real world: Frontend libraries package corporate themes into design tokens JSON files, verifying hex color codes.)",
    syllabus: ["Design tokens variables setups", "Color palette HEX conversions", "Mapping token namespaces"],
    eTitle: "Exam: Color HEX Token Validator",
    eDesc: "Write a JS function `isValidHexColor(hexStr)` returning true if hexStr starts with '#' and is exactly 7 characters (e.g. #FFFFFF) or 4 characters (e.g. #FFF). Returns false otherwise.",
    eStarter: "function isValidHexColor(hexStr) {\n    // Write your code here\n    \n}",
    eHint: "Check length is 7 or 4, verify startsWith prefix, check hex regex: /^#[0-9a-fA-F]{3,6}$/.",
    eTest: "if (typeof isValidHexColor !== 'function') throw new Error('Method isValidHexColor not found');\nif (isValidHexColor('#ff0000') !== true) throw new Error('Hex verification failed');",
    aTitle: "Assignment: Color token namespace formatter",
    aDesc: "Write a JS function `formatTokenName(category, name)` returning string: `token-[category]-[name]` in lowercase.",
    aStarter: "function formatTokenName(category, name) {\n    // Write your code here\n    \n}",
    aHint: "Concatenate category and name, formatting to lowercase.",
    aTest: "if (typeof formatTokenName !== 'function') throw new Error('Method formatTokenName not found');"
  },
  {
    title: "Design Tokens: Layout spacing metrics limits",
    desc: "Master system grids margins rules. (Real world: Designers compile spacing variables lists, constraining components padding sizes to multiples of 8px.)",
    syllabus: ["Grid spacing multiplier standards (8px)", "Padding and margin token scales", "Auditing style spacing properties"],
    eTitle: "Exam: Spacing Grid Multiplier Checker",
    eDesc: "Write a JS function `isSpacingMultiOf8(pixelValue)` returning true if pixelValue % 8 === 0. Returns false if negative.",
    eStarter: "function isSpacingMultiOf8(pixelValue) {\n    // Write your code here\n    \n}",
    eHint: "Verify modulo division checks. Check positive bounds.",
    eTest: "if (typeof isSpacingMultiOf8 !== 'function') throw new Error('Method isSpacingMultiOf8 not found');\nif (isSpacingMultiOf8(32) !== true) throw new Error('Spacing grid check failed');",
    aTitle: "Assignment: Padding scale finder",
    aDesc: "Write a JS function `getSpacingToken(pixelValue)` returning string: `space-' + (pixelValue / 8)`. Return 'space-0' if negative.",
    aStarter: "function getSpacingToken(pixelValue) {\n    // Write your code here\n    \n}",
    aHint: "Divide input by 8 and format.",
    aTest: "if (typeof getSpacingToken !== 'function') throw new Error('Method getSpacingToken not found');"
  },
  {
    title: "Figma Variables export maps validator",
    desc: "Learn Figma layout tokens mapping. (Real world: Translation pipelines check exports files, converting design tokens JSON outputs to CSS variables formats.)",
    syllabus: ["Figma variables design tokens configurations", "JSON tokens export maps structures", "Converting JSON design maps to CSS variables"],
    eTitle: "Exam: Figma Tokens JSON Validator",
    eDesc: "Write a JS function `isValidTokenJson(jsonStr)` returning true if jsonStr is valid JSON and parsed object contains property 'colors' and 'spacing'. Returns false otherwise.",
    eStarter: "function isValidTokenJson(jsonStr) {\n    // Write your code here\n    \n}",
    eHint: "Wrap JSON.parse in try-catch, verifying properties existence.",
    eTest: "if (typeof isValidTokenJson !== 'function') throw new Error('Method isValidTokenJson not found');\nconst tok = '{\"colors\":{},\"spacing\":{}}';\nif (isValidTokenJson(tok) !== true) throw new Error('Tokens JSON verification failed');",
    aTitle: "Assignment: Token values count compiler",
    aDesc: "Write a JS function `countTokens(tokenMap)` returning count of keys in tokenMap colors property. Return 0 if null.",
    aStarter: "function countTokens(tokenMap) {\n    // Write your code here\n    \n}",
    aHint: "Return Object.keys of colors object. Check null.",
    aTest: "if (typeof countTokens !== 'function') throw new Error('Method countTokens not found');"
  },
  {
    title: "Visual Hierarchy: Component layout contrast check",
    desc: "Master color accessibility rules. (Real world: CI pipelines evaluate component background and text colors, validating luminosity ratios against WCAG AAA bounds.)",
    syllabus: ["Luminosity contrast requirements (WCAG)", "Calculating relative contrast levels", "Validating accessible design colors configurations"],
    eTitle: "Exam: Text Contrast Ratio Auditor",
    eDesc: "Write a JS function `isContrastRatioAllowed(ratio, targetLimit)` returning true if ratio >= targetLimit. Return false if inputs are negative.",
    eStarter: "function isContrastRatioAllowed(ratio, targetLimit) {\n    // Write your code here\n    \n}",
    eHint: "Compare ratio against target limits directly.",
    eTest: "if (typeof isContrastRatioAllowed !== 'function') throw new Error('Method isContrastRatioAllowed not found');\nif (isContrastRatioAllowed(4.5, 4.5) !== true) throw new Error('Contrast checks failed');",
    aTitle: "Assignment: WCAG rating compiler",
    aDesc: "Write a JS function `getWcagRating(ratio)` returning 'AAA' if ratio >= 7.0, 'AA' if ratio >= 4.5, and 'FAIL' otherwise.",
    aStarter: "function getWcagRating(ratio) {\n    // Write your code here\n    \n}",
    aHint: "Check threshold scales.",
    aTest: "if (typeof getWcagRating !== 'function') throw new Error('Method getWcagRating not found');"
  },
  {
    title: "CSS Grid: Dynamic layout column calculators",
    desc: "Master CSS grid configurations. (Real world: Layout managers calculate grid grid templates, generating columns boundaries to fit viewport widths.)",
    syllabus: ["CSS grid-template-columns properties configurations", "Grid gaps and alignments properties", "Dynamic column count wrapping"],
    eTitle: "Exam: Grid Column Count Calculator",
    eDesc: "Write a JS function `calculateGridCols(containerWidth, minColWidth, gap)` returning total columns count: `Math.floor((containerWidth + gap) / (minColWidth + gap))`. Return 0 if inputs <= 0.",
    eStarter: "function calculateGridCols(containerWidth, minColWidth, gap) {\n    // Write your code here\n    \n}",
    eHint: "Apply column count formula rounding down.",
    eTest: "if (typeof calculateGridCols !== 'function') throw new Error('Method calculateGridCols not found');\nif (calculateGridCols(1000, 200, 10) !== 4) throw new Error('Grid columns math failed');",
    aTitle: "Assignment: Grid column width checker",
    aDesc: "Write a JS function `isColWidthSafe(width)` returning true if width >= 120.",
    aStarter: "function isColWidthSafe(width) {\n    // Write your code here\n    \n}",
    aHint: "Check width bounds.",
    aTest: "if (typeof isColWidthSafe !== 'function') throw new Error('Method isColWidthSafe not found');"
  },
  {
    title: "CSS Flexbox: Auto-wrap child counts checker",
    desc: "Master flexbox alignments properties. (Real world: Mobile menus configure flex-wrap attributes, aligning elements to prevent overflow bounds clipping.)",
    syllabus: ["CSS flex direction and wrapping parameters", "Flex grow shrink sizing rules", "Centering child components layouts"],
    eTitle: "Exam: Flexbox Wrap Checker",
    eDesc: "Write a JS function `isFlexWrapRequired(totalChildrenWidth, containerWidth)` returning true if totalChildrenWidth > containerWidth. Returns false otherwise.",
    eStarter: "function isFlexWrapRequired(totalChildrenWidth, containerWidth) {\n    // Write your code here\n    \n}",
    eHint: "Compare cumulative children size with container constraints.",
    eTest: "if (typeof isFlexWrapRequired !== 'function') throw new Error('Method isFlexWrapRequired not found');\nif (isFlexWrapRequired(600, 500) !== true) throw new Error('Flex wrap logic failed');",
    aTitle: "Assignment: Flex item shrink basis",
    aDesc: "Write a JS function `getFlexItemBasis(container, count)` returning Math.floor(container / count).",
    aStarter: "function getFlexItemBasis(container, count) {\n    // Write your code here\n    \n}",
    aHint: "Divide container by count.",
    aTest: "if (typeof getFlexItemBasis !== 'function') throw new Error('Method getFlexItemBasis not found');"
  },
  {
    title: "Visual Hierarchy: Component layout depth mapping",
    desc: "Master box shadows layers. (Real world: Dropdowns build elevation maps using border shadows properties, creating visual hierarchy steps.)",
    syllabus: ["CSS box-shadow layering configurations", "Simulating depth elevation layers", "Border elevations guidelines"],
    eTitle: "Exam: Shadow Elevation Level Auditor",
    eDesc: "Write a JS function `getShadowElevation(level)` returning string: `0 4px 8px rgba(0,0,0,` + (level * 0.05) + `)`. Return empty string if level <= 0.",
    eStarter: "function getShadowElevation(level) {\n    // Write your code here\n    \n}",
    eHint: "Format shadow configurations string using level variable scale.",
    eTest: "if (typeof getShadowElevation !== 'function') throw new Error('Method getShadowElevation not found');\nif (getShadowElevation(2) !== '0 4px 8px rgba(0,0,0,0.1)') throw new Error('Elevation compiler failed');",
    aTitle: "Assignment: Shadow border indicator",
    aDesc: "Write a JS function `isShadowBlurred(blurRadius)` returning true if blurRadius >= 4.",
    aStarter: "function isShadowBlurred(blurRadius) {\n    // Write your code here\n    \n}",
    aHint: "Check radius limits.",
    aTest: "if (typeof isShadowBlurred !== 'function') throw new Error('Method isShadowBlurred not found');"
  },
  {
    title: "Figma Auto Layout auto-spacing metrics",
    desc: "Learn auto-spacing conversions. (Real world: Figma plugins parse auto-layout configurations, writing layouts padding properties to component modules.)",
    syllabus: ["Figma auto layout alignments maps", "Auto spacing properties conversion rules", "Converting padding and gap values to CSS styles"],
    eTitle: "Exam: Auto Layout Gap Auditor",
    eDesc: "Write a JS function `isGapValueSafe(gap)` returning true if gap >= 4 and gap <= 64. Returns false otherwise.",
    eStarter: "function isGapValueSafe(gap) {\n    // Write your code here\n    \n}",
    eHint: "Verify gap matches boundary parameters limits.",
    eTest: "if (typeof isGapValueSafe !== 'function') throw new Error('Method isGapValueSafe not found');\nif (isGapValueSafe(16) !== true) throw new Error('Gap validator failed');",
    aTitle: "Assignment: Padding top bottom check",
    aDesc: "Write a JS function `isPaddingSymm(top, bottom)` returning true if top === bottom.",
    aStarter: "function isPaddingSymm(top, bottom) {\n    // Write your code here\n    \n}",
    aHint: "Compare input variables.",
    aTest: "if (typeof isPaddingSymm !== 'function') throw new Error('Method isPaddingSymm not found');"
  },
  {
    title: "Atomic Design: Atom components properties validation",
    desc: "Master atomic button properties checks. (Real world: Component libraries configure base buttons parameters, checking state variables.)",
    syllabus: ["Atomic design components configurations", "Button state variables (disabled, hover)", "Basic inputs labels mappings"],
    eTitle: "Exam: Atom Button State Auditor",
    eDesc: "Write a JS function `isButtonStateAllowed(state)` returning true if state is 'default', 'hover', 'focus', or 'disabled'. Returns false otherwise.",
    eStarter: "function isButtonStateAllowed(state) {\n    // Write your code here\n    \n}",
    eHint: "Verify input string matches valid states array list.",
    eTest: "if (typeof isButtonStateAllowed !== 'function') throw new Error('Method isButtonStateAllowed not found');\nif (isButtonStateAllowed('hover') !== true) throw new Error('State validator failed');",
    aTitle: "Assignment: Button disabled color selector",
    aDesc: "Write a JS function `getDisabledColor(theme)` returning '#CCCCCC' if theme === 'dark', and '#EFEFEF' otherwise.",
    aStarter: "function getDisabledColor(theme) {\n    // Write your code here\n    \n}",
    aHint: "Check theme checks.",
    aTest: "if (typeof getDisabledColor !== 'function') throw new Error('Method getDisabledColor not found');"
  },
  {
    title: "Molecules: Form input components validation",
    desc: "Master inputs configurations checks. (Real world: Form controllers combine inputs and labels elements, routing warning messages if parameters are invalid.)",
    syllabus: ["Combining atomic components layouts", "Input text field validators", "Dynamic validation error states labels"],
    eTitle: "Exam: Molecule Form Input Validator",
    eDesc: "Write a JS function `isFormInputValid(text, req)` returning true if req is false, or if req is true and text is non-empty string. Returns false otherwise.",
    eStarter: "function isFormInputValid(text, req) {\n    // Write your code here\n    \n}",
    eHint: "Check boolean required flags, verifying text strings length.",
    eTest: "if (typeof isFormInputValid !== 'function') throw new Error('Method isFormInputValid not found');\nif (isFormInputValid('', false) !== true) throw new Error('Form input check failed');",
    aTitle: "Assignment: Input prefix helper",
    aDesc: "Write a JS function `formatInputPrefix(val, prefix)` returning string: `[prefix]-[val]` in lowercase.",
    aStarter: "function formatInputPrefix(val, prefix) {\n    // Write your code here\n    \n}",
    aHint: "Format to lowercase.",
    aTest: "if (typeof formatInputPrefix !== 'function') throw new Error('Method formatInputPrefix not found');"
  },
  {
    title: "Organisms: Navigation bar layouts spacing checks",
    desc: "Master nav bar spacing layouts setups. (Real world: Navigation bars align branding elements and links, keeping margins within structural coordinates bounds.)",
    syllabus: ["NavBar branding layouts configurations", "Calculating padding and spacer widths", "Spacing nav elements alignment rules"],
    eTitle: "Exam: Navigation Bar Spacer Auditor",
    eDesc: "Write a JS function `getSidebarWidth(isCollapsed, openWidth)` returning isCollapsed ? 64 : openWidth. Return 0 if openWidth is negative.",
    eStarter: "function getSidebarWidth(isCollapsed, openWidth) {\n    // Write your code here\n    \n}",
    eHint: "Check collapsed boolean flags, scaling width.",
    eTest: "if (typeof getSidebarWidth !== 'function') throw new Error('Method getSidebarWidth not found');\nif (getSidebarWidth(true, 250) !== 64) throw new Error('Sidebar width failed');",
    aTitle: "Assignment: Nav items limit checker",
    aDesc: "Write a JS function `isNavOverflow(count, limit)` returning true if count > limit.",
    aStarter: "function isNavOverflow(count, limit) {\n    // Write your code here\n    \n}",
    aHint: "Check bounds.",
    aTest: "if (typeof isNavOverflow !== 'function') throw new Error('Method isNavOverflow not found');"
  },
  {
    title: "Organisms: Modals overlay configurations",
    desc: "Master overlay backdrop z-index layers. (Real world: Dialog overlays center content wrappers, trapping viewport tab focus movements inside active components.)",
    syllabus: ["Overlay backdrop configurations", "Escape key closing event handlings", "Trapping page focus layouts"],
    eTitle: "Exam: Modal Backdrop Visibility",
    eDesc: "Write a JS function `getBackdropOpacity(isOpen)` returning isOpen ? 0.5 : 0.",
    eStarter: "function getBackdropOpacity(isOpen) {\n    // Write your code here\n    \n}",
    eHint: "Return opacity value based on isOpen status.",
    eTest: "if (typeof getBackdropOpacity !== 'function') throw new Error('Method getBackdropOpacity not found.');\nif (getBackdropOpacity(true) !== 0.5) throw new Error('Opacity check failed');",
    aTitle: "Assignment: Escape Key Close Checker",
    aDesc: "Write a JS function `isEscapeKey(event)` returning true if event.key === 'Escape' || event.keyCode === 27.",
    aStarter: "function isEscapeKey(event) {\n    // Write your code here\n    \n}",
    aHint: "Compare key or code variables.",
    aTest: "if (typeof isEscapeKey !== 'function') throw new Error('Method isEscapeKey not found.');"
  },
  {
    title: "Final Capstone: Design System Audit",
    desc: "Perform evaluations of typography scaling ratios, check design tokens spacing grids, evaluate color contrast levels accessibility compliance, and compile compliance ratings labels. (Real world: Design system engineers audit component catalogs, verifying WCAG AA contrast rules.)",
    syllabus: ["Typography scaling ratios evaluations", "Design tokens spacing grids check", "Luminosity contrast audit evaluations"],
    eTitle: "Exam: Design System Compliance Auditor",
    eDesc: "Write a JS function `evaluateDesignSystem(report)` returning true if report.contrastPass === true, report.gridAligned === true, and report.clsScore <= 0.1.",
    eStarter: "function evaluateDesignSystem(report) {\n    // Write your code here\n    \n}",
    eHint: "Verify report.contrastPass, report.gridAligned, and report.clsScore property limits.",
    eTest: "if (typeof evaluateDesignSystem !== 'function') throw new Error('Method evaluateDesignSystem not found.');\nconst rep = { contrastPass: true, gridAligned: true, clsScore: 0.05 };\nif (evaluateDesignSystem(rep) !== true) throw new Error('Compliance verification failed');",
    aTitle: "Assignment: Layout Shift Penalty Calculator",
    aDesc: "Write a JS function `calcClsPenalty(clsScore)` returning clsScore > 0.1 ? 'poor' : 'good'.",
    aStarter: "function calcClsPenalty(clsScore) {\n    // Write your code here\n    \n}",
    aHint: "Verify score limits.",
    aTest: "if (typeof calcClsPenalty !== 'function') throw new Error('Method calcClsPenalty not found.');"
  },
  {
    title: "Final Capstone: Design System Audit (Review)",
    desc: "Review design systems typography scale ratios, spacing multipliers grids, color contrast compliance reports, and components specifications checklist. (Real world: Design system engineers audit component catalogs, verifying WCAG AA contrast rules.)",
    syllabus: ["Reviewing typography scale properties", "Assembling components specifications checklist", "Verifying design tokens conversions"],
    eTitle: "Exam: Final compliance audit review",
    eDesc: "Not tested",
    eStarter: "",
    eHint: "",
    eTest: "",
    aTitle: "Assignment: Compliance score compiler",
    aDesc: "Not tested",
    aStarter: "",
    aHint: "",
    aTest: ""
  },
  {
    title: "Final Capstone: Design System Audit (Review)",
    desc: "Review design systems typography scale ratios, spacing multipliers grids, color contrast compliance reports, and components specifications checklist. (Real world: Design system engineers audit component catalogs, verifying WCAG AA contrast rules.)",
    syllabus: ["Reviewing typography scale properties", "Assembling components specifications checklist", "Verifying design tokens conversions"],
    eTitle: "Exam: Final compliance audit review",
    eDesc: "Not tested",
    eStarter: "",
    eHint: "",
    eTest: "",
    aTitle: "Assignment: Compliance score compiler",
    aDesc: "Not tested",
    aStarter: "",
    aHint: "",
    aTest: ""
  },
  {
    title: "Final Capstone: Design System Audit (Review)",
    desc: "Review design systems typography scale ratios, spacing multipliers grids, color contrast compliance reports, and components specifications checklist. (Real world: Design system engineers audit component catalogs, verifying WCAG AA contrast rules.)",
    syllabus: ["Reviewing typography scale properties", "Assembling components specifications checklist", "Verifying design tokens conversions"],
    eTitle: "Exam: Final compliance audit review",
    eDesc: "Not tested",
    eStarter: "",
    eHint: "",
    eTest: "",
    aTitle: "Assignment: Compliance score compiler",
    aDesc: "Not tested",
    aStarter: "",
    aHint: "",
    aTest: ""
  },
  {
    title: "Final Capstone: Design System Audit (Review)",
    desc: "Review design systems typography scale ratios, spacing multipliers grids, color contrast compliance reports, and components specifications checklist. (Real world: Design system engineers audit component catalogs, verifying WCAG AA contrast rules.)",
    syllabus: ["Reviewing typography scale properties", "Assembling components specifications checklist", "Verifying design tokens conversions"],
    eTitle: "Exam: Final compliance audit review",
    eDesc: "Not tested",
    eStarter: "",
    eHint: "",
    eTest: "",
    aTitle: "Assignment: Compliance score compiler",
    aDesc: "Not tested",
    aStarter: "",
    aHint: "",
    aTest: ""
  },
  {
    title: "Final Capstone: Design System Audit (Review)",
    desc: "Review design systems typography scale ratios, spacing multipliers grids, color contrast compliance reports, and components specifications checklist. (Real world: Design system engineers audit component catalogs, verifying WCAG AA contrast rules.)",
    syllabus: ["Reviewing typography scale properties", "Assembling components specifications checklist", "Verifying design tokens conversions"],
    eTitle: "Exam: Final compliance audit review",
    eDesc: "Not tested",
    eStarter: "",
    eHint: "",
    eTest: "",
    aTitle: "Assignment: Compliance score compiler",
    aDesc: "Not tested",
    aStarter: "",
    aHint: "",
    aTest: ""
  },
  {
    title: "Final Capstone: Design System Audit (Review)",
    desc: "Review design systems typography scale ratios, spacing multipliers grids, color contrast compliance reports, and components specifications checklist. (Real world: Design system engineers audit component catalogs, verifying WCAG AA contrast rules.)",
    syllabus: ["Reviewing typography scale properties", "Assembling components specifications checklist", "Verifying design tokens conversions"],
    eTitle: "Exam: Final compliance audit review",
    eDesc: "Not tested",
    eStarter: "",
    eHint: "",
    eTest: "",
    aTitle: "Assignment: Compliance score compiler",
    aDesc: "Not tested",
    aStarter: "",
    aHint: "",
    aTest: ""
  },
  {
    title: "Final Capstone: Design System Audit (Review)",
    desc: "Review design systems typography scale ratios, spacing multipliers grids, color contrast compliance reports, and components specifications checklist. (Real world: Design system engineers audit component catalogs, verifying WCAG AA contrast rules.)",
    syllabus: ["Reviewing typography scale properties", "Assembling components specifications checklist", "Verifying design tokens conversions"],
    eTitle: "Exam: Final compliance audit review",
    eDesc: "Not tested",
    eStarter: "",
    eHint: "",
    eTest: "",
    aTitle: "Assignment: Compliance score compiler",
    aDesc: "Not tested",
    aStarter: "",
    aHint: "",
    aTest: ""
  },
  {
    title: "Final Capstone: Design System Audit (Review)",
    desc: "Review design systems typography scale ratios, spacing multipliers grids, color contrast compliance reports, and components specifications checklist. (Real world: Design system engineers audit component catalogs, verifying WCAG AA contrast rules.)",
    syllabus: ["Reviewing typography scale properties", "Assembling components specifications checklist", "Verifying design tokens conversions"],
    eTitle: "Exam: Final compliance audit review",
    eDesc: "Not tested",
    eStarter: "",
    eHint: "",
    eTest: "",
    aTitle: "Assignment: Compliance score compiler",
    aDesc: "Not tested",
    aStarter: "",
    aHint: "",
    aTest: ""
  },
  {
    title: "Final Capstone: Design System Audit (Review)",
    desc: "Review design systems typography scale ratios, spacing multipliers grids, color contrast compliance reports, and components specifications checklist. (Real world: Design system engineers audit component catalogs, verifying WCAG AA contrast rules.)",
    syllabus: ["Reviewing typography scale properties", "Assembling components specifications checklist", "Verifying design tokens conversions"],
    eTitle: "Exam: Final compliance audit review",
    eDesc: "Not tested",
    eStarter: "",
    eHint: "",
    eTest: "",
    aTitle: "Assignment: Compliance score compiler",
    aDesc: "Not tested",
    aStarter: "",
    aHint: "",
    aTest: ""
  }
];

export const DESIGN_30_DAYS_QUESTS = DESIGN_30_DAYS_CONFIGS.flatMap((cfg, dIdx) => {
  const dayNum = dIdx + 1;
  const lecture = {
    id: `design-basics-lecture-day-${dayNum}`,
    title: `Day ${dayNum} Learning: ${cfg.title}`,
    desc: cfg.desc,
    type: "lecture" as const,
    requiresAvatar: true,
    syllabus: cfg.syllabus,
    skillCategory: "theory" as const,
    xp: 150,
    pins: 5
  };
  if (dayNum === 1) {
    return [
      lecture,
      {
        id: `design-basics-lecture2-day-1`,
        title: `Day 1 Deep Dive: Syntax, Execution Rules, and Line-by-Line Breakdown`,
        desc: `In-depth step-by-step breakdown of Day 1 concepts, memory layout, and execution mechanics. ${cfg.desc}`,
        type: "lecture" as const,
        requiresAvatar: true,
        syllabus: cfg.syllabus,
        skillCategory: "theory" as const,
        xp: 150,
        pins: 5
      },
      {
        id: `design-basics-lecture3-day-1`,
        title: `Day 1 Workshop: Real-World Industry Context & Visualization Guide`,
        desc: `Practical visualization guide and real-world system architecture context for Day 1. ${cfg.desc}`,
        type: "lecture" as const,
        requiresAvatar: true,
        syllabus: cfg.syllabus,
        skillCategory: "theory" as const,
        xp: 150,
        pins: 5
      }
    ];
  }
  if (dayNum === 2) {
    return [
      lecture,
      {
        id: `design-basics-lecture2-day-2`,
        title: `Day 2 Deep Dive: Flow Control, Logic Branching, and Execution Paths`,
        desc: `In-depth line-by-line mechanics of conditionals, loops, and memory execution state. ${cfg.desc}`,
        type: "lecture" as const,
        requiresAvatar: true,
        syllabus: cfg.syllabus,
        skillCategory: "theory" as const,
        xp: 150,
        pins: 5
      },
      {
        id: `design-basics-lecture3-day-2`,
        title: `Day 2 Workshop: Practical Code Workshop & Edge Case Pitfall Warnings`,
        desc: `Practical code workshop analyzing common edge cases, off-by-one errors, and production traps. ${cfg.desc}`,
        type: "lecture" as const,
        requiresAvatar: true,
        syllabus: cfg.syllabus,
        skillCategory: "theory" as const,
        xp: 150,
        pins: 5
      }
    ];
  }
  return buildEnrichedDayQuests('design-basics', dayNum, cfg);
});
