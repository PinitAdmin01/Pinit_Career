# scripts/generate_block10_visuals.py
import hashlib
import json
import os
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')
sys.path.insert(0, 'scripts')
from design_day46_data import DAY_46
from design_day47_data import DAY_47
from design_day48_data import DAY_48
from design_day49_data import DAY_49
from design_day50_data import DAY_50

DAYS = [DAY_46, DAY_47, DAY_48, DAY_49, DAY_50]

VISUAL_DIR = 'src/lib/data/lessonVisuals/design'
os.makedirs(VISUAL_DIR, exist_ok=True)

VISUAL_SPECS = {
    46: {
        "step_labels": [
            ["Unbounded Table Nodes", "Browser Reflow Cascade", "Scroll Position Measuring", "Window Bounding Box"],
            ["Vertical Row Slicing", "Horizontal Column Pruning", "Absolute Transform Positioning", "Overscan Buffer Padding"],
            ["Pointer Capture Initiating", "Delta Pixel Calculating", "Minimum Width Clamping", "Layout Shift Suppressing"],
            ["Z-Index Layer Elevating", "Dual-Axis Scroll Decoupling", "Drop Shadow Boundary Affording", "Sticky Stacking Ordering"]
        ],
        "captions": [
            [
                "Initial large table loads all rows directly into the document object model.",
                "Massive element trees cause severe style recalculation and layout thrashing.",
                "Viewport scroll position is measured to compute visible row indices.",
                "Only visible rows are retained while offscreen nodes are unmounted."
            ],
            [
                "Row indices are sliced dynamically based on current vertical scroll position.",
                "Horizontal columns outside the visible viewport are omitted from layout.",
                "Rendered cells are positioned via hardware accelerated translate transforms.",
                "Extra buffer rows and columns prevent visual blanking during fast scrolling."
            ],
            [
                "Pointer down on column separator initiates global pointer capture.",
                "Mouse movement computes instantaneous horizontal pixel delta offsets.",
                "Column width clamps strictly against predefined minimum boundary limits.",
                "Adjacent columns adjust via flex spacing without shifting global layout."
            ],
            [
                "Pinned header row elevates z-index above virtualized scrolling body rows.",
                "Horizontal body scroll synchronizes with header without vertical drift.",
                "Border shadow affords depth cue when unpinned columns slide underneath.",
                "Pinned identifier column locks to the left margin during wide panning."
            ]
        ]
    },
    47: {
        "step_labels": [
            ["Primary Column Comparing", "Secondary Tie Breaking", "Stable Index Preserving", "Sort Direction Toggling"],
            ["Tokenized Query Parsing", "Predicate Array Compiling", "Inverted Index Intersecting", "Filtered Subset Emitting"],
            ["Dimension Key Extracting", "Bucketed Map Aggregating", "Summary Metric Computing", "Expandable Row Nesting"],
            ["Row Attribute Assigning", "Column Dimension Pivoting", "Matrix Coordinate Mapping", "Cross-Tabulation Rasterizing"]
        ],
        "captions": [
            [
                "Primary comparator evaluates main attribute values across record pairs.",
                "Secondary comparator resolves equal values without altering original order.",
                "Stable sorting algorithms preserve initial insertion sequence for tied keys.",
                "Header click toggles between ascending, descending, and neutral sort orders."
            ],
            [
                "Search string parses into discrete normalized query search tokens.",
                "Filter predicates compile into optimized single-pass evaluation routines.",
                "Inverted index bitsets perform rapid intersection across criteria.",
                "Matching record references emit directly to the virtual presentation view."
            ],
            [
                "Records are partitioned into categorical buckets by grouping dimension.",
                "Numeric attributes accumulate into totals, averages, and extreme values.",
                "Aggregate rollups compute instantaneous summary statistics per group.",
                "Parent summary rows expand and collapse nested detail items gracefully."
            ],
            [
                "Unique row identifier attributes establish vertical matrix categories.",
                "Selected column dimensions rotate horizontally into column headers.",
                "Intersecting values resolve into coordinate cells via fast hash lookups.",
                "Two-dimensional matrix rasterizes into a clean cross-tabulated grid."
            ]
        ]
    },
    48: {
        "step_labels": [
            ["Anchor Coordinate Setting", "Active Focus Navigating", "Bounding Box Normalizing", "Selection Overlay Styling"],
            ["Arrow Key Intercepting", "Matrix Coordinate Clamping", "Shift Modifier Expanding", "Scroll Into View Aligning"],
            ["Double-Click Detecting", "Input Overlay Spawning", "Keystroke Value Updating", "Transactional Value Committing"],
            ["Range Coordinates Serializing", "Tab-Delimited String Building", "Clipboard Write Dispatching", "Paste Ingestion Validating"]
        ],
        "captions": [
            [
                "Mouse press establishes the primary origin anchor cell coordinate.",
                "Pointer drag extends current focus coordinate across row and column spans.",
                "Calculated bounding box normalizes regardless of drag direction.",
                "Semi-transparent brand tint highlights the active selection bounding box."
            ],
            [
                "Keyboard arrow events intercept default page scroll and navigate cells.",
                "Target row and column indices clamp within valid matrix boundaries.",
                "Shift key with directional arrows expands the rectangular selection box.",
                "Target cell smoothly scrolls into viewport if currently positioned offscreen."
            ],
            [
                "Double click or enter key triggers inline editable input mode.",
                "Text input mounts seamlessly matching target cell bounding box dimensions.",
                "Typing updates draft value with live constraint validation feedback.",
                "Enter key commits updated value while escape key cancels the edit."
            ],
            [
                "Selected cell values extract in natural row and column matrix order.",
                "Values serialize into standard tab-separated and newline-delimited text.",
                "System clipboard receives serialized text for spreadsheet interoperability.",
                "Paste event parses incoming text and writes values into target range."
            ]
        ]
    },
    49: {
        "step_labels": [
            ["Socket Frame Receiving", "Binary Message Unpacking", "Ring Buffer Inserting", "Stale Packet Overwriting"],
            ["Dirty Key Registering", "In-Place Value Coalescing", "Frame Tick Awaiting", "Atomic Store Committing"],
            ["Price Delta Calculating", "Flash Class Assigning", "Composited Opacity Fading", "Motion Preference Honoring"],
            ["Viewport Bounds Projecting", "Canvas Context Blitting", "Coordinate Hit Testing", "Transparent DOM Overlaying"]
        ],
        "captions": [
            [
                "WebSocket connection receives streaming financial market tick frames.",
                "Binary protocol decodes price and quantity fields with zero string garbage.",
                "Fixed ring buffer stores incoming ticks without dynamic heap expansion.",
                "Buffer saturation safely overwrites oldest entries to keep current data."
            ],
            [
                "Arriving ticks mark updated asset symbols in a dirty key tracking map.",
                "Rapid successive ticks for identical symbols overwrite in place.",
                "Micro-batch scheduler awaits next animation frame synchronization pulse.",
                "Coalesced state commits atomically to the grid in a single layout pass."
            ],
            [
                "Incoming price compares with previous price to determine tick direction.",
                "Temporal green or red flash styling attaches immediately to the cell.",
                "Hardware-accelerated opacity curve fades smoothly back to neutral.",
                "Static chevron icons replace flashing strobes when reduced motion is on."
            ],
            [
                "Visible cell rectangle coordinates project onto hardware canvas context.",
                "High-density numeric text and background colors draw in single blit pass.",
                "Pointer coordinates calculate target row and column in constant time.",
                "Invisible semantic table elements overlay canvas for screen reader access."
            ]
        ]
    },
    50: {
        "step_labels": [
            ["Dual-Axis Viewport Mounting", "Symbol Column Pinning", "Overscan Buffer Allocating", "Virtual Height Sizing"],
            ["Execution Fill Ingesting", "Order State Map Coalescing", "Batch Flush Dispatching", "Adaptive Clamp Regulating"],
            ["Gross Notional Sorting", "Sort Position Freezing", "Portfolio Summary Summing", "Sticky Status Bar Updating"],
            ["Range Coordinates Selecting", "Statistical Metric Calculating", "Inline Order Amending", "Clipboard Matrix Exporting"]
        ],
        "captions": [
            [
                "Trade blotter mounts dual-axis viewport for high-density trade items.",
                "Symbol and side columns pin securely along the left viewport margin.",
                "Overscan buffer rows eliminate visual clipping during fast navigation.",
                "Virtual container dimensions simulate full order book scroll height."
            ],
            [
                "Incoming order execution reports buffer rapidly into ingestion queue.",
                "Multiple partial execution fills for matching order ids coalesce in place.",
                "Animation frame pulse dispatches coalesced order book to presentation.",
                "Adaptive throttle clamp protects frame rates during intense market volume."
            ],
            [
                "Orders sort in descending order based on total gross notional volume.",
                "Sort freeze mode prevents rows from shifting positions on rapid micro-ticks.",
                "Single-pass accumulator computes total gross notional and net portfolio profit.",
                "Sticky footer status bar displays real-time aggregated portfolio metrics."
            ],
            [
                "Operator drags rectangular bounding box across multiple trade cells.",
                "Dynamic calculation engine produces sum, average, min, and max readouts.",
                "Double clicking price cell allows inline limit price amendment entry.",
                "Keyboard copy exports selected trade values into standard spreadsheet format."
            ]
        ]
    }
}

digit_regex = re.compile(r"\d")

for day_dict in DAYS:
    day_num = day_dict["day"]
    spec = VISUAL_SPECS[day_num]
    visuals = []

    for part_idx in range(4):
        part = day_dict["parts"][part_idx]
        code = part.get("code", "")
        code_hash = hashlib.sha256(code.encode("utf-8")).hexdigest()

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

print("\n🎉 ALL GATE V2 VISUAL ENVELOPES FOR DAYS 46-50 GENERATED AND VALIDATED!")
