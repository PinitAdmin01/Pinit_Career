# scripts/generate_block9_visuals.py
import hashlib
import json
import os
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')
sys.path.insert(0, 'scripts')
from design_day41_data import DAY_41
from design_day42_data import DAY_42
from design_day43_data import DAY_43
from design_day44_data import DAY_44
from design_day45_data import DAY_45

DAYS = [DAY_41, DAY_42, DAY_43, DAY_44, DAY_45]

VISUAL_DIR = 'src/lib/data/lessonVisuals/design'
os.makedirs(VISUAL_DIR, exist_ok=True)

VISUAL_SPECS = {
    41: {
        "step_labels": [
            ["Native Event Loop Interception", "Local Buffer Direct Mutating", "Decoupled Store Broadcast", "Batched Reconciling"],
            ["Controlled Prop Evaluation", "Uncontrolled Ref Binding", "Transient Typing In Native DOM", "Transactional Commit Synchronization"],
            ["Context Bridge Initialization", "Deterministic ID Generation", "Label For Attribute Binding", "Chained DescribedBy Composition"],
            ["Subscription Store Allocation", "Field Selector Registration", "Selective Equality Evaluating", "Isolated Render Dispatching"]
        ],
        "captions": [
            [
                "The browser hardware input pipeline registers physical keyboard scan codes directly.",
                "Native input element buffers capture transient character glyphs without framework delay.",
                "Observable store cells receive debounced notification signals without cascade re-renders.",
                "Transactional form subscribers update authoritative records during idle frame periods."
            ],
            [
                "The component inspects initialization properties to select controlled or uncontrolled mode.",
                "Uncontrolled mode creates an internal reference directly to the native input element.",
                "Local typing executes with zero framework memory allocations or reconciliation cycles.",
                "Field blur events trigger transactional state synchronization with the external store."
            ],
            [
                "The form field context bridge initializes unique deterministic identifier namespaces.",
                "Deterministic identifiers link labels and inputs via standard document attributes.",
                "Form label primitives bind the target identifier to ensure full assistive accessibility.",
                "Chained description elements combine hints and errors into space-delimited string tokens."
            ],
            [
                "The reactive form engine creates isolated observable cells outside the component tree.",
                "Field components register precise selector callbacks targeting individual form values.",
                "Strict equality checks prevent component re-renders when other fields are modified.",
                "Targeted subscribers execute swift updates while all sibling inputs remain idle."
            ]
        ]
    },
    42: {
        "step_labels": [
            ["Browser Constraint Evaluation", "Custom Validity Synchronization", "Invalid Event Interception", "Accessible State Reflection"],
            ["Declarative Schema Parsing", "Pure Function Rule Execution", "Error Map Key Indexing", "Narrowed Type Generation"],
            ["Keystroke Debounce Dispatch", "In-Flight Request Aborting", "Monotonic Token Generation", "Out-Of-Order Guarding"],
            ["Pristine State Isolation", "Touched Flag Blur Activation", "Reward Early Error Clearance", "Submission Error Revealing"]
        ],
        "captions": [
            [
                "Browser native validity state flags evaluate required and pattern constraint attributes.",
                "Custom business error strings synchronize directly with native element validity state.",
                "Form event listeners intercept native invalid events to prevent ugly system bubbles.",
                "Target elements reflect valid or invalid pseudo-classes for styled design tokens."
            ],
            [
                "The schema parser accepts untrusted input structures for systematic functional evaluation.",
                "Pure functional validation rules execute without mutation or external side effects.",
                "Validation failures compile into an indexed error map for constant-time field lookups.",
                "Successful evaluations yield fully typed and narrowed data payloads for submission."
            ],
            [
                "Debounced input handlers defer asynchronous network requests until typing pauses.",
                "Active abort controllers immediately cancel previous in-flight validation requests.",
                "Monotonic sequence tokens capture increasing generation counters on every dispatch.",
                "Stale asynchronous responses are discarded silently to prevent race condition bugs."
            ],
            [
                "Pristine form inputs suppress validation error banners during initial interaction.",
                "Input blur events mark fields as touched to trigger timely error banner display.",
                "Subsequent valid keystrokes immediately clear error messages without waiting for blur.",
                "Form submission attempts transition all fields to touched to reveal complete error lists."
            ]
        ]
    },
    43: {
        "step_labels": [
            ["Combobox Role Binding", "Input Anchor Focus Retention", "Virtual Descendant Highlighting", "Listbox Popup Expanding"],
            ["Tokenized Chip Mounting", "Inline Buffer Synchronizing", "Pending Delete Highlighting", "Defensive Chip Removal"],
            ["Arrow Key Single Traversal", "Page Key Chunk Navigation", "Boundary Extreme Jumping", "Space Key Selection Toggling"],
            ["Viewport Capacity Computing", "Overscan Window Slicing", "CSS Translate Positioning", "Assistive Position Annotation"]
        ],
        "captions": [
            [
                "The combobox primitive binds proper roles and relationship attributes to the input.",
                "Hardware keyboard focus remains anchored on the text input during suggestion browsing.",
                "Virtual focus highlights candidate options using dynamic active descendant attributes.",
                "The listbox popup opens smoothly while maintaining uninterrupted keyboard filter typing."
            ],
            [
                "Selected entities render as discrete interactive chips alongside the text caret.",
                "The inline input buffer adjusts width dynamically as token chips wrap vertically.",
                "Initial backspace keypress highlights the preceding chip in an amber warning state.",
                "Secondary backspace confirmation cleanly removes the token and announces deletion."
            ],
            [
                "Arrow keys navigate option candidates with circular boundary wrapping mechanics.",
                "Page up and page down keys advance the highlighted index in ten-item chunks.",
                "Home and end keys trigger instantaneous jumping to the first and last options.",
                "The space key toggles candidate selection without closing the active dropdown popup."
            ],
            [
                "The virtualization engine calculates viewport capacity and total phantom scroll height.",
                "The active rendering slice extracts only the visible items plus overscan buffers.",
                "CSS translate coordinates position the small rendered slice smoothly within the container.",
                "Explicit set size and position attributes preserve full screen reader dataset context."
            ]
        ]
    },
    44: {
        "step_labels": [
            ["First Day Offset Derivation", "Previous Month Leading Padding", "Current Month Date Populating", "Uniform Matrix Completing"],
            ["Two-Dimensional Grid Traversal", "Weekly Seven-Day Vertical Jumps", "Automated Month Transitioning", "Year-Level Leap Jumping"],
            ["Initial Start Date Anchoring", "Transient Hover Preview Tinting", "Inverted Selection Swapping", "Continuous Range Highlighting"],
            ["Local Civil Date Composing", "UTC Instant Canonicalizing", "Intl Timezone Projecting", "Boundary Session Clamping"]
        ],
        "captions": [
            [
                "The calendar engine derives the first day offset using international standard conventions.",
                "Leading cells are populated with trailing dates from the preceding calendar month.",
                "Current month dates populate sequentially from the first to the final calendar day.",
                "Trailing placeholder cells complete the uniform forty-two cell matrix layout."
            ],
            [
                "Keyboard arrow keys navigate horizontally across days and vertically across weeks.",
                "Vertical navigation advances or retreats by exactly seven days across calendar rows.",
                "Boundary arrow keystrokes flip months automatically while maintaining day coordinates.",
                "Shift and page keys provide instantaneous twelve-month year jumping transitions."
            ],
            [
                "Clicking an initial date cell anchors the start date and enters selecting phase.",
                "Hovering over adjacent cells generates a transient visual range highlight preview.",
                "Inverted date selections automatically swap coordinates to preserve logical ranges.",
                "Completed ranges render with continuous background tints between start and end pills."
            ],
            [
                "Civil date components combine with local hour and minute values into date instances.",
                "Local timestamps serialize into canonical universal time strings terminating with Z.",
                "Modern formatting APIs project universal instants accurately into local timezones.",
                "Business rules clamp time values within official exchange session trading hours."
            ]
        ]
    },
    45: {
        "step_labels": [
            ["Order Ticket Initializing", "Reactive Core Subscribing", "Synchronous Risk Auditing", "Settlement Window Verifying"],
            ["Scaled Integer Arithmetic", "Buying Power Verifying", "Collar Band Auditing", "Circuit Breaker Tripping"],
            ["Asset Combobox Filtering", "Virtual Descendant Selecting", "Execution Directive Tokenizing", "Mutual Exclusion Enforcing"],
            ["Market Calendar Consulting", "Holiday Ledger Cross-Checking", "Weekend Exclusion Computing", "Business Day Accruing"]
        ],
        "captions": [
            [
                "The order blueprint establishes strongly typed data contracts for trading tickets.",
                "High-frequency reactive inputs process rapid typing without virtual DOM cascades.",
                "Synchronous risk rules verify order notional and collateral before submission.",
                "Settlement coordinators calculate compliant clearing windows under regulatory rules."
            ],
            [
                "The financial calculation engine uses scaled integer cents to eliminate drift.",
                "Buying power algorithms verify settled cash and margin leverage against order value.",
                "Price collar checks prevent execution of orders outside five percent market bands.",
                "Violations immediately trip circuit breakers and lock primary submission triggers."
            ],
            [
                "The asset combobox filters across thousands of ticker symbols with virtual focus.",
                "Traders select target instruments with arrow keys while typing remains active.",
                "Execution strategies render as discrete interactive chips with removal buttons.",
                "Contradictory directives are detected and rejected to prevent exchange mismatches."
            ],
            [
                "The settlement engine consults official exchange holiday calendars for clearing.",
                "Federal holidays and market closures are flagged as disabled on the calendar grid.",
                "Weekend days are automatically excluded from allowable settlement clearing dates.",
                "Net business settlement days accrue deterministically under official market rules."
            ]
        ]
    }
}

