# scripts/generate_cyber_day54_visual.py
import json
import hashlib
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))
from cyber_day54_data import DAY_54_DATA as day54_data

entries = []

captions = [
    [
        "Architectural overview illustrates digital forensics evidence acquisition structured by the order of volatility.",
        "Deep inspection prioritizes volatile registers, memory, and network sockets ahead of persistent physical media.",
        "Comparative analysis demonstrates volatile evidence preservation over destructive premature system shutdowns.",
        "Verification confirms order of volatility scheduling, volatile state capture, and evidence preservation integrity."
    ],
    [
        "Architectural overview displays live memory inspection using volatility symbol tables and kernel descriptors.",
        "Deep inspection scans virtual address descriptors to detect unlinked processes and injected executable memory pages.",
        "Comparative analysis demonstrates in-memory malware discovery over blind static file-based antivirus scanning.",
        "Verification confirms suspicious process identification, executable memory detection, and payload extraction."
    ],
    [
        "Architectural overview illustrates bit-stream physical disk acquisition utilizing hardware write-blocking bridges.",
        "Deep inspection monitors sector-by-sector copying and calculates cryptographic hash baselines to ensure evidence integrity.",
        "Comparative analysis demonstrates sector-accurate bit-stream imaging over incomplete file explorer copy operations.",
        "Verification confirms cryptographic hash equivalence, write-blocker enforcement, and judicial admissibility certification."
    ],
    [
        "Architectural overview displays super-timeline reconstruction aggregating timestamps across disparate system artifacts.",
        "Deep inspection evaluates master file table timestamp attributes to expose deliberate anti-forensic timestomping attempts.",
        "Comparative analysis demonstrates cross-artifact event reconstruction over isolated single-log investigation methods.",
        "Verification confirms chronological event sequencing, timestomping detection, and verified intrusion narrative."
    ],
    [
        "Architectural overview presents the complete enterprise digital forensics platform certifying scientific readiness.",
        "Deep inspection evaluates unified performance across volatility order, memory analysis, disk imaging, and timelines.",
        "Comparative analysis demonstrates scientifically defensible cyber investigation across distributed enterprise assets.",
        "Verification confirms full platform certification, zero forensic regressions, and verified judicial admissibility."
    ]
]

for idx, p in enumerate(day54_data["parts"]):
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
            "title": f"Digital Forensics: {p['title']}",
            "left": {
                "label": "Flawed Ad-Hoc Investigation",
                "content": [
                    "Responders pull computer power cords immediately, permanently destroying volatile RAM and decrypted keys",
                    "Analysts rely on basic file copy-paste, modifying access timestamps and omitting deleted clusters",
                    "In-memory reflective DLLs and unlinked processes remain invisible to traditional disk file scanners",
                    "Disparate artifact logs are examined in isolation without timeline synchronization or timestomp defense"
                ]
            },
            "right": {
                "label": "Scientific DFIR Platform Architecture",
                "content": [
                    "Order of volatility prioritizes CPU registers, physical RAM, and sockets before persistent disk storage",
                    "Hardware write-blockers and bit-stream imaging preserve exact physical sectors with cryptographic hashes",
                    "Volatility symbol tables and malfind inspection detect and extract in-memory code injection and rootkits",
                    "Super-timelines synchronize cross-artifact events while MFT attribute checks unmask timestomping"
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
            "leftLabel": "Flawed Ad-Hoc Investigation",
            "rightLabel": "Scientific DFIR Platform Architecture",
            "leftContent": [
                "Responders pull computer power cords immediately, permanently destroying volatile RAM and decrypted keys",
                "Analysts rely on basic file copy-paste, modifying access timestamps and omitting deleted clusters",
                "In-memory reflective DLLs and unlinked processes remain invisible to traditional disk file scanners",
                "Disparate artifact logs are examined in isolation without timeline synchronization or timestomp defense"
            ],
            "rightContent": [
                "Order of volatility prioritizes CPU registers, physical RAM, and sockets before persistent disk storage",
                "Hardware write-blockers and bit-stream imaging preserve exact physical sectors with cryptographic hashes",
                "Volatility symbol tables and malfind inspection detect and extract in-memory code injection and rootkits",
                "Super-timelines synchronize cross-artifact events while MFT attribute checks unmask timestomping"
            ]
        }
    }
    entries.append(entry)

prompt_content = f"cyber-day-54-digital-forensics-incident-response-dfir"
prompt_sha = hashlib.sha256(prompt_content.encode("utf-8")).hexdigest()

envelope = {
    "schemaVersion": 2,
    "course": "cyber",
    "prefix": "cyber",
    "day": 54,
    "promptSha": prompt_sha,
    "entries": entries
}

os.makedirs("src/lib/data/lessonVisuals/cyber", exist_ok=True)
out_path = "src/lib/data/lessonVisuals/cyber/day-54.json"
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(envelope, f, indent=2)

print(f"Generated {out_path} successfully with 0 digits in captions!")
