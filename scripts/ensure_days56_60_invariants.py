# scripts/ensure_days56_60_invariants.py
import sys
import os
import json

sys.path.insert(0, os.path.dirname(__file__))

from g3d_day56_data import DAY_56_DATA
from g3d_day57_data import DAY_57_DATA
from g3d_day58_data import DAY_58_DATA
from g3d_day59_data import DAY_59_DATA
from g3d_day60_data import DAY_60_DATA

day_modules = [
    (56, DAY_56_DATA, "scripts/g3d_day56_data.py"),
    (57, DAY_57_DATA, "scripts/g3d_day57_data.py"),
    (58, DAY_58_DATA, "scripts/g3d_day58_data.py"),
    (59, DAY_59_DATA, "scripts/g3d_day59_data.py"),
    (60, DAY_60_DATA, "scripts/g3d_day60_data.py"),
]

default_examples = {
    57: [
        "Partition a complex 3D mesh into uniform 128-triangle clusters and calculate bounding spheres and quadric simplification error metrics.",
        "Group adjacent clusters into a Directed Acyclic Graph hierarchy with locked boundary edges to ensure crack-free transitions.",
        "Evaluate screen-space projected pixel error across camera distance to dynamically select the perceptually lossless 1-pixel LOD cut.",
        "Classify triangle pixel area and route sub-pixel micro-triangles to 64x64 compute tile software rasterization.",
        "Assemble the complete virtual geometry pipeline, achieving over 100x geometric reduction across 100M source triangles."
    ],
    58: [
        "Construct a declarative render graph DAG, resolve RAW hazards, and compute optimal topological execution order with pipeline barriers.",
        "Analyze intermediate texture lifetimes and assign non-overlapping allocations to a compact shared physical memory heap.",
        "Schedule concurrent compute workloads onto an asynchronous compute queue with timeline semaphore synchronization.",
        "Merge dependent G-Buffer and lighting passes into tile-local subpasses, eliminating 83.3% of external DDR memory traffic.",
        "Audit the production render graph engine against microsecond compilation budgets and 60 FPS frame pacing SLAs."
    ],
    59: [
        "Record hardware GPU timestamp queries around rendering passes and evaluate nanosecond elapsed times using calibrated clocks.",
        "Sample hardware pipeline statistics counters to calculate screen overdraw ratios and geometric clipping efficiency.",
        "Modulate internal 3D framebuffer resolution dynamically using a PID feedback controller to prevent thermal clock throttling.",
        "Render a zero-allocation in-engine profiler HUD overlay computing rolling P50, P95, and P99 frame latency percentiles.",
        "Certify production readiness across heterogeneous hardware profiles, ensuring stable 60+ FPS pacing and safe thermal margins."
    ],
    60: [
        "Initialize all six foundational engine subsystems and audit base VRAM allocations within the 1,024 MB memory budget.",
        "Orchestrate a 7-stage pipelined frame loop across graphics and compute queues, sustaining 137 FPS at 7.3ms latency.",
        "Evaluate unified multi-lobe PBR material radiance (Cook-Torrance, SSS, thin-film, fiber) with atmospheric volumetric fog.",
        "Simulate two-way interactive coupling across 100,000 SPH fluid particles, 16,384 XPBD cloth vertices, and rigid bodies on GPU compute.",
        "Pass the Grand Final Capstone stress benchmark across 100M source triangles, awarding the PinIT Career OS 3D Graphics Master Status."
    ]
}

for day_num, day_data, file_path in day_modules:
    day_data["coursePrefix"] = "g3d"
    day_data["course"] = "g3d"
    
    for idx, part in enumerate(day_data["parts"]):
        if not part.get("example") and day_num in default_examples:
            part["example"] = default_examples[day_num][idx]
            
    with open(file_path, "w", encoding="utf-8") as f:
        var_name = f"DAY_{day_num}_DATA"
        f.write(f"# {file_path}\n{var_name} = {repr(day_data)}\n")
    print(f"Updated {file_path} with coursePrefix: 'g3d' and examples!")

# Now re-integrate into src/lib/data/g3dLongLessons.ts
block12_days = [DAY_56_DATA, DAY_57_DATA, DAY_58_DATA, DAY_59_DATA, DAY_60_DATA]

ts_path = "src/lib/data/g3dLongLessons.ts"
with open(ts_path, "r", encoding="utf-8") as f:
    content = f.read()

# Find Day 56 in ts_path or Day 55
idx56 = content.find('"day": 56')
if idx56 == -1:
    idx56 = content.find('day: 56')

if idx56 != -1:
    # Find the object start before Day 56
    cut_idx = content.rfind("},\n{", 0, idx56)
    if cut_idx != -1:
        base_content = content[:cut_idx+1]
    else:
        raise ValueError("Could not find boundary before Day 56")
else:
    idx55 = content.rfind('"day": 55')
    if idx55 == -1:
        idx55 = content.rfind('day: 55')
    cut_idx = content.find("}\n];", idx55)
    base_content = content[:cut_idx+1]

formatted_days = []
for day in block12_days:
    formatted_days.append(",\n" + json.dumps(day, indent=2))

new_ts_content = base_content + "".join(formatted_days) + "\n];\n"

with open(ts_path, "w", encoding="utf-8") as f:
    f.write(new_ts_content)

print(f"Successfully re-integrated Block 12 into {ts_path}!")
