with open('scripts/create_g3d_day56_data.py', 'r', encoding='utf-8') as f:
    text = f.read()

s4 = ' This indirect architecture decouples scene complexity entirely from CPU driver overhead, allowing modern open-world graphics engines to feed massive geometric workloads directly into modern GPU pipelines with zero host bottlenecks.'

s5 = ' Engineers can continuously inspect live culling statistics in the profiler overlay, verifying visible mesh counts, culled instance percentages, and Hi-Z depth downsampling latency in real time. This automated diagnostic feedback loop enables technical artists and graphics programmers to rapidly pinpoint rogue occluder meshes, optimize bounding volume hierarchies, and certify that complex gameplay levels maintain uncompromising 60 FPS frame rates under extreme action sequences.'

text = text.replace(
    'Notice how the compactor packs four visible meshes into a dense command buffer with zero memory holes, confirming optimal stream compaction. We now benchmark the complete occlusion culling pipeline.',
    s4 + ' Notice how the compactor packs four visible meshes into a dense command buffer with zero memory holes, confirming optimal stream compaction. We now benchmark the complete occlusion culling pipeline.'
)

text = text.replace(
    'Notice how the audit certifies 72% culling efficiency with only 0.62ms overhead across 10,000 meshes, safely confirming production compliance. Tomorrow, in Day 57, we explore Virtual Geometry and Continuous Mesh Level-of-Detail (Nanite-Style Cluster DAGs)!',
    s5 + ' Notice how the audit certifies 72% culling efficiency with only 0.62ms overhead across 10,000 meshes, safely confirming production compliance. Tomorrow, in Day 57, we explore Virtual Geometry and Continuous Mesh Level-of-Detail (Nanite-Style Cluster DAGs)!'
)

with open('scripts/create_g3d_day56_data.py', 'w', encoding='utf-8') as f:
    f.write(text)

print('Updated Day 56 Part 4 and Part 5 successfully.')
