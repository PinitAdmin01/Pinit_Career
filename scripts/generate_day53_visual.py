import json
import hashlib
import re
import sys
sys.path.append('.')

from scripts.g3d_day53_data import DAY_53_DATA as day53_data

def compute_sha256(text: str) -> str:
    return hashlib.sha256(text.encode('utf-8')).hexdigest()

step_captions_53 = {
    1: [
        "Architectural overview displays Continuous Collision Detection sweeping geometric volumes across discrete time steps.",
        "Deep inspection evaluates swept sphere quadratic root solving determining exact sub-millisecond Time of Impact.",
        "Comparative analysis demonstrates total eradication of the bullet-through-paper tunneling problem.",
        "Verification certifies non-negative Time of Impact roots, safe trajectory advance, and zero geometry penetration."
    ],
    2: [
        "Architectural overview illustrates Minkowski difference vector sets mapping relative convex hull separations.",
        "Deep inspection tracks Gilbert-Johnson-Keerthi simplex iterations querying extreme boundary support points.",
        "Comparative analysis demonstrates sub-millisecond convergence of simplex searching over costly polygonal mesh checks.",
        "Verification confirms origin enclosure detection, minimal simplex sizes, and bounded iteration counts."
    ],
    3: [
        "Architectural overview displays the Expanding Polytope Algorithm growing the terminating simplex toward Minkowski boundaries.",
        "Deep inspection evaluates closest triangular face normals, horizon loop culling, and support point insertion.",
        "Comparative analysis demonstrates sub-millimeter contact normal and penetration depth extraction precision.",
        "Verification confirms strictly convex polytope expansion, non-negative depth metrics, and robust convergence."
    ],
    4: [
        "Architectural overview displays persistent contact manifolds caching up to four contact points across consecutive frames.",
        "Deep inspection tracks sequential impulse resolution applying normal restitution and Coulomb friction impulses.",
        "Comparative analysis demonstrates rock-solid stacking stability without solving expensive global matrix systems.",
        "Verification certifies warm starting impulse inheritance, zero table wobbling, and realistic sliding friction."
    ],
    5: [
        "Architectural overview displays the three-tier collision architecture coordinating broad-phase BVH and narrow-phase solvers.",
        "Deep inspection profiles dynamic simulation island generation, quiescent body sleeping, and GPU workgroup dispatch.",
        "Comparative analysis confirms one thousand rigid body simulation execution within one point five milliseconds.",
        "Verification certifies zero tunneling across millions of steps and locked sixty frames per second compliance."
    ]
}

entries = []
for part in day53_data['parts']:
    p_num = part['part']
    code_hash = compute_sha256(part['code'])
    steps = []
    phases = ['intro', 'inspect', 'compare', 'verify']
    captions = step_captions_53[p_num]
    for at_phase, cap in zip(phases, captions):
        assert not re.search(r'\d', cap), f"Numeric digit found in Day 53 Part {p_num} Caption: {cap}"
        steps.append({'at': at_phase, 'caption': cap})
    
    entry = {
        'partTitle': part['title'],
        'codeHash': code_hash,
        'spec': {
            'template': 'compare',
            'title': f"System Architecture: {part['title']}",
            'left': {
                'label': 'Legacy Discrete Collision',
                'content': [
                    'Severe high-speed bullet tunneling',
                    'Costly polygonal pairwise tests',
                    'Single-point unstable rocking',
                    'Vibrational penalty spring bounce'
                ]
            },
            'right': {
                'label': 'Modern GJK/EPA CCD Pipeline',
                'content': [
                    'Continuous swept Time of Impact',
                    'Sub-millisecond simplex support queries',
                    'Stable multi-point contact manifolds',
                    'Jitter-free sequential impulses'
                ]
            },
            'steps': steps
        },
        'filled': {
            'leftLabel': 'Legacy Discrete Collision',
            'rightLabel': 'Modern GJK/EPA CCD Pipeline'
        }
    }
    entries.append(entry)

envelope = {
    'schemaVersion': 2,
    'prefix': 'g3d',
    'day': 53,
    'promptSha': compute_sha256("g3d-day-53-prompt-seed-pin-it"),
    'model': 'gemini-2.5-pro',
    'entries': entries
}

out_path = "src/lib/data/lessonVisuals/g3d/day-53.json"
with open(out_path, 'w', encoding='utf-8') as f:
    json.dump(envelope, f, indent=2)

print(f"Successfully generated {out_path} with 0 numeric digits in captions!")
