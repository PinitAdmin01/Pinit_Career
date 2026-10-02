import { DayConfig } from './curriculumEnricher';

/**
 * UI/UX Design Systems & Visual Frontend (course-design-systems, prefix: design):
 * 30 course days covering design tokens, semantic color scales, typographic grids,
 * fluid clamp(), 8pt spatial systems, accessible color contrast (WCAG 2.1 AA/AAA),
 * CSS Custom Properties, dark mode token indirection, atomic components,
 * compound component architecture, micro-interactions, and enterprise design systems.
 *
 * Practice tasks are in design30DayData.ts; lessons in designWebLongLessons.ts.
 */
export const DESIGN_DAYS: DayConfig[] = [
  {
    "day": 1,
    "title": "Design Tokens & Semantic Color Scales: Global vs Semantic Aliases",
    "desc": "Master production design tokens: The 3-Tier Token Architecture (1. Global/Primitive Tokens: `blue-500: #3b82f6`, 2. Semantic Alias Tokens: `color-interactive-primary: var(--blue-500)`, 3. Component-Scoped Tokens: `button-primary-bg: var(--color-interactive-primary)`), HSL Lightness Ramps (50 to 950), and Theme Switching Token Indirection.",
    "syllabus": [
      "The 3-Tier Design Token Hierarchy (Global -> Semantic -> Component).",
      "HSL Color scales and mathematical lightness ramps.",
      "Design token JSON schemas and CSS Custom Property translation."
    ]
  },
  {
    "day": 2,
    "title": "Typography Grids & Modular Scaling: The Major Third Scale & Fluid clamp()",
    "desc": "Establish mathematical typographic harmony: The Major Third ($1.250$) and Perfect Fourth ($1.333$) Modular Scales, Calculating rem font sizes from base $16\\text{px}$ ($16 \\times 1.250 = 20\\text{px} \\to 25\\text{px} \\to 31.25\\text{px}$), Line-Height Proportions ($1.5$ for body, $1.2$ for display headings), and Modern Fluid Typography using `clamp(min, preferred, max)`.",
    "syllabus": [
      "Modular typographic scaling ratios and rem conversion math.",
      "Line-height and vertical rhythm proportions.",
      "Fluid responsive typography formulas with CSS clamp()."
    ]
  },
  {
    "day": 3,
    "title": "Spacing Systems & 8pt Mathematical Grid Hierarchy",
    "desc": "Construct cohesive spatial rhythm: The Universal 8pt Spacing Grid ($8\\text{px}, 16\\text{px}, 24\\text{px}, 32\\text{px}, 48\\text{px}, 64\\text{px}$), The 4pt Half-Step for dense micro-spacing (tooltips, icons, badges), Eliminating Arbitrary Margin Magic Numbers, and Structuring Spatial Tokens (`space-1` to `space-16`).",
    "syllabus": [
      "The 8-point spatial grid invariant and why 8 is mathematically superior (divisible by 2, 4, 8).",
      "Mapping padding, margin, and gap to discrete spacing tokens.",
      "4pt half-step micro-spacing for tight UI elements."
    ]
  },
  {
    "day": 4,
    "title": "Elevation, Shadows & Z-Index Layer Stacking Scales",
    "desc": "Create realistic optical depth: Multi-Layer Box-Shadow Architecture (Key Ambient Shadow + Direct Cast Shadow for soft realistic lighting), Elevation Ramps (`elevation-1` to `elevation-5`), and Strict Semantic Z-Index Scales (`z-dropdown: 100`, `z-sticky: 200`, `z-modal-backdrop: 900`, `z-modal: 1000`, `z-toast: 1100`).",
    "syllabus": [
      "Multi-layer ambient and direct shadow compositing in CSS.",
      "Elevation levels and material lighting physics.",
      "Z-Index collision avoidance and semantic stacking scale architecture."
    ]
  },
  {
    "day": 5,
    "title": "⭐ MILESTONE 1: Complete Design Token, 8pt Grid & Typography Math Engine",
    "desc": "Milestone 1: Build a complete design system foundations and spatial token engine: Design token semantic alias resolution (light/dark modes), Modular typography scale calculation, 8pt spatial grid alignment audit, and Semantic Z-index scale verification.",
    "syllabus": [
      "Synthesis of design token architecture, mathematical typography scales, spatial grid hierarchies, and elevation layering.",
      "Foundational design system milestone verification.",
      "Milestone 1 certification."
    ]
  },
  {
    "day": 6,
    "title": "Atomic Design Methodology: Atoms, Molecules, Organisms, Templates & Pages",
    "desc": "Structure scalable component hierarchies: Brad Frost's Atomic Design (Atoms: Buttons, Inputs, Labels $\\to$ Molecules: Search Form $\\to$ Organisms: Global Header/Navbar $\\to$ Templates: Layout wireframe $\\to$ Pages: Dynamic instance with real mock data), and Preventing Dependency Inversion Traps.",
    "syllabus": [
      "The 5 hierarchical tiers of Atomic Design.",
      "Composing pure atoms into interactive molecules.",
      "Organism state boundaries and template layout contracts."
    ]
  },
  {
    "day": 7,
    "title": "Button Architecture & Interactive States: Default, Hover, Active, Focus & Loading",
    "desc": "Build bulletproof, accessible interactive buttons: The 6 Discrete Interactive States (Default, Hover, Active/Pressed, Focus-Visible, Disabled, Loading with Spinner), Button Variants (`primary`, `secondary`, `outline`, `ghost`, `danger`), Button Sizes (`sm`, `md`, `lg`), and Accessible Focus Ring Outlines (`outline-offset: 2px`).",
    "syllabus": [
      "Complete state machine of an accessible button component.",
      "Aria-disabled vs native disabled attribute tradeoffs.",
      "Focus-visible keyboard ring styling and contrast standards."
    ]
  },
  {
    "day": 8,
    "title": "Form Controls, Inputs & Validation States: Floating Labels & ARIA Feedback",
    "desc": "Design enterprise-grade form inputs: Input States (Default, Filled, Focused, Error with `aria-invalid=\"true\"`, Success, Disabled), Accessible Error Message Association (`aria-describedby=\"input-error-id\"`), Floating Labels vs Fixed Labels, and Real-Time Inline Validation UX.",
    "syllabus": [
      "Form control state management and DOM attribute synchronization.",
      "Screen reader error binding with aria-describedby and aria-invalid.",
      "Input padding, border transitions, and clear button micro-interactions."
    ]
  },
  {
    "day": 9,
    "title": "Card Components & Responsive Content Containers: Aspect Ratios & Padding Ramps",
    "desc": "Design versatile card layouts: Card Anatomies (Header, Media Container with `aspect-ratio: 16/9`, Body Content, Footer Actions), Hover Elevation Transitions (`elevation-1` $\\to$ `elevation-3` on hover), and Responsive Padding Scaling ($16\\text{px}$ mobile $\\to 24\\text{px}$ desktop).",
    "syllabus": [
      "Core Foundations: Principles and design token mechanics of Card Components & Responsive Content Containers: Aspect Ratios & Padding Ramps.",
      "Practical Applications: Component architectures, layout formulas, and interactive states.",
      "Production Best Practices: Accessibility benchmarks, performance profiling, and design system governance."
    ]
  },
  {
    "day": 10,
    "title": "Navigation Bars, Menus & Breadcrumb Trails: Sticky Headers & Skip Links",
    "desc": "Build accessible application navigation: Sticky Header Glassmorphism (`backdrop-filter: blur(12px)`), Active Page Indicators with `aria-current=\"page\"`, Responsive Mobile Drawer Overlays, Breadcrumb Navigation Hierarchies, and The Accessibility Skip-to-Content Link.",
    "syllabus": [
      "Core Foundations: Principles and design token mechanics of Navigation Bars, Menus & Breadcrumb Trails: Sticky Headers & Skip Links.",
      "Practical Applications: Component architectures, layout formulas, and interactive states.",
      "Production Best Practices: Accessibility benchmarks, performance profiling, and design system governance."
    ]
  },
  {
    "day": 11,
    "title": "Modals, Dialogs & Backdrop Focus Trapping: Accessible Overlay Engineering",
    "desc": "Engineer accessible modal overlays: HTML5 `<dialog>` Element and `showModal()`, Focus Trapping (Keeping keyboard Tab cycling strictly inside modal boundaries), Keyboard `Escape` Dismissal Listeners, Backdrop Scrim Dimming with `inert` Background Locking, and ARIA Role `dialog` / `alertdialog`.",
    "syllabus": [
      "Core Foundations: Principles and design token mechanics of Modals, Dialogs & Backdrop Focus Trapping: Accessible Overlay Engineering.",
      "Practical Applications: Component architectures, layout formulas, and interactive states.",
      "Production Best Practices: Accessibility benchmarks, performance profiling, and design system governance."
    ]
  },
  {
    "day": 12,
    "title": "Tooltips, Popovers & Floating UI Positioning: Collision Detection & Viewport Bounds",
    "desc": "Position dynamic floating overlays: Viewport Collision Detection, Dynamic Placement Flipping (`top` $\\to$ `bottom` when near screen edge), Tooltip Hover Delay Timers ($300\\text{ms}$ delay to prevent distraction), and Linking via `aria-describedby` for Tooltips or `aria-haspopup` for Popovers.",
    "syllabus": [
      "Core Foundations: Principles and design token mechanics of Tooltips, Popovers & Floating UI Positioning: Collision Detection & Viewport Bounds.",
      "Practical Applications: Component architectures, layout formulas, and interactive states.",
      "Production Best Practices: Accessibility benchmarks, performance profiling, and design system governance."
    ]
  },
  {
    "day": 13,
    "title": "Data Tables, Pagination & Column Sorting: Accessible Grid Layouts",
    "desc": "Display dense tabular data: Semantic Table Markup (`<table>`, `<thead>`, `<tbody>`, `<th>` with `scope=\"col\"`), Sticky Column Headers during scroll, Sorting State Toggles (`aria-sort=\"ascending\" | \"descending\"`), Zebra Striping, and Horizontal Scroll Containment on Mobile Viewports.",
    "syllabus": [
      "Core Foundations: Principles and design token mechanics of Data Tables, Pagination & Column Sorting: Accessible Grid Layouts.",
      "Practical Applications: Component architectures, layout formulas, and interactive states.",
      "Production Best Practices: Accessibility benchmarks, performance profiling, and design system governance."
    ]
  },
  {
    "day": 14,
    "title": "Toast Notifications & Global Alert Banners: Stacking Managers & ARIA Live",
    "desc": "Communicate asynchronous feedback: Global Toast Stacking Queue ($3$ toasts max), Auto-Dismiss Timers with Pause-on-Hover, Screen Reader Announcement via `aria-live=\"polite\"` (for informational toasts) vs `aria-live=\"assertive\"` (for critical errors), and Dismiss Action Buttons.",
    "syllabus": [
      "Core Foundations: Principles and design token mechanics of Toast Notifications & Global Alert Banners: Stacking Managers & ARIA Live.",
      "Practical Applications: Component architectures, layout formulas, and interactive states.",
      "Production Best Practices: Accessibility benchmarks, performance profiling, and design system governance."
    ]
  },
  {
    "day": 15,
    "title": "⭐ MILESTONE 2: Complete Atomic Component Library, WCAG Contrast & Accessible Form Engine",
    "desc": "Milestone 2: Build a complete intermediate design component library: Atomic hierarchy classification, 6-state button validation, accessible form input auditing, card layout verification, modal focus trapping, and toast notification queue management.",
    "syllabus": [
      "Core Foundations: Principles and design token mechanics of ⭐ MILESTONE 2: Complete Atomic Component Library, WCAG Contrast & Accessible Form Engine.",
      "Practical Applications: Component architectures, layout formulas, and interactive states.",
      "Production Best Practices: Accessibility benchmarks, performance profiling, and design system governance."
    ]
  },
  {
    "day": 16,
    "title": "CSS Flexbox Layout Mastery: Main Axis, Cross Axis, Flex Ratios & Gap Spacing",
    "desc": "Master 1-dimensional layout distribution: Main Axis (`justify-content: flex-start | center | space-between`), Cross Axis (`align-items: center | stretch | flex-start`), Flex Item Calculations (`flex: flex-grow flex-shrink flex-basis`), and Native CSS `gap` Spacing.",
    "syllabus": [
      "Core Foundations: Principles and design token mechanics of CSS Flexbox Layout Mastery: Main Axis, Cross Axis, Flex Ratios & Gap Spacing.",
      "Practical Applications: Component architectures, layout formulas, and interactive states.",
      "Production Best Practices: Accessibility benchmarks, performance profiling, and design system governance."
    ]
  },
  {
    "day": 17,
    "title": "CSS Grid Layouts & Responsive Template Areas: auto-fit vs auto-fill",
    "desc": "Master 2-dimensional grid systems: Fluid Responsive Columns without Media Queries (`grid-template-columns: repeat(auto-fit, minmax(280px, 1fr))`), `auto-fit` vs `auto-fill` Mechanics, Named Grid Template Areas (`grid-template-areas: \"header header\" \"sidebar main\"`), and Subgrid Support.",
    "syllabus": [
      "Core Foundations: Principles and design token mechanics of CSS Grid Layouts & Responsive Template Areas: auto-fit vs auto-fill.",
      "Practical Applications: Component architectures, layout formulas, and interactive states.",
      "Production Best Practices: Accessibility benchmarks, performance profiling, and design system governance."
    ]
  },
  {
    "day": 18,
    "title": "Responsive Breakpoints & Mobile-First Media Queries: Standard Breakpoint Scales",
    "desc": "Architect responsive web layouts: The Mobile-First Paradigm (`min-width` query ramps), The Standard Breakpoint Scale ($640\\text{px}$ `sm`, $768\\text{px}$ `md`, $1024\\text{px}$ `lg`, $1280\\text{px}$ `xl`, $1536\\text{px}$ `2xl`), Eliminating Breakpoint Overlap Bugs, and Touch vs Pointer Input Media Queries (`@media (hover: hover)`).",
    "syllabus": [
      "Core Foundations: Principles and design token mechanics of Responsive Breakpoints & Mobile-First Media Queries: Standard Breakpoint Scales.",
      "Practical Applications: Component architectures, layout formulas, and interactive states.",
      "Production Best Practices: Accessibility benchmarks, performance profiling, and design system governance."
    ]
  },
  {
    "day": 19,
    "title": "Fluid Layouts, Modern CSS Math & Container Queries: @container & clamp()",
    "desc": "Build next-generation fluid interfaces: Modern CSS Math Functions (`clamp()`, `min()`, `max()`, `calc()`), CSS Container Queries (`container-type: inline-size` and `@container (min-width: 400px)`), Decoupling Component Responsiveness from the Global Viewport, and Container Query Units (`cqw`, `cqh`).",
    "syllabus": [
      "Core Foundations: Principles and design token mechanics of Fluid Layouts, Modern CSS Math & Container Queries: @container & clamp().",
      "Practical Applications: Component architectures, layout formulas, and interactive states.",
      "Production Best Practices: Accessibility benchmarks, performance profiling, and design system governance."
    ]
  },
  {
    "day": 20,
    "title": "Micro-Interactions, CSS Transitions & Bézier Curves: Spring Physics & Easing",
    "desc": "Create fluid, physical user delight: Cubic-Bézier Curves (`cubic-bezier(0.4, 0, 0.2, 1)` Standard Easing vs `cubic-bezier(0.34, 1.56, 0.64, 1)` Spring Overshoot), Hardware-Accelerated Transforms (`transform: translate3d` & `opacity` only), Transition Durations ($150\\text{ms}$ micro $\\to 300\\text{ms}$ macro), and Preventing Layout Thrashing.",
    "syllabus": [
      "Core Foundations: Principles and design token mechanics of Micro-Interactions, CSS Transitions & Bézier Curves: Spring Physics & Easing.",
      "Practical Applications: Component architectures, layout formulas, and interactive states.",
      "Production Best Practices: Accessibility benchmarks, performance profiling, and design system governance."
    ]
  },
  {
    "day": 21,
    "title": "⭐ MILESTONE 3: Complete Flexbox Math, Fluid Grid, Media Query & Micro-Interaction Engine",
    "desc": "Milestone 3: Build a complete responsive visual frontend and interaction engine: Flexbox item width calculation, CSS Grid auto-fit column calculation, Mobile-first breakpoint classification, CSS clamp expression generation, and Hardware-accelerated transition performance auditing.",
    "syllabus": [
      "Core Foundations: Principles and design token mechanics of ⭐ MILESTONE 3: Complete Flexbox Math, Fluid Grid, Media Query & Micro-Interaction Engine.",
      "Practical Applications: Component architectures, layout formulas, and interactive states.",
      "Production Best Practices: Accessibility benchmarks, performance profiling, and design system governance."
    ]
  },
  {
    "day": 22,
    "title": "Dark Mode Engineering & Theme Switching: CSS Custom Properties & prefers-color-scheme",
    "desc": "Implement flawless multi-theme architectures: CSS Custom Properties `--theme-bg`, System OS Synchronization with `@media (prefers-color-scheme: dark)`, Preventing Flash of Unstyled Theme (FOUT) with Inline Pre-Hydration Scripts, LocalStorage Theme Persistence, and Surface Contrast in Dark Themes.",
    "syllabus": [
      "Core Foundations: Principles and design token mechanics of Dark Mode Engineering & Theme Switching: CSS Custom Properties & prefers-color-scheme.",
      "Practical Applications: Component architectures, layout formulas, and interactive states.",
      "Production Best Practices: Accessibility benchmarks, performance profiling, and design system governance."
    ]
  },
  {
    "day": 23,
    "title": "Accessibility Standards & WCAG 2.2 AA/AAA Contrast Math",
    "desc": "Master mathematical visual accessibility: WCAG 2.2 Relative Luminance Formula ($L = 0.2126R + 0.7152G + 0.0722B$), Contrast Ratio Math ($\\text{Ratio} = \\frac{L_1 + 0.05}{L_2 + 0.05}$), AA Standard ($4.5:1$ for normal text, $3:1$ for large text/UI components), AAA Standard ($7:1$), and Color Blindness Accommodations.",
    "syllabus": [
      "Core Foundations: Principles and design token mechanics of Accessibility Standards & WCAG 2.2 AA/AAA Contrast Math.",
      "Practical Applications: Component architectures, layout formulas, and interactive states.",
      "Production Best Practices: Accessibility benchmarks, performance profiling, and design system governance."
    ]
  },
  {
    "day": 24,
    "title": "Keyboard Navigation & Focus Management: Roving tabindex & Focus Rings",
    "desc": "Build accessible keyboard workflows: Native Focus Order vs Custom `tabindex=\"0\"` / `tabindex=\"-1\"`, The Roving Tabindex Pattern for Radio Groups, Tabs & Menus (Arrow key navigation between items, Tab key exits the widget), and Visible Focus Ring Contrast (`outline: 2px solid`, `outline-offset: 2px`).",
    "syllabus": [
      "Core Foundations: Principles and design token mechanics of Keyboard Navigation & Focus Management: Roving tabindex & Focus Rings.",
      "Practical Applications: Component architectures, layout formulas, and interactive states.",
      "Production Best Practices: Accessibility benchmarks, performance profiling, and design system governance."
    ]
  },
  {
    "day": 25,
    "title": "Screen Reader Optimization & ARIA Attributes: aria-label & aria-hidden",
    "desc": "Deliver clear auditory user interfaces: Accessible Name Computation Algorithm, When to Use `aria-label` vs `aria-labelledby`, Hiding Decorative Icons with `aria-hidden=\"true\"`, Announcing Dynamic State with `aria-expanded` and `aria-selected`, and Avoiding Redundant ARIA on Semantic HTML.",
    "syllabus": [
      "Core Foundations: Principles and design token mechanics of Screen Reader Optimization & ARIA Attributes: aria-label & aria-hidden.",
      "Practical Applications: Component architectures, layout formulas, and interactive states.",
      "Production Best Practices: Accessibility benchmarks, performance profiling, and design system governance."
    ]
  },
  {
    "day": 26,
    "title": "Iconography Systems & SVG Sprite Architecture: viewBox & currentColor",
    "desc": "Design scalable vector icon systems: Normalized Grid Bounds (`viewBox=\"0 0 24 24\"`), Dynamic CSS Color Inheritance with `fill=\"currentColor\"` / `stroke=\"currentColor\"`, SVG Sprite Sheet `<use href=\"#icon-id\">` Optimization, and Icon Size Tokens (`16px`, `20px`, `24px`, `32px`).",
    "syllabus": [
      "Core Foundations: Principles and design token mechanics of Iconography Systems & SVG Sprite Architecture: viewBox & currentColor.",
      "Practical Applications: Component architectures, layout formulas, and interactive states.",
      "Production Best Practices: Accessibility benchmarks, performance profiling, and design system governance."
    ]
  },
  {
    "day": 27,
    "title": "Motion Design Principles & Reduced Motion: prefers-reduced-motion",
    "desc": "Craft inclusive, accessible animations: Respecting Vestibular Motion Disorders with `@media (prefers-reduced-motion: reduce)`, Replacing Disorienting Spatial Slides with Gentle Opacity Cross-Fades, Functional Meaning in Animation, and The Choreography of Staggered List Items.",
    "syllabus": [
      "Core Foundations: Principles and design token mechanics of Motion Design Principles & Reduced Motion: prefers-reduced-motion.",
      "Practical Applications: Component architectures, layout formulas, and interactive states.",
      "Production Best Practices: Accessibility benchmarks, performance profiling, and design system governance."
    ]
  },
  {
    "day": 28,
    "title": "Storybook Architecture & Component Documentation: CSF3 & Args Tables",
    "desc": "Document and test UI components in isolation: Component Story Format (CSF3), Story Args & ArgTypes Auto-Documentation Tables, Component Variants Matrix Story, Visual Regression Testing Setup (Chromatic/Playwright), and Accessibility Addon (`@storybook/addon-a11y`).",
    "syllabus": [
      "Core Foundations: Principles and design token mechanics of Storybook Architecture & Component Documentation: CSF3 & Args Tables.",
      "Practical Applications: Component architectures, layout formulas, and interactive states.",
      "Production Best Practices: Accessibility benchmarks, performance profiling, and design system governance."
    ]
  },
  {
    "day": 29,
    "title": "Design System Governance & Versioning: SemVer Breaking Changes & Deprecations",
    "desc": "Maintain enterprise design systems across dozens of product teams: Semantic Versioning for UI Packages (`MAJOR`: Breaking Token/Prop Change $\\to$ `MINOR`: New Component/Variant $\\to$ `PATCH`: Bugfix/Contrast Polish), Deprecation Notice Lifecycle (`@deprecated` annotations), and Monorepo NPM Packaging.",
    "syllabus": [
      "Core Foundations: Principles and design token mechanics of Design System Governance & Versioning: SemVer Breaking Changes & Deprecations.",
      "Practical Applications: Component architectures, layout formulas, and interactive states.",
      "Production Best Practices: Accessibility benchmarks, performance profiling, and design system governance."
    ]
  },
  {
    "day": 30,
    "title": "🏆 FINAL CAPSTONE: Sovereign Enterprise Design System & Visual UI Suite",
    "desc": "Final Capstone Synthesis: The complete enterprise sovereign design system and visual UI master suite: 1. Design Tokens & Spatial Grid (Semantic alias tokens, HSL ramps, 8pt spacing grid, and modular typography); 2. Atomic Component Library (6-state buttons, accessible form inputs, card layouts, and modal overlays); 3. Responsive Layout & Animation Engine (Flexbox distribution, CSS Grid auto-fit, mobile-first breakpoints, and hardware-accelerated transitions); 4. Accessibility & Theming Suite (Dark mode FOUT prevention, WCAG 2.2 contrast math, roving tabindex, and ARIA labels); 5. Governance & Tooling (SVG sprite systems, reduced motion fallbacks, Storybook CSF3 documentation, and SemVer governance).",
    "syllabus": [
      "Core Foundations: Principles and design token mechanics of 🏆 FINAL CAPSTONE: Sovereign Enterprise Design System & Visual UI Suite.",
      "Practical Applications: Component architectures, layout formulas, and interactive states.",
      "Production Best Practices: Accessibility benchmarks, performance profiling, and design system governance."
    ]
  }
];

export const DESIGN_WEB_DAYS: DayConfig[] = DESIGN_DAYS;
