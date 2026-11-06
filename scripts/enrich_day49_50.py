import json
import re

with open('src/lib/data/designWebLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

DAY_49_ADDITIONS = {
    "summary": [
        "High-frequency circular ring buffers absorb real-time quote surges without garbage collection overhead by overwriting stale ticks.",
        "The Micro-Batch Scheduler coalesces rapid price updates in place, collapsing hundreds of micro-ticks into a single requestAnimationFrame pass.",
        "Hardware-accelerated CSS opacity transitions deliver vivid cell flash indications while respecting prefers-reduced-motion preferences.",
        "Canvas and DOM hybrid rendering combines sub-millisecond 2D blitting speeds with transparent semantic ARIA table overlays.",
        "Accessible streaming telemetry quantizes speech updates to focused symbols and delivers microtonal earcons for instant auditory cues."
    ],
    "projectStep": {
        "title": "Build 60fps Real-Time Streaming Data Grid Engine",
        "steps": [
            "Implement HighFrequencyRingBuffer for zero-allocation market tick buffering and backpressure handling",
            "Deploy MicroBatchScheduler with update coalescing and requestAnimationFrame synchronization",
            "Style hardware-composited directional cell flash tokens with reduced-motion static fallbacks",
            "Construct CanvasGridBlitter with devicePixelRatio retina scaling and spatial coordinate hit-testing",
            "Integrate AccessibleStreamingAudioController with focused-symbol quantization and dual-tone earcons"
        ]
    },
    "parts_enrich": [
        {
            "example": "An airport luggage carousel system where bags exceeding terminal conveyor capacity are diverted or older baggage tags are purged to keep the primary runway intake clear.",
            "codeNotes": [
                "A fixed-size array is allocated once at startup to eliminate garbage collection pauses.",
                "Modulo arithmetic calculates head and tail offsets to implement circular wrap-around."
            ],
            "tryIt": "Increase buffer capacity to 10 and push 20 elements, noting how many ticks are dropped."
        },
        {
            "example": "A postal delivery truck departing on a scheduled timetable every 15 minutes with thousands of letters, rather than sending a separate courier for each letter.",
            "codeNotes": [
                "The dirty map overwrites prior prices for the same ticker, collapsing bursts in place.",
                "The flush callback resets the scheduled flag and commits updates atomically."
            ],
            "tryIt": "Simulate a scenario with 10 symbols updating 5,000 times and observe the reduction percentage."
        },
        {
            "example": "An automobile turning beacon or emergency strobe that flashes brightly and then smoothly fades, instantly alerting observers to movement.",
            "codeNotes": [
                "The delta calculation checks if nextPrice is strictly greater than prevPrice.",
                "A temporal CSS class triggers a GPU-composited opacity decay back to transparent."
            ],
            "tryIt": "Add a condition to handle unchanged prices without triggering a visual flash."
        },
        {
            "example": "An animation studio where artists paint thousands of frames onto a single clear cel sheet, rather than constructing individual wooden marionettes.",
            "codeNotes": [
                "The 2D canvas draws rows and columns directly via fillRect and fillText.",
                "Spatial hit-testing uses integer division of click coordinates by cell dimensions."
            ],
            "tryIt": "Implement column width variation in the hit-test function using prefix sum binary search."
        },
        {
            "example": "An air traffic control radio protocol that prioritizes the currently landing airplane and reports quantized flight status instead of constant background static.",
            "codeNotes": [
                "A quantization window timer ensures speech synthesizers are not flooded with micro-ticks.",
                "Earcon tones generate distinct 880Hz high and 440Hz low pitch cues for directional changes."
            ],
            "tryIt": "Add an earcon velocity threshold so that only price changes greater than 1% produce audio tones."
        }
    ]
}

DAY_50_ADDITIONS = {
    "summary": [
        "The Institutional Multi-Asset Trade Blotter employs dual-axis virtual scrolling with pinned symbol and side identifier columns.",
        "Real-time streaming order queues coalesce rapid partial executions in place, dispatching atomic frame updates under adaptive clamps.",
        "Multi-column sorting and freeze-lock modes maintain visual stillness while single-pass accumulators compute gross notional and net PnL.",
        "Excel-grade rectangular cell range selection calculates instant statistical metrics (Count, Sum, Avg, Min, Max) with clipboard TSV export.",
        "The unified blotter suite certifies 60fps performance and WCAG AAA screen reader compliance under rigorous automated assertions."
    ],
    "projectStep": {
        "title": "Synthesize Sovereign Institutional Multi-Asset Trade Blotter Suite",
        "steps": [
            "Architect BlotterLayoutEngine with dual-axis virtualization and pinned left columns",
            "Build StreamingBlotterQueue with burst ingestion buffering and in-place order state coalescing",
            "Deploy BlotterAggregationEngine with sort freeze lock and instantaneous gross notional rollups",
            "Implement BlotterRangeCalculator with rectangular selection bounding boxes and statistical summaries",
            "Certify InstitutionalBlotterSuite with comprehensive automated execution and accessibility assertions"
        ]
    },
    "parts_enrich": [
        {
            "example": "A naval aircraft carrier flight deck control console where ship navigation instruments stay locked on the left while flight deck radar scrolls across multiple runways.",
            "codeNotes": [
                "Pinned left column widths are pre-calculated to establish the horizontal offset boundary.",
                "Visible row indices are sliced with overscan buffers to prevent blanking during high-speed scrolling."
            ],
            "tryIt": "Adjust the overscan buffer from 2 to 5 rows and verify how viewport row start and end indices shift."
        },
        {
            "example": "A city reservoir pressure surge tank that absorbs flash flood torrents from mountain streams and feeds municipal water mains at a smooth, constant flow rate.",
            "codeNotes": [
                "Execution reports queue in a raw buffer before being processed in batches.",
                "Order state maps coalesce multiple execution fills per order into a single state update."
            ],
            "tryIt": "Simulate 100 partial fills for 5 orders and verify the resulting cumulative filled quantity."
        },
        {
            "example": "An automated parcel sorting facility using optical barcode scanners and dynamic scales to route and sum package weights at 60 miles per hour.",
            "codeNotes": [
                "The multi-column comparator supports ascending and descending order with stable tie-breaking.",
                "Single-pass accumulation sums gross notional and net portfolio profit in under one millisecond."
            ],
            "tryIt": "Add an extra sort criterion to sort primarily by status and secondarily by notional descending."
        },
        {
            "example": "An architectural drafting table with a digital caliper that instantly calculates span, area, and load-bearing stress when placed across a structural beam.",
            "codeNotes": [
                "Bounding box normalization ensures row and column coordinates remain positive regardless of drag direction.",
                "Statistical metrics calculate count, sum, average, min, and max across the selected cells."
            ],
            "tryIt": "Extend the calculator to handle disjoint multi-range selections across different portfolio rows."
        },
        {
            "example": "The master pre-flight avionics check on a commercial supersonic airliner verifying radar, engines, hydraulics, and cabin pressure before takeoff.",
            "codeNotes": [
                "The unified blotter suite encapsulates streaming ingestion, batch commit, and live regions.",
                "Automated assertions certify that execution counts, book sizes, and speech announcements match expected invariants."
            ],
            "tryIt": "Execute a block trade of 10,000 shares and verify that the formatted ARIA volume announcement updates correctly."
        }
    ]
}

# Load DAY_46, 47, 48 from scripts
from design_day46_data import DAY_46
from design_day47_data import DAY_47
from design_day48_data import DAY_48
from design_day49_data import DAY_49
from design_day50_data import DAY_50

# Apply enrichments to DAY_49
DAY_49["summary"] = DAY_49_ADDITIONS["summary"]
DAY_49["projectStep"] = DAY_49_ADDITIONS["projectStep"]
for idx, part in enumerate(DAY_49["parts"]):
    enrich = DAY_49_ADDITIONS["parts_enrich"][idx]
    part["example"] = enrich["example"]
    part["codeNotes"] = enrich["codeNotes"]
    part["tryIt"] = enrich["tryIt"]
    part["output"] = part.pop("expectedOutput", "")
    part.pop("id", None)

# Apply enrichments to DAY_50
DAY_50["summary"] = DAY_50_ADDITIONS["summary"]
DAY_50["projectStep"] = DAY_50_ADDITIONS["projectStep"]
for idx, part in enumerate(DAY_50["parts"]):
    enrich = DAY_50_ADDITIONS["parts_enrich"][idx]
    part["example"] = enrich["example"]
    part["codeNotes"] = enrich["codeNotes"]
    part["tryIt"] = enrich["tryIt"]
    part["output"] = part.pop("expectedOutput", "")
    part.pop("id", None)

# Also ensure DAY_46, 47, 48 have output matching their output and no id
for d in [DAY_46, DAY_47, DAY_48]:
    for part in d["parts"]:
        part.pop("id", None)
        if "expectedOutput" in part:
            part["output"] = part.pop("expectedOutput")

# Rewrite Days 46-50 at the end of designWebLongLessons.ts
# Find where Day 46 starts
idx_d46 = text.rfind('{\n  "day": 46,')
assert idx_d46 != -1, "Could not find Day 46 start"

prefix = text[:idx_d46].rstrip().rstrip(',')

days_to_add = [DAY_46, DAY_47, DAY_48, DAY_49, DAY_50]
formatted = []
for d in days_to_add:
    formatted.append(json.dumps(d, indent=2))

new_ts = prefix + ',\n' + ',\n'.join(formatted) + '\n];\n'

with open('src/lib/data/designWebLongLessons.ts', 'w', encoding='utf-8') as f:
    f.write(new_ts)

print("Successfully enriched Days 49 and 50 and updated designWebLongLessons.ts!")
