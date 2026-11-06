import hashlib
import json
import os
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')
sys.path.insert(0, os.path.abspath('scripts'))

from design_day56_data import DAY_56
from design_day57_data import DAY_57
from design_day58_data import DAY_58
from design_day59_data import DAY_59
from design_day60_data import DAY_60

DAYS = [DAY_56, DAY_57, DAY_58, DAY_59, DAY_60]

VISUAL_DIR = 'src/lib/data/lessonVisuals/design'
os.makedirs(VISUAL_DIR, exist_ok=True)

VISUAL_SPECS = {
    56: {
        "step_labels": [
            ["DOM Structure Verification", "Pixel Rasterization Canvas", "CIELAB Delta Calculation", "Visual Regression Gating"],
            ["Raw Pixel Array", "Spatial Neighborhood Sampling", "Luminance Gradient Mask", "Anti-Aliasing Tolerance"],
            ["Asynchronous Frame Capture", "Transition and Timer Freeze", "Font Ready Promise Resolution", "Deterministic Snapshot Output"],
            ["Continuous Integration Detection", "Side-by-Side Swipe Comparison", "Design Team Visual Review", "Promoted Golden Baseline"]
        ],
        "captions": [
            [
                "Traditional unit tests evaluate DOM attributes without detecting visual shifts.",
                "Headless Chromium renders component pixels directly onto an image canvas.",
                "Color distances are calculated in uniform perceptual color space.",
                "Automated gates block pull requests that introduce layout regressions."
            ],
            [
                "Raw bitmap arrays contain thousands of individual subpixel values.",
                "Spatial algorithms inspect neighboring pixels across high-contrast edges.",
                "Luminance gradient masks isolate natural font smoothing variations.",
                "Acceptable anti-aliasing artifacts are forgiven while true defects are flagged."
            ],
            [
                "Asynchronous CSS animations introduce timing flakiness in automated runs.",
                "Injected freeze scripts pause all animations and lock system clocks to constant epochs.",
                "Harnesses await font rasterization completion before taking snapshots.",
                "Deterministic captures produce identical pixel bitmaps across all environments."
            ],
            [
                "Continuous integration pipelines capture candidate screenshots on pull requests.",
                "Interactive review widgets display side-by-side swipe diff overlays.",
                "Design team leads audit and approve intended visual modifications.",
                "Approved candidate images are promoted into official golden baseline storage."
            ]
        ]
    },
    57: {
        "step_labels": [
            ["Unmonitored Component Fleet", "Abstract Syntax Tree Parsing", "JSX Tag and Prop Extraction", "Institutional Adoption Score"],
            ["Source Code String Stream", "Lexical Tokenizing Pass", "AST Import Resolution", "Canonical Component Mapping"],
            ["Marking JSDoc Deprecation", "Measuring Enterprise Debt", "Automated Codemod Transform", "Sunsetted API Elimination"],
            ["Client Component Interaction", "In-Memory Ring Buffer", "Idle Period Scheduling", "Non-Blocking Beacon Transport"]
        ],
        "captions": [
            [
                "Enterprise software fleets frequently lack visibility into component usage.",
                "Static analyzers convert consumer source files into abstract syntax trees.",
                "Crawlers catalog component import specifiers and passed property values.",
                "Executive scorecards compute institutional adoption ratios across repositories."
            ],
            [
                "Primitive regex searches cannot distinguish between comments and code.",
                "Compiler tokenizers decompose source text into structured language tokens.",
                "Import declarations map local component aliases back to official package origins.",
                "AST visitors catalogue exact component invocations without false positives."
            ],
            [
                "Deprecated interfaces display warning strikethroughs in developer editors.",
                "Static crawlers measure deprecation debt to populate burn-down charts.",
                "Automated ESLint rules rewrite deprecated properties directly in source files.",
                "Product squads eliminate legacy APIs safely ahead of scheduled sunset deadlines."
            ],
            [
                "End users trigger component interactions during live production sessions.",
                "Lightweight hooks queue telemetry events into in-memory ring buffers.",
                "Batch schedulers wait for browser idle periods before transmitting data.",
                "Asynchronous beacon APIs deliver telemetry without blocking user navigation."
            ]
        ]
    },
    58: {
        "step_labels": [
            ["API Contract Evaluation", "Layout Geometry Inspection", "Accessibility Tree Audit", "SemVer Major Release Signal"],
            ["Feature Pull Request Changeset", "Monorepo Package Dependency Graph", "Automated Version Bumping", "Private NPM Package Publishing"],
            ["Legacy Monolithic Invocation", "jscodeshift AST Walker", "Compound Sub-Component Restructuring", "Clean Transformed Output"],
            ["Global Stylesheet Collision", "Version Scoped Namespace", "Dual Package Aliasing", "Seamless In-Page Coexistence"]
        ],
        "captions": [
            [
                "Design system versioning governs visual and accessibility contracts.",
                "Visual padding alterations that shift page layouts require major increments.",
                "Altering keyboard focus or ARIA attributes triggers major version classification.",
                "Semantic version numbers signal breaking changes clearly to consumer teams."
            ],
            [
                "Developers author atomic changeset markdown files on pull requests.",
                "Monorepo tools resolve package dependency hierarchies automatically.",
                "Automated actions update version numbers across all affected manifests.",
                "Continuous release pipelines publish packages with verified provenance."
            ],
            [
                "Legacy component calls bundle complex layouts into monolithic elements.",
                "AST manipulation scripts traverse syntax trees to locate target nodes.",
                "Codemods restructure monolithic props into flexible compound elements.",
                "Automated formatting hooks produce clean code matching project style guidelines."
            ],
            [
                "Loading multiple unisolated stylesheets causes variable overwrite conflicts.",
                "Scoped namespaces isolate design tokens under versioned container selectors.",
                "Package manager aliases allow multiple major versions to install side-by-side.",
                "Legacy and modern components render harmoniously within the same document body."
            ]
        ]
    },
    59: {
        "step_labels": [
            ["Independent Micro-Frontend Silos", "Global Stylesheet Bleeding", "Module Federation Shell", "Unified Enterprise Platform"],
            ["Global Document Head Scope", "Shadow Root DOM Boundary", "CSS Cascade Layer Priority", "Container Attribute Isolation"],
            ["Multiple Duplicate Packages", "Singleton Contract Validation", "Shared Memory Dispatcher", "Lean Single-Instance Runtime"],
            ["Shell Header Theme Toggle", "CustomEvent Bus Dispatch", "Cross-App Token Propagation", "Synchronized Dark Mode Transition"]
        ],
        "captions": [
            [
                "Distributed teams develop micro-frontends with independent deployment schedules.",
                "Unconstrained CSS stylesheets risk overriding adjacent application components.",
                "Module Federation dynamically composes remote modules into an enterprise shell.",
                "Shared design system infrastructure guarantees visual unity across applications."
            ],
            [
                "Global styling rules penetrate nested containers without boundaries.",
                "Shadow roots isolate DOM nodes but introduce modal portal hoisting hurdles.",
                "Cascade layers establish clear specificity hierarchies for design tokens.",
                "Container attribute selectors keep styling confined to target micro-apps."
            ],
            [
                "Bundling multiple copies of React causes hook dispatcher crashes.",
                "Federation configurations declare singleton requirements for critical libraries.",
                "The host container shares its active runtime instance with all remotes.",
                "Single-instance execution eliminates memory bloat and prevents hook exceptions."
            ],
            [
                "Users trigger brand theme transitions in global navigation headers.",
                "The shell dispatches custom events across the browser window bus.",
                "Autonomous remote micro-frontends receive payloads and update container tokens.",
                "All viewport sections transition to dark mode simultaneously without refreshing."
            ]
        ]
    },
    60: {
        "step_labels": [
            ["DTCG Design Token Manifesto", "Headless Accessible Component Engine", "Perceptual Visual Regression Firewall", "Enterprise Autonomous Design System"],
            ["Raw Token Schema Input", "Directed Acyclic Alias Graph", "Perceptual APCA Contrast Check", "Multi-Platform Asset Emission"],
            ["WAI-ARIA State Machine Hook", "Focus Trapping and Restoring", "Dual-Axis Virtual Grid Windowing", "Certified WCAG AAA Primitives"],
            ["Static AST Adoption Crawling", "Deprecation Burn-Down Gating", "Non-Blocking Telemetry Beaconing", "Institutional Excellence Dashboard"]
        ],
        "captions": [
            [
                "Foundational design tokens define spatial scales and brand identities.",
                "Headless component state machines enforce accessible interaction patterns.",
                "Visual regression pipelines prevent subtle pixel regressions in production.",
                "The autonomous platform unifies all subsystems into an enterprise standard."
            ],
            [
                "Multi-brand manifests declare design tokens following community standards.",
                "Dependency compilers resolve token aliases down to concrete primitive values.",
                "Automated algorithms verify text contrast against background color surfaces.",
                "Emitters generate synchronized assets for web, native mobile, and desktop."
            ],
            [
                "Decoupled state hooks manage focus rings and keyboard navigation matrices.",
                "Focus traps keep keyboard navigation safely contained inside modal overlays.",
                "Virtualization algorithms render minimal DOM nodes across massive data tables.",
                "Component suites guarantee dignified access for all users across assistive devices."
            ],
            [
                "AST analyzers monitor component adoption across enterprise repositories.",
                "Automated codemod tools eliminate technical debt ahead of sunset schedules.",
                "Client beacons record real-world usage frequencies without performance lag.",
                "Governance dashboards certify enterprise design system health and reliability."
            ]
        ]
    }
}

