# scripts/generate_day60_visual.py
import json
import hashlib
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))
from g3d_day60_data import DAY_60_DATA as day60_data

entries = []

captions = [
    [
        "Architectural overview displays the master engine director unifying six foundational graphics and physics subsystems.",
        "Deep inspection monitors lifecycle initialization dependencies and base memory budget allocations across all modules.",
        "Comparative analysis demonstrates modular data-oriented subsystem coordination over monolithic legacy engine bloat.",
        "Verification confirms all six architectural pillars active, zero dynamic heap allocations, and memory compliance."
    ],
    [
        "Architectural overview illustrates the seven-stage pipelined timeline scheduling graphics and compute queues concurrently.",
        "Deep inspection monitors timeline semaphores coordinating asynchronous physics and culling with rasterization passes.",
        "Comparative analysis demonstrates elimination of idle hardware execution bubbles delivering high framerate throughput.",
        "Verification confirms sub-eight millisecond total frame latency and sustained one hundred-plus frames per second."
    ],
    [
        "Architectural overview displays the unified material lighting engine evaluating multi-lobe physical surface reflections.",
        "Deep inspection evaluates specular, subsurface, thin-film, fiber, and diffuse lobes under thermodynamic energy conservation.",
        "Comparative analysis demonstrates photorealistic multi-layered material shading coupled with atmospheric fog extinction.",
        "Verification confirms physical reciprocity, energy conservation compliance, and seamless volumetric integration."
    ],
    [
        "Architectural overview displays interactive two-way coupling across fluid particles, cloth meshes, and rigid bodies.",
        "Deep inspection monitors GPU compute spatial hashing resolving neighbor searches and momentum-conserving contact forces.",
        "Comparative analysis demonstrates stable multi-physics simulation over uncoupled or one-way kinematic approximations.",
        "Verification confirms kinetic energy dissipation stability, continuous collision safety, and sub-two millisecond solving."
    ],
    [
        "Architectural overview illustrates the grand final capstone stress benchmark across one hundred million source triangles.",
        "Deep inspection audits virtual geometry reduction ratios, sustained framerates, and cool thermal operating margins.",
        "Comparative analysis demonstrates mastery of modern real-time rendering science on commercial-grade hardware budgets.",
        "Verification certifies PinIT Career OS Three-Dimensional Graphics Master Status and complete one hundred percent curriculum achievement."
    ]
]

for idx, p in enumerate(day60_data["parts"]):
    code = p["code"]
    code_hash = hashlib.sha256(code.encode("utf-8")).hexdigest()
    
    # Check no digits in captions
    for c in captions[idx]:
        for ch in c:
            if ch.isdigit():
                raise ValueError(f"Digit found in caption: {c}")

    entry = {
        "partTitle": p["title"],
        "codeHash": code_hash,
        "spec": {
            "template": "compare",
            "title": f"Grand Final Capstone: {p['title']}",
            "left": {
                "label": "Legacy Monolithic Rendering",
                "content": [
                    "Sequential CPU-GPU lock-step synchronization stalls",
                    "Uncontrolled multi-gigabyte memory consumption",
                    "Naive uncoupled physics with numerical instability",
                    "Overdraw-plagued shading collapsing under high geometry"
                ]
            },
            "right": {
                "label": "Master Photorealistic & Multi-Physics Engine",
                "content": [
                    "Pipelined multi-queue asynchronous execution timeline",
                    "Transient memory aliasing within compact VRAM budgets",
                    "Momentum-conserving interactive two-way multi-physics",
                    "Virtual geometry DAG cuts rendering one hundred million triangles"
                ]
            },
            "steps": [
                {
                    "at": "intro",
                    "caption": captions[idx][0]
                },
                {
                    "at": "inspect",
                    "caption": captions[idx][1]
                },
                {
                    "at": "compare",
                    "caption": captions[idx][2]
                },
                {
                    "at": "verify",
                    "caption": captions[idx][3]
                }
            ]
        },
        "filled": {
            "leftLabel": "Legacy Monolithic Rendering",
            "rightLabel": "Master Photorealistic & Multi-Physics Engine"
        }
    }
    entries.append(entry)

prompt_content = json.dumps(entries, sort_keys=True)
prompt_sha = hashlib.sha256(prompt_content.encode("utf-8")).hexdigest()

visual_envelope = {
    "schemaVersion": 2,
    "prefix": "g3d",
    "day": 60,
    "promptSha": prompt_sha,
    "model": "gemini-2.5-pro",
    "entries": entries
}

os.makedirs("src/lib/data/lessonVisuals/g3d", exist_ok=True)
output_path = "src/lib/data/lessonVisuals/g3d/day-60.json"
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(visual_envelope, f, indent=2)

print(f"Successfully generated {output_path} with 0 digits in captions!")