digit_regex = re.compile(r'\d')

for day_obj in DAYS:
    day_num = day_obj["day"]
    spec = VISUAL_SPECS[day_num]
    visuals = []

    for part_idx in range(4): # parts 0, 1, 2, 3 correspond to visuals 1, 2, 3, 4
        part = day_obj["parts"][part_idx]
        code_bytes = part["code"].encode("utf-8")
        code_hash = hashlib.sha256(code_bytes).hexdigest()

        prompt = f"Design Systems Day {day_num} Part {part_idx + 1} Visual: {part['title']}"
        prompt_sha = hashlib.sha256(prompt.encode("utf-8")).hexdigest()

        step_labels = spec["step_labels"][part_idx]
        captions = spec["captions"][part_idx]

        steps = []
        for s_idx in range(4):
            cap = captions[s_idx]
            # Invariant check: ZERO digits
            if digit_regex.search(cap):
                raise ValueError(f"Digit found in caption for Day {day_num} Part {part_idx+1} Step {s_idx+1}: {cap}")
            if not cap.endswith('.'):
                raise ValueError(f"Caption must end with period for Day {day_num} Part {part_idx+1} Step {s_idx+1}: {cap}")

            steps.append({
                "stepNumber": s_idx + 1,
                "label": step_labels[s_idx],
                "caption": cap
            })

        visual_entry = {
            "visualId": f"design-d{day_num}-p{part_idx + 1}",
            "partNumber": part_idx + 1,
            "title": part["title"],
            "template": "compare",
            "prompt": prompt,
            "promptSha": prompt_sha,
            "codeHash": code_hash,
            "steps": steps
        }
        visuals.append(visual_entry)

    envelope = {
        "schemaVersion": "2.0",
        "courseId": "course-design-systems",
        "day": day_num,
        "visuals": visuals
    }

    out_path = os.path.join(VISUAL_DIR, f"day-{day_num}.json")
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(envelope, f, indent=2)
    print(f"✅ Generated Gate v2 visual envelope: {out_path}")

print("\n🎉 ALL GATE V2 VISUAL ENVELOPES FOR DAYS 41-45 GENERATED AND VALIDATED!")
