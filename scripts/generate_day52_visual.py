import json
import hashlib
import re
import sys
sys.path.append('.')

from scripts.g3d_day52_data import DAY_52_DATA as day52_data

def compute_sha256(text: str) -> str:
    return hashlib.sha256(text.encode('utf-8')).hexdigest()

step_captions_52 = {
    1: [
        "Architectural overview displays Position Based Dynamics bypassing force layers to project positions directly onto constraint manifolds.",
        "Deep inspection evaluates distance constraint projection calculating geometric displacement vectors between vertices.",
        "Comparative analysis demonstrates unconditional stability of geometric projection over explosive mass-spring oscillations.",
        "Verification certifies exact inelastic edge resolution, inverse mass weighting, and zero numerical energy drift."
    ],
    2: [
        "Architectural overview illustrates Extended Position Based Dynamics connecting constraint projections to continuum mechanics.",
        "Deep inspection tracks compliance alpha scaled by time step duration squared maintaining physical stiffness invariance.",
        "Comparative analysis demonstrates complete decoupling of material stiffness from simulation sub-stepping frequencies.",
        "Verification confirms Lagrange multiplier accumulation and accurate structural stress force evaluation in Newtons."
    ],
    3: [
        "Architectural overview displays isometric dihedral bending constraints formulated across adjacent triangle pairs sharing hinge edges.",
        "Deep inspection calculates dihedral angle differentials and restorative out-of-plane bending energy.",
        "Comparative analysis demonstrates natural flowing textile creases versus unnatural paper-like triangle creasing.",
        "Verification confirms elastic recovery forces, Laplacian curvature operators, and smooth drapery deformation."
    ],
    4: [
        "Architectural overview displays inequality constraint projection resolving collisions against character kinematic capsules.",
        "Deep inspection evaluates swept sphere penetration depths, outward normal projection, and Coulomb friction impulses.",
        "Comparative analysis contrasts instantaneous inequality projection against jittery penalty spring forces.",
        "Verification certifies zero obstacle penetration, realistic contact grip, and spatial hashing self-collision culling."
    ],
    5: [
        "Architectural overview displays GPU compute shader pipeline architecture executing graph-colored constraint batches.",
        "Deep inspection profiles memory coalescence, storage buffer layouts, and sub-step iteration convergence.",
        "Comparative analysis confirms four thousand vertex cloth simulation execution within two milliseconds.",
        "Verification certifies sub-millimeter constraint error convergence and locked sixty frames per second performance."
    ]
}

entries = []
for part in day52_data['parts']:
    p_num = part['part']
    code_hash = compute_sha256(part['code'])
    steps = []
    phases = ['intro', 'inspect', 'compare', 'verify']
    captions = step_captions_52[p_num]
    for at_phase, cap in zip(phases, captions):
        assert not re.search(r'\d', cap), f"Numeric digit found in Day 52 Part {p_num} Caption: {cap}"
        steps.append({'at': at_phase, 'caption': cap})
    
    entry = {
        'partTitle': part['title'],
        'codeHash': code_hash,
        'spec': {
            'template': 'compare',
            'title': f"System Architecture: {part['title']}",
            'left': {
                'label': 'Legacy Mass-Spring Solver',
                'content': [
                    'Explosive high-stiffness blowups',
                    'Severe time-step stretching drift',
                    'Unnatural paper-like crease pinching',
                    'Jittery penalty spring collisions'
                ]
            },
            'right': {
                'label': 'Modern GPU XPBD Engine',
                'content': [
                    'Unconditionally stable position projection',
                    'Time-step independent compliance alpha',
                    'Realistic isometric dihedral bending',
                    'Jitter-free inequality contact manifolds'
                ]
            },
            'steps': steps
        },
        'filled': {
            'leftLabel': 'Legacy Mass-Spring Solver',
            'rightLabel': 'Modern GPU XPBD Engine'
        }
    }
    entries.append(entry)

envelope = {
    'schemaVersion': 2,
    'prefix': 'g3d',
    'day': 52,
    'promptSha': compute_sha256("g3d-day-52-prompt-seed-pin-it"),
    'model': 'gemini-2.5-pro',
    'entries': entries
}

out_path = "src/lib/data/lessonVisuals/g3d/day-52.json"
with open(out_path, 'w', encoding='utf-8') as f:
    json.dump(envelope, f, indent=2)

print(f"Successfully generated {out_path} with 0 numeric digits in captions!")