for day_data in DAYS:
    day_num = day_data['day']
    spec = VISUAL_SPECS[day_num]
    
    visuals = []
    for v_idx in range(4):
        part = day_data['parts'][v_idx]
        code = part.get('code', '')
        code_hash = hashlib.sha256(code.encode('utf-8')).hexdigest()
        
        prompt = f"Architectural and conceptual diagram for Day {day_num} Part {v_idx + 1}: {part['title']}. Visualizing step progression with compare template."
        prompt_sha = hashlib.sha256(prompt.encode('utf-8')).hexdigest()
        
        steps = []
        for s_idx in range(4):
            title = spec["step_labels"][v_idx][s_idx]
            caption = spec["captions"][v_idx][s_idx]
            
            assert not re.search(r'\d', caption), f"Day {day_num} Part {v_idx+1} Step {s_idx+1} caption has digits: {caption}"
            assert caption.endswith('.'), f"Caption must end with period: {caption}"
            
            steps.append({
                "step": s_idx + 1,
                "title": title,
                "caption": caption
            })
            
        visuals.append({
            "partIndex": v_idx + 1,
            "template": "compare",
            "prompt": prompt,
            "promptSha": prompt_sha,
            "codeHash": code_hash,
            "steps": steps
        })
        
    envelope = {
        "schemaVersion": "2.0",
        "courseId": "course-design-systems",
        "day": day_num,
        "visuals": visuals
    }
    
    out_path = os.path.join(VISUAL_DIR, f"day-{day_num}.json")
    with open(out_path, 'w', encoding='utf-8') as f:
        json.dump(envelope, f, indent=2)
    print(f"Generated Gate v2 visual: {out_path}")

print("All Block 12 visual envelopes generated successfully!")
