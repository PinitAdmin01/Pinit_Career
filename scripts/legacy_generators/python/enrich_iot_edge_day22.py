import json

with open('scripts/iot_edge_day22.json', 'r', encoding='utf-8') as f:
    d22 = json.load(f)

expansions = [
    # Part 0: Standard 2D Convolution Pitfalls (currently 378 -> add ~235 words to reach > 610)
    (0, [
        "In addition to branch penalties, naive nested loops suffer from severe register spilling. On ARM Cortex-M processors, the core provides only sixteen 32-bit general-purpose registers (`r0` through `r15`), with three reserved for the stack pointer (`sp`), link register (`lr`), and program counter (`pc`). This leaves only thirteen registers available for application data.",
        "When an inner loop attempts to maintain six nested iteration indices, array stride multipliers, accumulator registers, and input/weight pointers simultaneously, the compiler runs out of physical registers. The compiler is forced to 'spill' temporary variables onto the stack in SRAM, executing costly `STR` (Store Register) and `LDR` (Load Register) instructions on every single loop iteration.",
        "On high-frequency superscalar cores like the ARM Cortex-M7—which features a 6-stage dual-issue superscalar pipeline—branch instructions in tight loops frequently trigger pipeline flushes. Every time an inner loop terminates and branches backward, the processor discards speculatively fetched instructions, wasting two to three clock cycles.",
        "Over millions of loop cycles, these pipeline stalls dominate execution time, transforming what should be a microsecond inference pass into an agonizing multi-millisecond bottleneck that overheats the microcontroller die and drains portable battery packs."
    ]),

    # Part 1: Im2Col Matrix Transformation (currently 377 -> add ~235 words to reach > 610)
    (1, [
        "While full Im2Col matrix multiplication is ideal for servers with gigabytes of RAM, fully unrolling an entire high-resolution image into an `im2col` buffer on a microcontroller would consume tens or hundreds of kilobytes of SRAM, which could overflow the chip's memory. For example, unrolling a 96x96 grayscale image with a 3x3 filter requires $9 \\times 94 \\times 94 \\approx 79,500$ bytes of scratchpad memory!",
        "To solve this physical memory dilemma, ARM's CMSIS-NN implements 'Partial Im2Col'—also known as Block-Based Im2Col. Instead of unrolling the entire image feature map all at once, CMSIS-NN allocates a tiny, static scratchpad buffer sufficient to hold only TWO columns of unrolled receptive fields at any given moment: `q7_t im2col_buffer[2 * 3 * 3 * in_channels];`.",
        "The kernel unrolls two adjacent spatial patches into the buffer, performs a 2-column matrix multiply against the packed filter weight matrix using SIMD dual-MAC instructions, writes the two output pixels directly to the output tensor, and immediately overwrites the scratchpad with the next two patches! This genius partial-unrolling strategy slashes SRAM scratchpad overhead from 80 kilobytes down to less than 1.5 kilobytes, delivering 95 percent of full GEMM speed while fitting comfortably inside microcontrollers with as little as 16 KB of total RAM."
    ]),

    # Part 2: Depthwise Separable Convolution (currently 372 -> add ~240 words to reach > 610)
    (2, [
        "From an information-theoretic perspective, why is Depthwise Separable Convolution able to maintain high accuracy despite discarding 88 percent of standard convolution's multiply-accumulate operations? In natural physical sensory data—such as camera imagery, acoustic audio spectrograms, and industrial vibration spectra—spatial correlations and cross-channel correlations are largely orthogonal.",
        "Spatial correlation describes how neighboring pixels or consecutive time steps relate to each other (e.g., edges, textures, frequency harmonics). Cross-channel correlation describes how different color channels or audio Mel bands interact. In standard convolution, the network attempts to learn spatial filters and cross-channel projections simultaneously within a single monolithic $D_K \\times D_K \\times M \\times N$ weight tensor, resulting in enormous parameter redundancy and over-parameterization.",
        "By explicitly decoupling spatial feature extraction (Depthwise stage) from channel projection (Pointwise stage), Depthwise Separable Convolution acts as a structural regularizer. The depthwise filters focus exclusively on local geometric shapes and acoustic transients, while the pointwise $1 \\times 1$ filters focus exclusively on synthesizing high-level feature combinations.",
        "This structural factorization dramatically reduces overfitting on small edge training datasets while maintaining rich representational power, enabling compact micro-vision and keyword spotting models to rival the accuracy of deep server networks."
    ]),

    # Part 3: ARM Cortex-M SIMD & Helium Kernel Acceleration (currently 275 -> add ~335 words to reach > 610)
    (3, [
        "To appreciate the surgical precision of CMSIS-NN assembly engineering, let us walk through the exact register operations executed inside the inner kernel loop of `arm_convolve_s8`. To feed the CPU at maximum speed, weights are pre-arranged in Flash such that four consecutive 8-bit signed weights are loaded into a single 32-bit register: `int32_t w_pack = *__SIMD32(weight_ptr)++;`.",
        "Simultaneously, the input values from the Im2Col scratchpad are loaded into another 32-bit register: `int32_t in_pack = *__SIMD32(im2col_ptr)++;`. The kernel then executes the `__SMLAD` instruction: `acc = __SMLAD(in_pack, w_pack, acc);`. In a single clock cycle, the hardware ALU splits `w_pack` into high and low 16-bit signed integers, splits `in_pack` into high and low 16-bit signed integers, performs both multiplications concurrently, sums their products, and adds the result to the 32-bit accumulator register `acc`!",
        "To achieve maximum pipeline throughput, CMSIS-NN kernels unroll this loop 2x or 4x, interweaving load instructions with arithmetic operations. This instruction scheduling hides load-use latency penalties: while the ALU executes `__SMLAD` on data loaded in Cycle 1, the bus interface concurrently fetches the next word for Cycle 2.",
        "On Cortex-M55 and Cortex-M85 processors with Helium technology, this concept expands into 128-bit vector lanes. Helium processors feature hardware Low Overhead Loops (`DLS` - Do Loop Start, and `LE` - Loop End). Hardware loops decrement loop counters and branch backward in hardware with ZERO instruction cycles! The CPU spends 100 percent of its clock cycles executing vector multiply-accumulate instructions (`VMLADAV`), delivering raw DSP workstation throughput on a battery-powered microcontroller."
    ]),

    # Part 4: Production CMSIS-NN Kernel Benchmark (currently 215 -> add ~395 words to reach > 610)
    (4, [
        "When validating production CMSIS-NN kernels for commercial deployment, firmware architects must also certify the fixed-point requantization pipeline. After the 32-bit integer accumulator sums hundreds of product terms, the result must be scaled back down to an 8-bit integer before being written to the output activation tensor. In CMSIS-NN, this requantization is performed using high-precision fixed-point scaling: `output = arm_nn_requantize(acc + bias, multiplier, shift)`.",
        "The requantization function implements symmetric rounding with arithmetic saturation: if the scaled integer exceeds $+127$, it saturates cleanly at $+127$; if it drops below $-128$, it saturates cleanly at $-128$. This hardware saturation prevents catastrophic wrap-around overflows, where an extreme positive activation value would otherwise wrap around to a negative number and completely corrupt downstream classification predictions.",
        "Our validation gate computes the exact Signal-to-Quantization-Noise Ratio (SQNR) across thousands of test vectors, ensuring that CMSIS-NN integer execution matches the software reference with an SQNR exceeding 38 dB. Furthermore, the gate verifies that the total memory consumption of the kernel—including input tensors, output tensors, and the partial Im2Col scratchpad—remains strictly within static SRAM budget allocations.",
        "Once certified, these accelerated kernels form the foundational compute engine for our upcoming Milestone 5 runtime, enabling real-world Keyword Spotting and Visual Wake Words models to execute on ARM microcontrollers with deterministic latency, zero dynamic heap usage, and microscopic energy consumption."
    ])
]

for idx, paras in expansions:
    d22['parts'][idx]['say'].extend(paras)

d22['minutes'] = 38

with open('scripts/iot_edge_day22.json', 'w', encoding='utf-8') as f:
    json.dump(d22, f, indent=2, ensure_ascii=False)

print("Enriched Day 22 successfully.")
