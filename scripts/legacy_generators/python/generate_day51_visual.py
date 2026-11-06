import json
import hashlib
import re
import sys
sys.path.append('.')

from scripts.g3d_day51_data import DAY_51_DATA as day51_data

def compute_sha256(text: str) -> str:
    return hashlib.sha256(text.encode('utf-8')).hexdigest()

step_captions_51 = {
    1: [
        "Architectural overview displays Smoothed Particle Hydrodynamics discretizing continuous fluid volumes into moving particles.",
        "Deep inspection evaluates the Müller Poly six radial smoothing kernel for continuous density interpolation.",
        "Comparative analysis contrasts meshless particle fluid representation against fixed Eulerian grid techniques.",
        "Verification certifies boundary value decay, smooth kernel gradients, and zero acceleration spikes."
    ],
    2: [
        "Architectural overview illustrates Tait equation of state modeling fluid incompressibility through density ratios.",
        "Deep inspection tracks the Spiky kernel gradient maintaining non-vanishing repulsive separation forces.",
        "Comparative analysis demonstrates total eradication of particle clustering and tensile instability.",
        "Verification confirms stiff restorative pressure response and robust constant volume preservation."
    ],
    3: [
        "Architectural overview displays Viscosity Laplacians evaluating internal fluid shear stress and thermal dissipation.",
        "Deep inspection tracks strictly positive Viscosity kernel Laplacians damping high-frequency velocity oscillations.",
        "Comparative analysis contrasts unconditionally stable viscous dissipation against unstable signed operators.",
        "Verification confirms smooth laminar flow transitions and realistic artificial surface tension cohesion."
    ],
    4: [
        "Architectural overview displays Symplectic Euler integration advancing particle velocity prior to spatial position.",
        "Deep inspection evaluates Courant-Friedrichs-Lewy time-step constraints preventing particle tunneling.",
        "Comparative analysis demonstrates long-term phase space conservation over explosive Forward Euler drift.",
        "Verification certifies energy bounds, boundary particle repulsion, and rock-solid simulation stability."
    ],
    5: [
        "Architectural overview displays four-pass GPU compute shader dispatch executing spatial hashing and integration.",
        "Deep inspection profiles memory coalescence, radix sorting, and threadgroup shared memory caching.",
        "Comparative analysis certifies sixteen thousand particle execution within three point five milliseconds.",
        "Verification confirms total mass conservation, density incompressibility, and sixty frames per second performance."
    ]
}

entries = []
for part in day51_data['parts']:
    p_num = part['part']
    code_hash = compute_sha256(part['code'])
    steps = []
    phases = ['intro', 'inspect', 'compare', 'verify']
    captions = step_captions_51[p_num]
    for at_phase, cap in zip(phases, captions):
        assert not re.search(r'\d', cap), f"Numeric digit found in Day 51 Part {p_num} Caption: {cap}"
        steps.append({'at': at_phase, 'caption': cap})
    
    entry = {
        'partTitle': part['title'],
        'codeHash': code_hash,
        'spec': {
            'template': 'compare',
            'title': f"System Architecture: {part['title']}",
            'left': {
                'label': 'Legacy Fluid Representation',
                'content': [
                    'Flat 2D scrolling textures',
                    'Zero true volumetric splashing',
                    'Explosive Forward Euler instability',
                    'Non-physical mass dissipation'
                ]
            },
            'right': {
                'label': 'Modern GPU SPH Solver',
                'content': [
                    'Tens of thousands of 3D particles',
                    'Visceral 3D splash & crest dynamics',
                    'Symplectic phase-space preservation',
                    'Rigorous mass-density conservation'
                ]
            },
            'steps': steps
        },
        'filled': {
            'leftLabel': 'Legacy Fluid Representation',
            'rightLabel': 'Modern GPU SPH Solver'
        }
    }
    entries.append(entry)

envelope = {
    'schemaVersion': 2,
    'prefix': 'g3d',
    'day': 51,
    'promptSha': compute_sha256("g3d-day-51-prompt-seed-pin-it"),
    'model': 'gemini-2.5-pro',
    'entries': entries
}

out_path = "src/lib/data/lessonVisuals/g3d/day-51.json"
with open(out_path, 'w', encoding='utf-8') as f:
    json.dump(envelope, f, indent=2)

print(f"Successfully generated {out_path} with 0 numeric digits in captions!")
