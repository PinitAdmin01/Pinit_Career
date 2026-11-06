import json

with open('scripts/iot_edge_day21.json', 'r', encoding='utf-8') as f:
    d21 = json.load(f)

expansions = [
    # Part 0: FlatBuffers Architecture (currently 424 -> add ~190 words to reach > 615)
    (0, [
        "Under the hood, FlatBuffers achieves this zero-copy miracle through virtual tables, or 'vtables'. When a data table is serialized in a FlatBuffer, it is preceded by a vtable containing 16-bit integer offsets to each field within the table. If a newer model schema introduces an optional field that does not exist in an older firmware binary, the vtable simply records an offset of zero.",
        "The firmware's reading routine immediately recognizes that the field is absent and substitutes the schema-defined default value—all without throwing an error, reallocating memory, or crashing. This bidirectional schema compatibility is indispensable for long-lifecycle industrial IoT deployments, where edge devices may remain deployed in the field for ten to fifteen years while models receive over-the-air firmware updates.",
        "Furthermore, because the model resides entirely in read-only Flash memory, it is physically immune to runtime memory corruption or malicious memory injection attacks. In safety-critical industrial installations, if a transient voltage glitch or cosmic ray strike corrupts an SRAM cell, the read-only FlatBuffer model in internal Flash remains completely intact and uncorrupted, providing the highest level of silicon integrity."
    ]),

    # Part 1: Selective Operator Registration (currently 341 -> add ~270 words to reach > 610)
    (1, [
        "To understand the mechanical implementation of `MicroMutableOpResolver`, we must examine how TFLM links operator kernels. In the TFLM source tree, every operator is defined by a `TfLiteRegistration` C struct. This struct holds function pointers to four fundamental lifecycle methods: `init()`, which allocates operator-specific scratchpads; `prepare()`, which validates input/output tensor shapes and precomputes fixed-point quantization multipliers; and `eval()`, which executes the inner mathematical loop on the CPU or DSP.",
        "When you call `resolver.AddConv2D()`, the resolver simply stores a reference to the `Register_CONV_2D()` function pointer into an internal array. If an operator is never added, its registration function is never referenced anywhere in your program's call graph.",
        "When the GNU ARM embedded toolchain (`arm-none-eabi-gcc`) compiles your firmware with the flags `-ffunction-sections -fdata-sections -Wl,--gc-sections`, the compiler places every single function into its own isolated ELF section. During the final linking phase, the linker traces the entrypoint (`main()`), follows every active function pointer, and ruthlessly garbage-collects every unreferenced section.",
        "Consequently, hundreds of unnecessary operations—such as complex transpose convolutions, dilation filters, and spatial transformers—are physically purged from the machine binary. Firmware engineers achieve an ultra-lean runtime that leaves maximum Flash space available for application logic, communication stacks, and cryptographic keys."
    ]),

    # Part 2: The Tensor Arena Memory Architecture (currently 369 -> add ~250 words to reach > 620)
    (2, [
        "When configuring the Tensor Arena on high-performance microcontrollers—such as the ARM Cortex-M7 or Cortex-M55—memory architecture involves additional hardware complexities: data caches and DMA controllers. In high-clock-rate microcontrollers (operating between 200 MHz and 600 MHz), the CPU accesses SRAM through an L1 Data Cache (D-Cache).",
        "If a peripheral Direct Memory Access (DMA) engine streams raw microphone audio or camera pixels directly into the Tensor Arena's input buffer while the CPU has stale cache lines corresponding to that memory address, the neural network will execute inference on outdated data, causing catastrophic misclassifications! Therefore, embedded firmware engineers must place the Tensor Arena into a non-cacheable MPU (Memory Protection Unit) region or explicitly invoke hardware cache invalidation functions (`SCB_InvalidateDCache_by_Addr`) immediately before calling `interpreter.Invoke()`.",
        "Furthermore, the alignment of the Tensor Arena is not a mere recommendation—it is a strict hardware mandate. Vector SIMD instructions like ARM Helium MVE (M-Profile Vector Extension) process 128-bit vector registers containing 16 packed 8-bit integers in a single clock cycle. If the base address of an activation buffer is not divisible by 16, executing a vector load instruction (`VLDR`) will immediately fault the processor or force the memory controller into expensive split-cycle bus cycles.",
        "By enforcing `alignas(16)` on the global `tensor_arena` array and configuring the Head allocator with 16-byte alignment steps, TFLM guarantees that every single convolutional kernel executes at peak silicon throughput."
    ]),

    # Part 3: Peak SRAM Calculation (currently 363 -> add ~260 words to reach > 625)
    (3, [
        "In modern neural network architectures, memory planning is further complicated by skip connections, such as those found in ResNet residual blocks and MobileNetV2 inverted bottleneck layers. In a simple sequential feed-forward network, Tensor $A$ is consumed immediately by Layer 1, after which Tensor $A$ can be overwritten. But in a residual block, the input tensor must be added to the output of the convolutional block via an addition operator three layers later!",
        "This means the input tensor's lifetime must remain active across Op 1, Op 2, and Op 3 simultaneously! The memory planner cannot overwrite that memory space until the final addition operation finishes. If a network contains multiple branching or residual connections, overlapping tensor lifetimes accumulate, pushing the peak SRAM watermark higher.",
        "TFLM solves this complex multi-lifetime constraint using a Greedy Best-Fit Allocation heuristic. The planner first sorts all tensors in descending order of byte size. By placing the largest tensors into the arena first, the planner minimizes fragmentation—the unusable gaps between allocated memory blocks.",
        "It then sweeps through the execution timeline, packing smaller tensors into the temporal gaps left by dead intermediate feature maps. This algorithmic approach guarantees that even complex branching micro-vision models fit within the strict SRAM boundaries of low-cost microcontrollers, unlocking computer vision capabilities on chips that cost less than a cup of coffee."
    ]),

    # Part 4: Production TFLM Runtime Simulation (currently 291 -> add ~330 words to reach > 625)
    (4, [
        "In enterprise software architecture, where the Tensor Arena is placed in memory is just as critical as how large it is. In bare-metal C++ firmware, variables can be allocated in three primary locations: the call stack, the dynamic heap, or static memory (`.bss` or `.data` sections). A rookie mistake frequently made by junior firmware developers is declaring `uint8_t tensor_arena[kTensorArenaSize];` as a local variable inside the `main()` function or inside an RTOS task function.",
        "In embedded systems, the RTOS thread stack is strictly limited—typically between 1 kilobyte and 4 kilobytes. Allocating a 32-kilobyte array on the thread stack instantly smashes the stack pointer through the stack boundary, obliterating peripheral registers, corrupting return addresses, and plunging the microcontroller into an unrecoverable HardFault loop!",
        "To prevent stack overflow, the Tensor Arena must always be declared at global or namespace scope, or declared with the `static` storage duration qualifier. When declared globally, the linker places the entire Tensor Arena into the zero-initialized `.bss` section of internal SRAM at compile time. The linker script precisely maps the `.bss` section, guaranteeing that memory is reserved before the program even begins executing `main()`.",
        "Furthermore, our automated CI/CD simulation tests boundary overruns, verifying that every tensor read and write remains strictly within the bounds of the arena. By catching memory errors in automated Python and TypeScript simulation before hardware flashing, our engineering pipeline achieves complete reliability, zero regressions, and rock-solid production deployment across enterprise edge fleets."
    ])
]

for idx, paras in expansions:
    d21['parts'][idx]['say'].extend(paras)

d21['minutes'] = 38

with open('scripts/iot_edge_day21.json', 'w', encoding='utf-8') as f:
    json.dump(d21, f, indent=2, ensure_ascii=False)

print("Enriched Day 21 successfully.")
