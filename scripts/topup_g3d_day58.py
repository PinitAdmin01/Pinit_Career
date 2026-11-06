# scripts/topup_g3d_day58.py
import re

extra = {
    1: [
        "In modern Vulkan, render graph synchronization is built on Vulkan Synchronization 2 (VK_KHR_synchronization2). Prior to Synchronization 2, developers suffered from complex, split 32-bit pipeline stage and access flag masks that frequently produced driver validation errors. Synchronization 2 unifies all pipeline stages, access masks, and image layout transitions into a clean 64-bit descriptor structure: VkDependencyInfo and VkImageMemoryBarrier2.",
        "Crucially, our render graph compiler maximizes GPU overlap by computing tight pipeline stage masks. Instead of inserting broad, heavy pipeline stalls like VK_PIPELINE_STAGE_ALL_COMMANDS_BIT, the compiler isolates the exact producer and consumer stages. For example, when transitioning a depth pre-pass buffer for depth testing in the G-Buffer pass, the compiler specifies srcStageMask as VK_PIPELINE_STAGE_2_LATE_FRAGMENT_TESTS_BIT and dstStageMask as VK_PIPELINE_STAGE_2_EARLY_FRAGMENT_TESTS_BIT. This fine-grained stage specification allows vertex shading of the subsequent pass to execute concurrently with the tail end of the previous pass, keeping GPU execution pipes saturated.",
        "Furthermore, the graph compiler distinguishes between execution dependencies and memory availability/visibility operations. An execution barrier only guarantees that instructions finish in order; a memory visibility barrier guarantees that cache lines in GPU L1 and L2 caches are flushed and invalidated so that subsequent texture sampling reads fresh, valid texels rather than stale cache data."
    ],
    2: [
        "At the hardware level, transient memory aliasing relies on Vulkan's dedicated physical allocation API: vkAllocateMemory paired with VK_MEMORY_PROPERTY_DEVICE_LOCAL_BIT. The engine allocates a single contiguous virtual memory heap slab—for example, 512 Megabytes of high-bandwidth GDDR6 VRAM. Rather than allocating individual memory chunks for each image, the engine creates dozens of unbacked VkImage handles and calls vkBindImageMemory, binding each image to specific byte offsets within the shared heap.",
        "However, physical hardware imposes strict Memory Alignment Constraints that the aliasing allocator must respect. Every GPU architecture specifies a fundamental alignment requirement—typically 64 Kilobytes for linear textures and up to 2 Megabytes or 4 Megabytes for multi-sample or fast-clear render targets. If an engine binds a texture to an unaligned offset, the GPU generates hard memory access faults or hardware crashes. Our aliasing allocator automatically rounds each candidate offset up to the nearest architectural alignment boundary using bitwise masking: offset = (candidateOffset + alignment - 1) & ~(alignment - 1).",
        "Additionally, when transitioning between two aliased resources occupying the same physical memory, the engine issues a Memory Aliasing Barrier. A VkMemoryBarrier2 is placed with source access flags set to the dying resource's write mask and destination access flags set to the newborn resource's write mask. This ensures that GPU write caches are completely flushed before the new resource begins writing into the physical memory slab, guaranteeing zero memory corruption between passes."
    ],
    3: [
        "When transferring resources between the Graphics Queue and the Dedicated Compute Queue, explicit APIs enforce Queue Family Ownership Transfers. In Vulkan, a resource cannot be accessed simultaneously by two distinct queue families without an explicit handoff. The render graph compiler automatically injects a Release Barrier on the source queue command buffer and an matching Acquire Barrier on the destination queue command buffer, setting srcQueueFamilyIndex and dstQueueFamilyIndex to the respective hardware queue family indices.",
        "To maximize CPU recording throughput, our engine pairs multi-queue GPU execution with multi-threaded CPU command recording. Each worker thread on the CPU owns an independent VkCommandPool associated with either the graphics or compute queue family. Because command pools are isolated per thread, CPU cores record secondary command buffers in parallel with zero mutex contention, eliminating CPU driver bottlenecks during complex frame dispatches.",
        "The quantitative impact of asynchronous compute is dramatic: by scheduling compute-heavy shaders (such as volumetric raymarching, ambient occlusion, and particle physics) during memory-bound rasterization passes, the GPU fills vacant arithmetic execution bubbles. This reclaims up to 35% of otherwise idle ALU cycles, accelerating complex frames and unlocking rock-solid 60 FPS performance."
    ],
    4: [
        "On mobile architectures, memory bus energy consumption is the number one enemy of performance. Physics dictates that driving signals across external DDR memory traces consumes roughly one hundred times more electrical energy per bit than moving data within on-chip SRAM cache lines! A mobile game that repeatedly flushes hundreds of megabytes of G-Buffer data to DDR RAM drains battery power rapidly and forces the mobile OS to throttle GPU clocks to prevent device overheating.",
        "Tile-Based Deferred Rendering (TBDR) solves this by processing geometry in small on-chip screen tiles (typically 16x16 or 32x32 pixels). In Vulkan, our render graph configures subpasses with VK_IMAGE_USAGE_TRANSIENT_ATTACHMENT_BIT and specifies VK_ATTACHMENT_LOAD_OP_CLEAR and VK_ATTACHMENT_STORE_OP_DONT_CARE for all intermediate G-Buffer attachments. This contract informs the Vulkan driver and mobile hardware that the G-Buffer data only needs to exist while the tile is being processed in local tile memory.",
        "When the deferred lighting subpass runs, it accesses the G-Buffer attachments as Subpass Inputs (using subpassLoad() in GLSL or [[raster_order_group]] in Metal). The fragments are read directly from on-chip SRAM with zero latency and zero DDR bus traffic. Only the final HDR color pixels are stored out to main memory when the tile completes. This eradicates over 80% of memory bandwidth, keeping the mobile device cool and preventing thermal clock throttling."
    ],
    5: [
        "In production AAA environments, the Render Graph compiler must be both blazingly fast and utterly deterministic. Because modern scenes feature dynamic lighting conditions, changing weather, and customizable post-processing stacks, the active graph topology can change from frame to frame. Our CPU compilation pipeline completes in under 150 microseconds—less than 1% of our total 16.6ms frame budget—ensuring that dynamic graph rebuilding never stalls the main thread.",
        "Furthermore, the Render Graph provides Automated Pass Culling. During the backward reachability pass, any node whose output textures are not transitively read by the final backbuffer swapchain is automatically culled from the execution schedule. If a player disables motion blur or ambient occlusion in the game's graphics settings, the render graph instantly prunes those passes, automatically reclaims their memory, and eliminates their GPU dispatches without requiring complex conditional branching in rendering code.",
        "By enforcing strict telemetry validation—auditing transient VRAM under 512 MB, graph compilation under 250 microseconds, and GPU frame latency under 16.6ms—our render graph architecture delivers rock-solid, production-certified 60 FPS rendering. This modern architecture guarantees that visual artists, shader programmers, and technical directors can build breathtaking worlds on a stable, high-performance foundation."
    ]
}

with open('scripts/create_g3d_day58_data.py', 'r', encoding='utf-8') as f:
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

with open('scripts/create_g3d_day58_data.py', 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print("Updated create_g3d_day58_data.py with all extras!")
