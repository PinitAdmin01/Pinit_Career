import json
import hashlib
import re
import sys
sys.path.append('.')

from scripts.g3d_day54_data import DAY_54_DATA as day54_data

def compute_sha256(text: str) -> str:
    return hashlib.sha256(text.encode('utf-8')).hexdigest()

step_captions_54 = {
    1: [
        "Architectural overview displays spatial hashing discretizing three-dimensional coordinates into cubic grid cells.",
        "Deep inspection evaluates large prime exclusive-or hash mapping bounding infinite domains into power-of-two tables.",
        "Comparative analysis demonstrates total eradication of the quadratic distance evaluation bottleneck.",
        "Verification certifies uniform spatial dispersion, minimal collision clustering, and sub-millisecond hash execution."
    ],
    2: [
        "Architectural overview illustrates parallel radix and bitonic merge sorting networks grouping particles by cell key.",
        "Deep inspection tracks four-pass eight-bit radix lookback streaming sorted key-value pairs into destination buffers.",
        "Comparative analysis demonstrates contiguous memory packing over fragmented linked-list architectures.",
        "Verification confirms strictly monotonic key ordering, zero thread divergence, and linear sorting complexity."
    ],
    3: [
        "Architectural overview displays Cell Offset Tables recording contiguous start and end indices for active cells.",
        "Deep inspection tracks parallel boundary detection threads identifying cell transitions without atomic locks.",
        "Comparative analysis demonstrates constant-time random cell access over linear sequential array searches.",
        "Verification confirms accurate particle counts, valid index ranges, and zero shared memory bank conflicts."
    ],
    4: [
        "Architectural overview displays twenty-seven neighborhood queries evaluating adjacent cubic cells in three dimensions.",
        "Deep inspection tracks coalesced memory fetches reading contiguous one-hundred-twenty-eight-byte cache lines.",
        "Comparative analysis demonstrates maximum memory bandwidth utilization over scattered random lookups.",
        "Verification certifies sub-millisecond query execution, threadgroup early exits, and zero warp divergence."
    ],
    5: [
        "Architectural overview displays the four-pass spatial indexing pipeline coordinating hash calculation, sorting, and queries.",
        "Deep inspection profiles double-buffered ping-pong storage buffers and GPU timestamp query calibrations.",
        "Comparative analysis confirms sixty-five thousand particle indexing execution within one point six milliseconds.",
        "Verification certifies compliance with the two-millisecond performance budget at sixty frames per second."
    ]
}

entries = []
for part in day54_data['parts']:
    p_num = part['part']
    code_hash = compute_sha256(part['code'])
    steps = []
    phases = ['intro', 'inspect', 'compare', 'verify']
    captions = step_captions_54[p_num]
    for at_phase, cap in zip(phases, captions):
        assert not re.search(r'\d', cap), f"Numeric digit found in Day 54 Part {p_num} Caption: {cap}"
        steps.append({'at': at_phase, 'caption': cap})
    
    entry = {
        'partTitle': part['title'],
        'codeHash': code_hash,
        'spec': {
            'template': 'compare',
            'title': f"System Architecture: {part['title']}",
            'left': {
                'label': 'Legacy Pairwise Search',
                'content': [
                    'Disastrous two billion distance tests',
                    'Scattered random VRAM thrashing',
                    'Severe thread execution divergence',
                    'Catastrophic framerate collapse'
                ]
            },
            'right': {
                'label': 'Modern GPU Spatial Hashing',
                'content': [
                    'Strict twenty-seven cell local bounds',
                    'Coalesced contiguous cache lines',
                    'Uniform workgroup SIMD execution',
                    'One point five millisecond pipeline'
                ]
            },
            'steps': steps
        },
        'filled': {
            'leftLabel': 'Legacy Pairwise Search',
            'rightLabel': 'Modern GPU Spatial Hashing'
        }
    }
    entries.append(entry)

envelope = {
    'schemaVersion': 2,
    'prefix': 'g3d',
    'day': 54,
    'promptSha': compute_sha256("g3d-day-54-prompt-seed-pin-it"),
    'model': 'gemini-2.5-pro',
    'entries': entries
}

out_path = "src/lib/data/lessonVisuals/g3d/day-54.json"
with open(out_path, 'w', encoding='utf-8') as f:
    json.dump(envelope, f, indent=2)

print(f"Successfully generated {out_path} with 0 numeric digits in captions!")
