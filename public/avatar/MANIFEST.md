# 3D Avatar Asset Manifest & Persona Rig Mapping

## Architecture Overview
The 3D avatars in PinIT Career OS are built on the **VRoid standard 3D humanoid rig specification** (`.glb` binary glTF format), featuring skeletal armatures, blendshape facial expressions (visemes, blink, look-at), and PBR material shaders compatible with Three.js.

To ensure fast asset caching and optimal resource delivery across high-concurrency campus lab environments, the system utilizes **16 unique base humanoid archetype meshes** (`avatarsample_c` through `avatarsample_x` / canonical archetypes). Named mentor personas are mapped directly to these underlying character archetypes:

## Archetype Rig Mapping Table

| Archetype Hash (SHA-256) | Base Rig Model | Mentor / Persona Aliases | Presentation Role |
|:---|:---|:---|:---|
| `f6d1d9c50472` | `avatarsample_u.glb` | `priya.glb`, `mentor.glb` | Lead SDE Career Mentor (Female — Platform Mentor Only) |
| `aa333ff8f693` | `avatarsample_c.glb` | `anish.glb` | Full Stack & Systems Mentor (Male) |
| `713646d5fe14` | `avatarsample_r.glb` | `kashyap.glb` | DSA & Competitive Programming Faculty (Male) |
| `0c4ae8e7ce4e` | `akira.glb` | `karthic.glb` | Cloud Infrastructure & DevOps Faculty (Male) |
| `be6dba62af45` | `yuki.glb` | `divya.glb` | Data Science & Product Analytics Mentor (Female) |
| `9d21759e067e` | `avatarsample_x.glb` | `vikram.glb` | Senior Technical Director / System Architect (Male) |
| `8a656d64c0ee` | `mika.glb` | `aditya.glb` | Applied Tech & Engineering (Male) |
| `99462e90f3c8` | `avatarsample_v.glb` | `rohan.glb` | Senior Technical & Applied Evaluator (Male) |
| `98ff247f0c3f` | `avatarsample_j.glb` | `sneha.glb` | HR & Talent Acquisition Director (Female) |
| `0974ff0e9922` | HD Full Mesh | `aisha.glb` | Executive STAR & Case Evaluator (Female) |
| `77cb48651701` | HD Full Mesh | `neha.glb`, `shalini.glb` | HR & Assessment Evaluators (Female) |
| `ba854a9dc8fd` | `avatarsample_m.glb` | *(Female Alice-Dress Archetype)* | Never assign to male personas (`rohan`/`vikram`/`kashyap`/`anish`) |
| `47ec2a2fded8` | HD Full Mesh | `rajesh.glb`, `abhijit.glb`, `maya.glb` | Specialist Faculty / Mentors |
| `740303031baf` | Draco Standalone | `hana.glb`, `kaito.glb`, `rei.glb`, `riku.glb`, `sora.glb`, `avatarsample_i.glb` | Auxiliary Compact Archetype Rigs |

## Viseme & Animation Compatibility
All 16 archetype models share identical morph target dictionaries:
- `v_aa`, `v_ih`, `v_ou`, `v_e`, `v_oh` (viseme mouth shapes for real-time lip-sync)
- `blink`, `blink_l`, `blink_r` (procedural natural blinking)
- `neutral`, `happy`, `angry`, `sorrow`, `fun` (facial emotional expressions)
- `mixamorig:*` standard humanoid skeletal bone hierarchy
