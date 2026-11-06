import json
import scripts.create_g3d_day50_data as s50

parts_fixed = []
for p in s50.parts:
    parts_fixed.append({
        'part': p['part'],
        'title': p['title'],
        'say': p['say'],
        'example': f"Evaluate and verify Stage {p['part']} implementation in TypeScript.",
        'code': p.get('code') or p.get('rawCode'),
        'output': p.get('output') or p.get('terminalOutput'),
        'check': p['check']
    })

day50_fixed = {
    'day': 50,
    'coursePrefix': 'g3d',
    'title': 'Milestone 10 Capstone: Photorealistic Multi-Layered Material & Volumetric Atmospheric Rendering Engine',
    'goal': 'Integrate screen-space subsurface scattering, thin-film wave interference, anisotropic hair fiber shading, and volumetric cloudscapes into a unified photorealistic engine certified by a 5-gate defense matrix at 60 FPS.',
    'recap': 'Recap of Day 49: Rayleigh and Mie atmospheric scattering, procedural 3D Perlin-Worley noise, volumetric ray marching, the Powder Effect, and quarter-resolution temporal bilateral upscaling.',
    'minutes': 60,
    'parts': parts_fixed,
    'projectStep': 'Engineer the Milestone 10 Capstone unifying multi-layered organic materials and real-time volumetric sky ray marching into an AAA-grade rendering pipeline locked at 60 FPS.',
    'summary': 'Successfully designed, integrated, and benchmarked the Milestone 10 Capstone, uniting separable SSS skin diffusion, thin-film iridescent coatings, Marschner hair anisotropy, and ray-marched volumetric cloudscapes under an automated 5-gate quality matrix achieving 72.2 FPS telemetry.'
}

with open('scripts/g3d_day50_data.py', 'w', encoding='utf-8') as f:
    f.write('# G3D Day 50 Data\n')
    f.write('DAY_50_DATA = ' + json.dumps(day50_fixed, indent=2) + '\n')
    f.write('day50_lesson = DAY_50_DATA\n')

print('Successfully updated scripts/g3d_day50_data.py with standardized DAY_50_DATA!')
