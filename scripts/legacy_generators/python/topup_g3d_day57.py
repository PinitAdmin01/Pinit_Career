# scripts/topup_g3d_day57.py
import re

extra = {
    1: [
        "To achieve optimal cluster partitioning during asset ingestion, the virtual geometry pipeline uses METIS K-way graph partitioning. The mesh dual graph—where each face represents a graph node and shared edges represent graph connections—is partitioned into balanced subgraphs of exactly 128 triangles. This mathematical partitioning minimizes the perimeter-to-area ratio of each clusterlet, ensuring that clusters are spatially compact spheres rather than long, skinny ribbons that would degrade bounding box culling efficiency.",
        "Furthermore, every 128-triangle cluster achieves extreme memory compression by quantizing its internal geometry. Instead of storing 32-bit floating point world-space coordinates, the engine encodes vertex positions relative to the cluster's local bounding box minimum extents using 16-bit normalized unsigned integers (UNORM16). This local coordinate quantization halves the vertex buffer memory footprint while guaranteeing sub-millimeter positional precision.",
        "Even more dramatically, triangle index buffers are compressed by four times. In conventional rendering, each triangle index requires a 32-bit integer pointing into a global mesh vertex buffer of millions of vertices. In our 128-triangle cluster architecture, vertices are indexed locally from 0 to 127 using an 8-bit unsigned byte! Storing three 8-bit bytes per triangle reduces index data to just 384 bytes per cluster, enabling entire clusters to stream into GPU L1 cache with near-zero memory bus latency."
    ],
    2: [
        "The underlying mathematical engine for cluster simplification is Garland and Heckbert's Quadric Error Metric (QEM). For every vertex v, the geometric surface error is represented by a symmetric 4x4 quadric matrix Q, computed as the outer product sum of the plane equations of all incident triangles. When an edge between vertex v1 and vertex v2 is collapsed into a single target vertex v_new, their quadric matrices sum together: Q_new = Q1 + Q2. The optimal spatial position for v_new is calculated analytically by solving the linear system formed by the gradient of the quadric error function.",
        "Crucially, to prevent geometric cracking between cluster groups, our offline builder applies boundary locking quadrics. When grouping four adjacent clusters into a parent cluster, any vertex that lies along the exterior perimeter of the group is tagged as locked. We add an artificial quadric penalty with near-infinite weight to perpendicular constraint planes along the exterior perimeter. As a consequence, edge collapses are strictly confined to internal edges within the cluster group; the perimeter boundary vertices never budge by even a single nanometer during simplification!",
        "To ensure mathematically watertight continuous Level-of-Detail transitions, the cluster Directed Acyclic Graph enforces strict Parent-Child Error Monotonicity. The simplification error of any parent cluster node must be strictly greater than or equal to the maximum simplification error of all its descendant child clusters: epsilon_parent >= max(epsilon_children). If a child cluster had an error greater than its parent, the runtime LOD traversal could select both or neither, causing catastrophic visual holes. By enforcing monotonic bounding spheres and error metrics across the entire DAG hierarchy, our virtual geometry engine guarantees that every valid cut across the graph forms a continuous, seamless, closed manifold surface."
    ],
    3: [
        "At runtime, the GPU evaluates the cluster cut using a persistent compute shader dispatch. Rather than issuing thousands of draw calls from the CPU host, the GPU launches a compute grid where each threadgroup evaluates a batch of candidate cluster nodes against the active camera frustum and projected error thresholds.",
        "The projected pixel error rho is evaluated using perspective projection geometry: rho equals the cluster metric error epsilon multiplied by the viewport height in pixels, divided by twice the camera distance d times the tangent of half the vertical field of view angle. If rho is less than or equal to our visual perceptual threshold tau (typically 1.0 pixel), the cluster's geometric simplification is imperceptible to human vision on the display screen.",
        "The fundamental cut selection rule operates with surgical mathematical precision: a cluster DAG node is selected for rendering if and only if its own projected error is less than or equal to 1.0 pixel AND its parent cluster's projected error is strictly greater than 1.0 pixel! This elegant dual-inequality cut criterion guarantees that exactly one cluster is chosen along every branch of the Directed Acyclic Graph. There are zero duplicate overlapping triangles, zero missing surface gaps, and zero multi-sampling artifacts across the entire scene."
    ],
    4: [
        "To understand why sub-pixel triangles are fatal to conventional GPUs, we must examine the physical architecture of fixed-function hardware rasterizers. Desktop GPUs rasterize geometry in rigid 2x2 fragment stamps called Quads. These 2x2 quads are mandatory for computing screen-space partial derivatives (ddx and ddy) required for texture mipmap selection and anisotropic filtering.",
        "When a large triangle spans hundreds of pixels, the 2x2 quads fill almost entirely with valid pixels, achieving 90% to 100% hardware lane efficiency. However, when a micro-triangle covers only a single pixel or a fraction of a pixel, the GPU is still forced to dispatch an entire 2x2 quad! Three out of the four pixel execution lanes are masked off as dead helper lanes. On scenes with hundreds of millions of micro-triangles, hardware rasterizer efficiency plummets below 10%, wasting over 90% of arithmetic and memory bandwidth on dead threads!",
        "Our software compute rasterizer eliminates this bottleneck completely. By organizing the screen into 64x64 pixel compute tiles processed directly inside GPU Threadgroup Shared Memory (LDS), 256 SIMD threads test 128 micro-triangles in parallel against tile bounds. Using fixed-point 16.16 sub-pixel edge equations, compute threads rasterize triangle coverage directly into shared memory without 2x2 quad stamps. Depth testing and visibility writes are executed using atomic 64-bit unsigned integer operations (atomicMax), achieving 100% compute lane utilization and rendering sub-pixel geometry over three times faster than dedicated hardware rasterizer units."
    ],
    5: [
        "The architectural centerpiece of the virtual geometry pipeline is the Visibility Buffer (VisBuffer). Traditional deferred rendering engines output massive G-Buffers with five or six 128-bit render targets: diffuse albedo, world-space normals, roughness, metallic, subsurface scattering masks, and motion vectors. In scenes with dense geometry and high depth complexity, writing and reading these multi-layered G-Buffers consumes tens of gigabytes per second of precious memory bus bandwidth.",
        "In stark contrast, our virtual geometry VisBuffer writes only a single 32-bit unsigned integer per pixel: 16 bits for the Meshlet/Cluster ID and 16 bits for the Triangle Primitive ID within the cluster! Depth is written to a standard 32-bit floating-point depth buffer. This reduces geometric pass memory bandwidth consumption by over 80%.",
        "In the subsequent deferred material evaluation pass, the engine screens the compact 32-bit VisBuffer. Using screen-space compute classification, the engine groups adjacent pixels by Material ID, fetches the 128-triangle cluster's quantized vertex data from GPU buffers, reconstructs the barycentric coordinates (u, v, w) directly from pixel screen coordinates, and evaluates complex PBR shading equations exactly once per visible surface pixel! Overdraw is completely eradicated. Combined with our sub-millisecond cluster cut traversal, virtual geometry delivers cinematic photorealism with millions of smooth, popping-free triangles running comfortably within a 16.6ms 60 FPS frame budget."
    ]
}

with open('scripts/create_g3d_day57_data.py', 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
current_part = 1
for line in lines:
    if line.strip().startswith('say_p'):
        m = re.match(r'say_p(\d)', line.strip())
        if m:
            current_part = int(m.group(1))
    if 'In the TypeScript snippet below' in line and current_part in extra:
        for p in extra[current_part]:
            new_lines.append(f'    "{p}",\n')
        del extra[current_part]
    new_lines.append(line)

with open('scripts/create_g3d_day57_data.py', 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print("Updated create_g3d_day57_data.py with all extras!")
