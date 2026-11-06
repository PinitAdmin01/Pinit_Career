import os
import sys

sys.path.insert(0, os.path.abspath('scripts'))
from react_day40_data import day40

day40['parts'][3]['output'] = """--- Initial Viewport: Top-Left Quadrant (800x600) ---
Total Matching Nodes: 2000
Visible Nodes Rendered: 245 (GPU load reduced by 87.8%!)
Culled Offscreen Nodes: 1755

--- Pan Camera to Center: (600, 600) ---
[Camera Pan] Viewport moved to: x=[600, 1400], y=[600, 1200]
Visible Nodes Rendered: 235 (Culled: 1765)"""

day40['parts'][4]['output'] = """--- Phase 1: Rapid Typing with In-Flight Preemption ---
[SyncLane] User input: \"Security\" (Echoed in 0.1ms | isPending: true)
  -> [Transition Slice #1] Evaluated nodes 0..2500 (Duration: 5ms)
[SyncLane] User input: \"Database\" (Echoed in 0.1ms | isPending: true)
  -> [PREEMPTION] Aborted in-flight filter for \"Security\"

--- Phase 2: Complete All Slices for \"Database\" ---
  -> [Transition Slice #2] Evaluated nodes 0..2500 (Duration: 5ms)
  -> [Transition Slice #3] Evaluated nodes 2500..5000 (Duration: 5ms)
  -> [Transition Slice #4] Evaluated nodes 5000..7500 (Duration: 5ms)
  -> [Transition Slice #5] Evaluated nodes 7500..10000 (Duration: 5ms)
[Commit] Query \"Database\" complete!
  -> Total Matches in Graph: 2000
  -> Visible Nodes in Viewport: 245 (Culled: 1755)
  -> isPending: false | Graph Opacity: 1.0

=== Milestone 7 Telemetry & Frame Budget Audit ===
Urgent Sync Commits: 2
In-Flight Preemptions: 1
Total Cooperative Slices: 5
Max Slice Duration: 5ms (Budget: 16.66ms)
Total Blocking Time (TBT): 0ms
Visible Nodes Rendered: 245
60 FPS Frame Budget Status: PASS (Zero Jank)
MILESTONE 7 CAPSTONE VERDICT: FULLY PASSING & 60 FPS CERTIFIED"""

output_py = []
output_py.append("import hashlib\n")
output_py.append("import json\n\n")
output_py.append("def sha256(text: str) -> str:\n")
output_py.append("    return hashlib.sha256(text.encode('utf-8')).hexdigest()\n\n")
output_py.append("day40 = " + repr(day40) + "\n")

with open('scripts/react_day40_data.py', 'w', encoding='utf-8') as f:
    f.write("".join(output_py))

print("Successfully updated scripts/react_day40_data.py outputs!")
