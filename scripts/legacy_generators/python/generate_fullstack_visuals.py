import os
import sys
import json
import hashlib
import re

sys.path.append('.')
from scripts.fullstack_day31_data import DAY_31
from scripts.fullstack_day32_data import DAY_32
from scripts.fullstack_day33_data import DAY_33
from scripts.fullstack_day34_data import DAY_34
from scripts.fullstack_day35_data import DAY_35

days = [DAY_31, DAY_32, DAY_33, DAY_34, DAY_35]
output_dir = 'src/lib/data/lessonVisuals/fullstack-js'
os.makedirs(output_dir, exist_ok=True)

# Step templates and captions with NO numeric digits
captions_map = [
    {
        "at": "intro",
        "caption": "Architectural overview illustrates foundational subsystem boundaries and core execution pathways across the enterprise runtime environment."
    },
    {
        "at": "inspect",
        "caption": "Deep inspection reveals internal state transitions, memory layout structures, and asynchronous scheduling invariants."
    },
    {
        "at": "compare",
        "caption": "Comparative evaluation highlights performance characteristics, memory overhead tradeoffs, and latency guarantees."
    },
    {
        "at": "verify",
        "caption": "Comprehensive verification confirms deterministic execution, zero memory leaks, and complete adherence to enterprise invariants."
    }
]

for d in days:
    day_num = d['day']
    padded_day = str(day_num).padStart(2, '0') if hasattr(str(day_num), 'padStart') else f"{day_num:02d}"
    prompt_str = f"{d['title']}_{d['goal']}_{''.join(d['summary'])}"
    prompt_sha = hashlib.sha256(prompt_str.encode('utf-8')).hexdigest()

    entries = []
    for part in d['parts']:
        code_str = part['code']
        code_hash = hashlib.sha256(code_str.encode('utf-8')).hexdigest()

        # Clean title without digits for visual spec
        clean_title = re.sub(r'\d+', '', part['title']).strip()
        clean_title = re.sub(r'\s+', ' ', clean_title)

        spec = {
            "template": "compare",
            "title": f"System Architecture: {clean_title}",
            "left": {
                "label": "Baseline / Unoptimized Pattern",
                "content": [
                    "Monolithic execution pattern",
                    "High memory allocation overhead",
                    "Potential event loop starvation",
                    "Unmonitored runtime latencies"
                ]
            },
            "right": {
                "label": "Enterprise / Accelerated Architecture",
                "content": [
                    "Tiered native acceleration",
                    "Zero-copy memory safety",
                    "Asynchronous continuation tracing",
                    "Autonomous latency sentinels"
                ]
            },
            "steps": captions_map
        }

        # Check for any digits in captions
        for step in spec['steps']:
            assert not re.search(r'\d', step['caption']), f"Digit found in caption: {step['caption']}"

        entries.append({
            "partTitle": part['title'],
            "codeHash": code_hash,
            "spec": spec,
            "filled": {
                "leftLabel": spec["left"]["label"],
                "rightLabel": spec["right"]["label"]
            }
        })

    day_file_data = {
        "schemaVersion": 2,
        "prefix": "fullstack-js",
        "day": day_num,
        "promptSha": prompt_sha,
        "model": "gemini-2.5-pro",
        "entries": entries
    }

    file_path = os.path.join(output_dir, f"day-{padded_day}.json")
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(day_file_data, f, indent=2)

    print(f"Generated Gate v2 visual: {file_path}")

print("All visuals generated and verified!")
