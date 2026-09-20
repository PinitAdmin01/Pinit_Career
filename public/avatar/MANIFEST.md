# 3D Avatar Asset Manifest & Persona Rig Mapping

## Architecture Overview
The 3D avatars in PinIT Career OS are built on the **VRoid standard 3D humanoid rig specification** (`.glb` binary glTF format), featuring skeletal armatures, blendshape facial expressions (visemes, blink, look-at), and PBR material shaders compatible with Three.js.

To ensure fast asset caching and optimal resource delivery across high-concurrency campus lab environments, the system utilizes **16 unique base humanoid archetype meshes** (`avatarsample_c` through `avatarsample_x` / canonical archetypes). Named mentor personas are mapped directly to these underlying character archetypes:

## Archetype Rig Mapping Table

| Archetype Hash (SHA-256) | Base Rig Model | Mentor / Persona Aliases | Presentation Role |
|:---|:---|:---|:---|
| `f6d1d9c50472` | `avatarsample_u.glb` | `priya.glb`, `mentor.glb` | Lead SDE Career Mentor (Female) |
| `aa333ff8f693` | `avatarsample_c.glb` | `anish.glb` | Full Stack & Systems Mentor (Male) |
| `713646d5fe14` | `avatarsample_m.glb` | `kashyap.glb` | DSA & Competitive Programming Faculty (Male) |
| `0c4ae8e7ce4e` | `avatarsample_r.glb` | `karthic.glb` | Cloud Infrastructure & DevOps Faculty (Male) |
| `0974ff0e9922` | `avatarsample_v.glb` | `maya.glb` | AI / ML Research Mentor (Female) |
| `be6dba62af45` | `avatarsample_x.glb` | `divya.glb` | Data Science & Product Analytics Mentor (Female) |
| `9d21759e067e` | Archetype Executive M | `vikram.glb`, `abhijit.glb`, `kaito.glb` | Senior Technical Director / System Architect |
| `8a656d64c0ee` | Archetype Engineer M | `aditya.glb`, `sora.glb` | Behavioral & Technical Bar Raiser (Male) |
| `47ec2a2fded8` | Archetype Product F | `neha.glb`, `shalini.glb`, `rei.glb` | HR & Product Management Interviewer (Female) |
| `740303031baf` | Archetype Specialist M | `rajesh.glb`, `riku.glb` | Senior Quantitative & Backend Specialist (Male) |
| `98ff247f0c3f` | Archetype Specialist F | `sneha.glb`, `hana.glb` | Frontend Architecture & UI/UX Specialist (Female) |
| `99462e90f3c8` | `avatarsample_j.glb` | `rohan.glb` | Systems Engineering & OS Mentor (Male) |
| `77cb48651701` | `avatarsample_i.glb` | `aisha.glb` | Emerging Technologies Advisor (Female) |
| `f32a28834aee` | Archetype Youth M | `akira.glb` | Peer SDE Candidate Model |
| `6590ce29bda0` | Archetype Youth F | `mika.glb` | Peer SDE Candidate Model |
| `ba854a9dc8fd` | Archetype Senior F | `yuki.glb` | Academic Research Counselor (Female) |

## Viseme & Animation Compatibility
All 16 archetype models share identical morph target dictionaries:
- `v_aa`, `v_ih`, `v_ou`, `v_e`, `v_oh` (viseme mouth shapes for real-time lip-sync)
- `blink`, `blink_l`, `blink_r` (procedural natural blinking)
- `neutral`, `happy`, `angry`, `sorrow`, `fun` (facial emotional expressions)
- `mixamorig:*` standard humanoid skeletal bone hierarchy
