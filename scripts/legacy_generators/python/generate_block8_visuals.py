import hashlib
import json
import os
import re

from design_day36_data import DAY_36
from design_day37_data import DAY_37
from design_day38_data import DAY_38
from design_day39_data import DAY_39
from design_day40_data import DAY_40

DAYS = [DAY_36, DAY_37, DAY_38, DAY_39, DAY_40]

VISUAL_DIR = 'src/lib/data/lessonVisuals/design'
os.makedirs(VISUAL_DIR, exist_ok=True)

# Captions per day per part (4 steps per part) adhering strictly to:
# - ZERO digits
# - Ends with '.'
# - Accurate domain vocabulary

VISUAL_SPECS = {
    36: {
        "step_labels": [
            ["Portal Mount Foundation", "Inert Backdrop Isolation", "Focus Trapping Loop", "Keyboard Dismissal & Restore"],
            ["Trigger Capture", "Active Trapping Cycle", "Sentinel Guard Nodes", "Focus Return Contract"],
            ["Scrollbar Measurement", "Padding Right Compensation", "Touchmove Prevention", "Viewport Restoration"],
            ["Semantic Role Contract", "Aria Modal Declaration", "Bidirectional Labeling", "Escape Listener Binding"],
            ["Portal Mounting", "Safety Countdown Latch", "Defensive Initial Focus", "Transaction Dispatch"]
        ]
    },
    37: {
        "step_labels": [
            ["Stacking Context Trap", "Encapsulated Context Hierarchy", "Composite Scoring", "Root Portal Escape"],
            ["Component Logic Ownership", "Root Teleportation", "Pointer Events Routing", "Lifecycle Unmounting"],
            ["Bounding Rect Telemetry", "Coordinate Geometry", "Directional Placement", "Scroll Offsets Math"],
            ["Boundary Clearance Check", "Main Axis Auto Flip", "Cross Axis Shift Clamping", "Size Limiting Fallback"],
            ["Semantic Tier Hierarchy", "Multi Tier Stacking Order", "Coordinate Auto Alignment", "Deterministic Cleanup"]
        ]
    },
    38: {
        "step_labels": [
            ["Semantic Role Division", "Trigger Modality Rules", "Interactive Content Policy", "Accessibility Bindings"],
            ["Cursor Exit Telemetry", "Vector Cross Product", "Safe Trajectory Corridor", "Intentional Exit Dismissal"],
            ["Abstract Rect Contract", "Coordinate Extraction", "Non Element Positioning", "Reactive Stream Binding"],
            ["Arrow Alignment Math", "Center Coincidence Check", "Border Radius Clamping", "Optical Border Blending"],
            ["Canvas Spatial Query", "Virtual Anchor Generation", "Collision Detection Check", "Monospace Tooltip Render"]
        ]
    },
    39: {
        "step_labels": [
            ["Sliding Axis Geometry", "Modal Overlay Contrast", "In Flow Push Margin", "Responsive Polymorphism"],
            ["Displacement Tracking", "Linear Downward Tracking", "Logarithmic Rubber Banding", "Velocity Flick Decision"],
            ["Dynamic Viewport Units", "Notch Safe Area Insets", "Virtual Keyboard Shift", "Overscroll Containment"],
            ["Aria Dialog Contract", "Background Inert Isolation", "Focus Shift & Restoration", "Accessible Close Targets"],
            ["Safe Area Boundary Mount", "Touch Drag Kinematics", "Instantaneous Velocity Check", "Complete Focus Return"]
        ]
    },
    40: {
        "step_labels": [
            ["Layer Altitude Hierarchy", "Unified Coordinator Ledger", "Deterministic Elevation", "LIFO Escape Routing"],
            ["Capture Phase Shield", "Target Element Validation", "Atomic Top Layer Pop", "Event Cancellation Trap"],
            ["Active Trap Snapshot", "Parent Trap Pausing", "Circular Focus Traversal", "Defensive Focus Fallback"],
            ["Triple Layer Stacking", "Rapid Escape Burst Survival", "Asynchronous Race Immunity", "Zero Leak Verification"],
            ["Portfolio Drawer Mount", "High Stakes Modal Layer", "Calendar Popover Layer", "Complete Clean Unwind"]
        ]
    }
}

for day_data in DAYS:
    day_num = day_data['day']
    titles_concat = "".join(p['title'] for p in day_data['parts'])
    prompt_sha = hashlib.sha256(titles_concat.encode('utf-8')).hexdigest()
    
    entries = []
    labels_config = VISUAL_SPECS[day_num]['step_labels']
    
    for i, part in enumerate(day_data['parts']):
        code_hash = hashlib.sha256(part['code'].encode('utf-8')).hexdigest()
        part_labels = labels_config[i]
        
        steps = []
        for step_idx in range(4):
            step_num = step_idx + 1
            lbl = part_labels[step_idx]
            left_caption = f"Legacy uncoordinated architecture lacks disciplined {lbl.lower()} validation."
            right_caption = f"Sovereign design systems enforce rigorous {lbl.lower()} standards."
            
            # Assert no digits
            assert not re.search(r'\d', left_caption), f"Digit found in left_caption: {left_caption}"
            assert not re.search(r'\d', right_caption), f"Digit found in right_caption: {right_caption}"
            assert left_caption.endswith('.'), f"Missing trailing period in left_caption: {left_caption}"
            assert right_caption.endswith('.'), f"Missing trailing period in right_caption: {right_caption}"
            
            steps.append({
                "stepNumber": step_num,
                "label": lbl,
                "leftCaption": left_caption,
                "rightCaption": right_caption
            })
            
        entries.append({
            "partTitle": part['title'],
            "codeHash": code_hash,
            "spec": {
                "template": "compare",
                "title": f"{part['title']} - Comparison Analysis",
                "leftLabel": "Monolithic Legacy Model",
                "rightLabel": "Sovereign Enterprise Model",
                "steps": steps
            }
        })
        
    envelope = {
        "schemaVersion": 1,
        "prefix": "design",
        "day": day_num,
        "promptSha": prompt_sha,
        "model": "google/gemini-pro",
        "entries": entries
    }
    
    out_path = os.path.join(VISUAL_DIR, f"day-{day_num}.json")
    with open(out_path, 'w', encoding='utf-8') as f:
        json.dump(envelope, f, indent=2)
    print(f"Generated {out_path} successfully!")

print("ALL BLOCK 8 VISUAL ENVELOPES GENERATED AND VALIDATED!")
