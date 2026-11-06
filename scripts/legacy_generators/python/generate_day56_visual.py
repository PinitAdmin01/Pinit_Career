import json
import hashlib
import re
import sys
sys.path.append('.')

from scripts.g3d_day56_data import DAY_56_DATA as day56_data

def compute_sha256(text: str) -> str:
    return hashlib.sha256(text.encode('utf-8')).hexdigest()

step_captions_56 = {
    1: [
        "Architectural overview displays Hierarchical Z-Buffering downsampling depth buffers into conservative image pyramids.",
        "Deep inspection evaluates conservative maximum-depth filtering across two-by-two texel neighborhoods.",
        "Comparative analysis demonstrates total eradication of redundant fragment shading overdraw in dense environments.",
        "Verification certifies conservative occluder preservation, sub-millisecond downsampling, and zero false rejections."
    ],
    2: [
        "Architectural overview illustrates screen-space bounding box projection and analytical pyramid level selection.",
        "Deep inspection maps projected pixel footprints to matching pyramid levels for single-fetch four-tap queries.",
        "Comparative analysis demonstrates scale-independent occlusion testing over brute-force high-resolution reads.",
        "Verification confirms reverse floating-point depth precision, near-plane clipping safety, and accurate culling."
    ],
    3: [
        "Architectural overview displays the two-phase occlusion pipeline leveraging temporal coherence between frames.",
        "Deep inspection tracks historical visibility reprojection in phase one and newly visible discovery in phase two.",
        "Comparative analysis demonstrates complete resolution of the chicken-and-egg culling latency paradox.",
        "Verification certifies zero temporal mesh popping, seamless camera rotation, and rapid depth pre-pass convergence."
    ],
    4: [
        "Architectural overview displays GPU multi-draw indirect stream compaction packing surviving mesh commands.",
        "Deep inspection tracks atomic counter allocation writing dense draw parameters with zero memory holes.",
        "Comparative analysis demonstrates single draw call scene dispatch over thousands of CPU driver submissions.",
        "Verification confirms monotonic instance indexing, bindless descriptor binding, and zero host CPU bottlenecks."
    ],
    5: [
        "Architectural overview displays the complete four-pass occlusion culling pipeline and GPU timestamp profiling.",
        "Deep inspection audits Hi-Z generation overhead, two-phase compute culling passes, and scene culling efficiency.",
        "Comparative analysis confirms ten thousand mesh culling execution within zero point six milliseconds.",
        "Verification certifies seventy-two percent overdraw reduction and locked sixty frames per second compliance."
    ]
}

entries = []
for part in day56_data['parts']:
    p_num = part['part']
    code_hash = compute_sha256(part['code'])
    steps = []
    phases = ['intro', 'inspect', 'compare', 'verify']
    captions = step_captions_56[p_num]
    for at_phase, cap in zip(phases, captions):
        assert not re.search(r'\d', cap), f"Numeric digit found in Day 56 Part {p_num} Caption: {cap}"
        steps.append({'at': at_phase, 'caption': cap})
    
    entry = {
        'partTitle': part['title'],
        'codeHash': code_hash,
        'spec': {
            'template': 'compare',
            'title': f"System Architecture: {part['title']}",
            'left': {
                'label': 'Legacy Overdraw Rasterization',
                'content': [
                    'Disastrous twenty million triangle overdraw',
                    'Crushing CPU draw call submission stalls',
                    'High texture cache redundant lookups',
                    'Severe framerate collapse under occlusions'
                ]
            },
            'right': {
                'label': 'Modern GPU Hi-Z Culling',
                'content': [
                    'Conservative 4-tap pyramid queries',
                    'Two-phase zero pop-in latency triage',
                    'Single multi-draw indirect stream compaction',
                    'Over seventy percent overdraw elimination'
                ]
            },
            'steps': steps
        },
        'filled': {
            'leftLabel': 'Legacy Overdraw Rasterization',
            'rightLabel': 'Modern GPU Hi-Z Culling'
        }
    }
    entries.append(entry)

envelope = {
    'schemaVersion': 2,
    'prefix': 'g3d',
    'day': 56,
    'promptSha': compute_sha256("g3d-day-56-prompt-seed-pin-it"),
    'model': 'gemini-2.5-pro',
    'entries': entries
}

out_path = "src/lib/data/lessonVisuals/g3d/day-56.json"
with open(out_path, 'w', encoding='utf-8') as f:
    json.dump(envelope, f, indent=2)

print(f"Successfully generated {out_path} with 0 numeric digits in captions!")
