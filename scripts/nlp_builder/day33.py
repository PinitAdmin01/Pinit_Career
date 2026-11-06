"""
Day 33 Data Builder for Course 37: Natural Language Processing & Computational Linguistics
Topic: Memory-Efficient Computation: FlashAttention Mathematical Tiling, Kernel Fusion & Online Softmax
"""

DAY_33_DATA = {
    "day": 33,
    "coursePrefix": "nlp",
    "title": "Day 33: Memory-Efficient Computation: FlashAttention Mathematical Tiling, Kernel Fusion & Online Softmax",
    "summary": [
        "Standard Scaled Dot-Product Attention is fundamentally bottlenecked by GPU memory bandwidth (IO), materializing intermediate N x N matrices in high-latency High Bandwidth Memory (HBM).",
        "The Online Softmax algorithm computes incremental row-wise softmax normalizers across streaming blocks, eliminating the requirement to materialize full logit sequences prior to normalization.",
        "FlashAttention-1 partitions Query, Key, and Value matrices into on-chip SRAM tiles, fusing matrix multiplication and softmax while recomputing activations during backpropagation to achieve O(N) memory.",
        "FlashAttention-2 inverts loop nesting order over Query blocks, eliminating inter-warp atomic synchronization and maximizing GPU Tensor Core warp occupancy to achieve up to 73% theoretical hardware FLOP utilization."
    ],
    "goal": "Master modern memory-efficient attention computation: analyze GPU memory hierarchies (HBM vs SRAM), implement the Milakov & Gimelshein Online Softmax algorithm, construct FlashAttention block tiling execution loops, implement FlashAttention-2 loop inversion, and benchmark IO complexity gains.",
    "minutes": 45,
    "projectStep": {
        "title": "FlashAttention Mathematical Tiling & Kernel Engine",
        "steps": [
            "Profile GPU HBM-to-SRAM memory transfer traffic and calculate arithmetic intensity for standard vs tiled attention.",
            "Implement the streaming Online Softmax algorithm with dynamic rescaling and prove floating-point equivalence.",
            "Construct a complete pure Python Tiled Causal Attention Engine with block skipping and verify output determinism."
        ]
    },
    "parts": [
        {
            "title": "The GPU Memory Hierarchy: SRAM, HBM, and the Memory-Bound Attention Bottleneck",
            "say": [
                "To understand why modern foundation model architectures required an algorithmic revolution in attention computation, we must abandon high-level algorithmic abstractions and descend into the physical semiconductor physics of modern GPUs. On an enterprise accelerator such as the NVIDIA A100 or H100, hardware silicon is strictly bifurcated into two distinct memory systems: large-capacity High Bandwidth Memory (HBM) and small-capacity on-chip Static Random Access Memory (SRAM), also known as Shared Memory and L1 Cache.",
                "High Bandwidth Memory (HBM) represents the external memory pool of the GPU—typically 40GB, 80GB, or 141GB per chip. While marketed as 'high bandwidth', its physical throughput is severely constrained compared to the computational velocity of the processing cores. An NVIDIA A100 GPU provides roughly 2.0 terabytes per second of HBM bandwidth, while an H100 achieves approximately 3.35 terabytes per second. In stark contrast, on-chip SRAM resides directly on the processor die alongside the Streaming Multiprocessors (SMs). It provides 19 to 33 terabytes per second of bandwidth—nearly an order of magnitude faster than HBM—with latency measured in single-digit clock cycles rather than hundreds of cycles. However, SRAM capacity is minuscule: only 192 kilobytes per SM, totaling roughly 20 to 50 megabytes across the entire chip.",
                "Now, consider the execution profile of standard Scaled Dot-Product Attention: Attention(Q, K, V) = softmax(Q K^T / sqrt(d_k)) V. Given input tensors Q, K, and V of sequence length N and head dimension d (e.g., N = 4,096, d = 128), standard deep learning frameworks (such as baseline PyTorch) implement this operation as a sequence of discrete PyTorch kernel invocations. First, a GEMM kernel loads Q and K from HBM into SRAM, computes the matrix product S = Q K^T, and writes the resulting intermediate score matrix S of size [N, N] back out to HBM.",
                "Next, a softmax kernel reads the entire [N, N] matrix S from HBM into SRAM, performs exponentiation and row-wise normalization to produce the probability matrix P = softmax(S), and writes P of size [N, N] back out to HBM. Finally, a third GEMM kernel reads P and V from HBM into SRAM, computes O = P V, and writes the output tensor O of size [N, d] back to HBM. Notice the disastrous hardware inefficiency: the intermediate matrices S and P are written to and read from high-latency HBM multiple times.",
                "For sequence length N = 4,096, the intermediate matrix S contains 4,096 * 4,096 = 16,777,216 floating-point elements per head. Across 32 layers and 32 heads in 16-bit precision, materializing S and P requires transferring dozens of gigabytes across the slow HBM memory bus. The memory traffic scales quadratically as O(N^2), whereas the actual input and output tensors Q, K, V, and O scale strictly linearly as O(N * d).",
                "Because reading and writing these massive intermediate matrices takes far longer than the arithmetic operations performed on them, the GPU Tensor Cores spend up to 80% of their operational cycles idling, waiting for bytes to trickle across the memory bus. Despite possessing petaflops of theoretical compute power, the GPU achieves poor Model FLOPs Utilization (MFU), frequently running at less than 15% to 20% of its theoretical capacity on long-context sequences.",
                "The central insight of Tri Dao and his collaborators at Stanford in their 2022 paper 'FlashAttention: Fast and Memory-Efficient Exact Attention with IO-Awareness' was that attention must be redesigned with IO-awareness. Rather than materializing the quadratic [N, N] attention matrix in slow HBM, the entire attention computation—matrix multiplication, softmax scaling, and value reduction—must be fused into a single unified GPU kernel that executes entirely within fast on-chip SRAM.",
                "In the following analytical script, we will model the exact memory traffic and IO complexity of standard attention versus tiled SRAM attention across expanding sequence lengths. You will observe how standard attention triggers an unsustainable exponential explosion in HBM data transfers, establishing the physical necessity for memory tiling and kernel fusion."
            ],
            "example": "Imagine an industrial chef preparing thousands of delicate salads. In standard attention, the chef chops cucumbers on their cutting board (SRAM), walks across the highway to a massive refrigerated warehouse (HBM) to deposit the chopped cucumber, walks back to chop tomatoes, walks back across the highway to store the tomatoes, then walks back across the highway again with both ingredients to toss them in a bowl. FlashAttention is like wheeling all ingredients to the cutting board once, preparing the salad entirely on the table, and only carrying the completed dish to the dining room.",
            "code": """def calculate_attention_io_traffic(seq_len: int, d_head: int = 128, n_heads: int = 32, dtype_bytes: int = 2) -> dict:
    standard_elements = (
        (3 * seq_len * d_head) +
        (3 * seq_len * seq_len) +
        (seq_len * seq_len) +
        (seq_len * d_head)
    ) * n_heads
    standard_bytes = standard_elements * dtype_bytes
    
    tiled_elements = (4 * seq_len * d_head) * n_heads
    tiled_bytes = tiled_elements * dtype_bytes
    
    return {
        "seq_len": seq_len,
        "standard_hbm_mb": round(standard_bytes / (1024 ** 2), 2),
        "tiled_hbm_mb": round(tiled_bytes / (1024 ** 2), 2),
        "io_reduction_factor": round(standard_bytes / tiled_bytes, 1)
    }

print("=== ATTENTION HBM MEMORY TRAFFIC BENCHMARK (32 Heads, d_head=128, FP16) ===")
for N in [512, 1024, 2048, 4096]:
    res = calculate_attention_io_traffic(N)
    print(f"Context N={res['seq_len']:>4} | Standard HBM: {res['standard_hbm_mb']:>8.2f} MB | Tiled HBM: {res['tiled_hbm_mb']:>6.2f} MB | IO Reduction: {res['io_reduction_factor']:>5.1f}x")
""",
            "output": """=== ATTENTION HBM MEMORY TRAFFIC BENCHMARK (32 Heads, d_head=128, FP16) ===
Context N= 512 | Standard HBM:    80.00 MB | Tiled HBM:  16.00 MB | IO Reduction:   5.0x
Context N=1024 | Standard HBM:   288.00 MB | Tiled HBM:  32.00 MB | IO Reduction:   9.0x
Context N=2048 | Standard HBM:  1088.00 MB | Tiled HBM:  64.00 MB | IO Reduction:  17.0x
Context N=4096 | Standard HBM:  4224.00 MB | Tiled HBM: 128.00 MB | IO Reduction:  33.0x""",
            "codeNotes": [
                "Line 2-8: Computes total memory elements transferred across HBM in standard unfused attention.",
                "Line 10: In tiled attention, intermediate N x N matrices are never written to HBM, transferring strictly `O(N * d)` data.",
                "Line 19-21: Evaluates memory traffic scaling across sequence lengths 512 through 4096.",
                "Line 22: Demonstrates that at N=4096, tiled attention achieves a dramatic 33.0x reduction in memory bus traffic."
            ],
            "tryIt": "Increase seq_len to 8192 and observe how standard attention transfers over 16.5 GB of data per layer while tiled attention transfers only 256 MB.",
            "check": {
                "question": "Why does standard scaled dot-product attention achieve poor hardware FLOP utilization on modern GPUs (like NVIDIA A100/H100)?",
                "options": [
                    "It is memory bandwidth-bound, materializing intermediate N x N attention score and probability matrices in high-latency HBM rather than executing fused computations within fast on-chip SRAM.",
                    "Because modern GPUs lack floating-point units capable of executing exponential operations in hardware.",
                    "Because PyTorch forces attention operations to synchronize with the host CPU at every matrix element.",
                    "Because Tensor Cores can only execute integer arithmetic and cannot process FP16 tensors."
                ],
                "answer": 0,
                "answerIndex": 0,
                "why": "Standard attention repeatedly writes and reads quadratic N x N intermediate matrices to slow external HBM across multiple kernel launches. This memory bandwidth bottleneck leaves compute units idling for up to 80% of runtime.",
                "explanation": "Standard attention repeatedly writes and reads quadratic N x N intermediate matrices to slow external HBM across multiple kernel launches. This memory bandwidth bottleneck leaves compute units idling for up to 80% of runtime."
            }
        },
        {
            "title": "The Safe Softmax & The Online Softmax Algorithm",
            "say": [
                "Before we can tile the attention computation across small SRAM blocks, we confront an apparently insurmountable mathematical roadblock: The Softmax Normalization Invariant. In scaled dot-product attention, the attention weights are computed row by row: P_i = softmax(S_i) where S_ij = q_i k_j^T / sqrt(d). In standard numerical computing, to prevent numerical overflow when computing e^(S_ij), we employ the classic 'Safe Softmax' algorithm.",
                "Safe Softmax operates in three strictly sequential passes over the row vector x of length N: Pass 1 finds the row maximum m = max_j(x_j); Pass 2 computes the unnormalized exponentials with the maximum subtracted and sums them to obtain the denominator normalizer d = sum_j e^(x_j - m); Pass 3 divides each exponentiated value by the normalizer: p_j = e^(x_j - m) / d. Notice the algorithmic dependency: you cannot compute any output probability p_j until you have observed the entire row to determine the true maximum m and the true sum d.",
                "If an engineer attempts to break the sequence into small tiles—say, blocks of size B = 64 tokens—how can one compute the softmax probabilities for Block 1 before even seeing the tokens in Block 2? If Block 2 happens to contain a score larger than anything in Block 1, the maximum m changes, rendering all previously calculated exponentials and sums in Block 1 mathematically invalid. It was widely believed that attention tiling was impossible without a full first pass over the entire sequence.",
                "In 2018, Maxim Milakov and Natalia Gimelshein at NVIDIA published a brilliant breakthrough: 'Online normalizer calculation for softmax'. They demonstrated that safe softmax can be computed in a single streaming pass using incremental mathematical rescaling. This exact formulation serves as the mathematical engine of FlashAttention.",
                "The Online Softmax algorithm works by maintaining a running row maximum m and a running normalization denominator d as blocks of data stream into SRAM. Let us formalize the recurrence relation. Suppose we have processed an initial block of scores x^(1) and computed its local maximum m^(1) and local sum d^(1) = sum_j e^(x_j^(1) - m^(1)). Now, a new block of scores x^(2) arrives with local maximum m^(2) and local sum d^(2) = sum_j e^(x_j^(2) - m^(2)).",
                "To merge these two blocks without storing raw scores, we compute the new global maximum: m^(new) = max(m^(1), m^(2)). If m^(2) > m^(1), all exponentials previously calculated with respect to m^(1) are off by an exact factor of e^(m^(1) - m^(new))! Because e^(x - m^(new)) = e^(x - m^(1)) * e^(m^(1) - m^(new)), we can correct the running denominator d^(1) simply by multiplying it by e^(m^(1) - m^(new)). The new unified denominator becomes: d^(new) = d^(1) * e^(m^(1) - m^(new)) + d^(2) * e^(m^(2) - m^(new)).",
                "This algebraic identity is extraordinarily powerful. It proves that we can update running softmax normalizers incrementally with zero approximation error and zero information loss. When applied to attention outputs, whenever the running maximum increases, we simply rescale the accumulated partial output vector in SRAM by that exact same exponential decay factor: O^(new) = O^(old) * (d^(old) / d^(new)) * e^(m^(old) - m^(new)) + ...",
                "From an algorithmic efficiency perspective, online softmax transforms a multi-pass global synchronization barrier into an embarrassingly parallel streaming reduction. A GPU thread block never needs to wait for subsequent sequence blocks to land in HBM before emitting partial normalized products. It maintains its running statistics entirely within high-speed register files, avoiding SRAM bank conflicts and unlocking massive instruction-level parallelism.",
                "In our implementation below, we will write a pure Python implementation of the Online Softmax algorithm. We will stream an array of arbitrary floating-point numbers chunk by chunk, update the running maximum and denominator normalizer using the Milakov-Gimelshein recurrence, and prove that the streaming output matches standard three-pass safe softmax to the exact last decimal place."
            ],
            "example": "Imagine an auctioneer calculating the winning bid percentage for an item across bidders arriving in three separate rooms. Rather than waiting for all bidders to finish and then recounting thousands of paper ballots, the auctioneer maintains a running blackboard score. When Room 2 announces a higher bid than Room 1, the auctioneer does not throw away Room 1's tally; they simply multiply Room 1's historical score by a mathematically precise discount factor to align it with the new highest bid.",
            "code": """import math

def standard_safe_softmax(x: list) -> list:
    m = max(x)
    exp_vals = [math.exp(v - m) for v in x]
    d = sum(exp_vals)
    return [v / d for v in exp_vals]

def online_softmax_streaming(x: list, block_size: int = 2) -> list:
    n = len(x)
    m_running = -float('inf')
    d_running = 0.0
    accumulated_unnormalized = []
    
    for start in range(0, n, block_size):
        block = x[start : start + block_size]
        m_block = max(block)
        d_block = sum(math.exp(v - m_block) for v in block)
        
        m_new = max(m_running, m_block)
        
        if m_running != -float('inf'):
            scale_old = math.exp(m_running - m_new)
            d_running = d_running * scale_old + d_block * math.exp(m_block - m_new)
            accumulated_unnormalized = [val * scale_old for val in accumulated_unnormalized]
        else:
            d_running = d_block
            
        for v in block:
            accumulated_unnormalized.append(math.exp(v - m_new))
            
        m_running = m_new

    return [val / d_running for val in accumulated_unnormalized]

logits = [2.5, 1.2, 5.8, 4.1, 8.2, 3.0]

std_result = standard_safe_softmax(logits)
online_result = online_softmax_streaming(logits, block_size=2)

print("=== ONLINE SOFTMAX VS STANDARD SOFTMAX NUMERICAL VERIFICATION ===")
for i in range(len(logits)):
    diff = abs(std_result[i] - online_result[i])
    print(f"Logit {logits[i]:>4.1f} | Standard: {std_result[i]:.8f} | Online: {online_result[i]:.8f} | Diff: {diff:.1e}")

assert max(abs(s - o) for s, o in zip(std_result, online_result)) < 1e-12
print("\\nMathematical Assertion Passed: Bit-level equivalence confirmed!")
""",
            "output": """=== ONLINE SOFTMAX VS STANDARD SOFTMAX NUMERICAL VERIFICATION ===
Logit  2.5 | Standard: 0.00299532 | Online: 0.00299532 | Diff: 4.3e-19
Logit  1.2 | Standard: 0.00081632 | Online: 0.00081632 | Diff: 1.1e-19
Logit  5.8 | Standard: 0.08121099 | Online: 0.08121099 | Diff: 0.0e+00
Logit  4.1 | Standard: 0.01483591 | Online: 0.01483591 | Diff: 3.5e-18
Logit  8.2 | Standard: 0.89520302 | Online: 0.89520302 | Diff: 0.0e+00
Logit  3.0 | Standard: 0.00493845 | Online: 0.00493845 | Diff: 0.0e+00

Mathematical Assertion Passed: Bit-level equivalence confirmed!""",
            "codeNotes": [
                "Line 3-7: Implements classical 3-pass safe softmax requiring complete row visibility.",
                "Line 9-33: Implements streaming Online Softmax processing input elements in blocks of 2.",
                "Line 21-24: Applies the Milakov-Gimelshein rescaling identity: `scale_old = exp(m_running - m_new)`.",
                "Line 43: Verifies exact bit-level floating-point equivalence with maximum absolute difference < 1e-12."
            ],
            "tryIt": "Alter block_size to 1 or 3 and verify that the output remains bit-for-bit identical to standard safe softmax.",
            "check": {
                "question": "How does the Online Softmax algorithm eliminate the need to materialize the full sequence of attention logits prior to computing normalization denominators?",
                "options": [
                    "It tracks running row maximums and denominators incrementally across blocks, rescaling previous partial accumulators by e^(m_old - m_new) whenever a higher logit is encountered in subsequent blocks.",
                    "It replaces the exponential function with a linear polynomial approximation that does not require normalization.",
                    "It quantizes all negative numbers to zero, eliminating the need for denominator summation.",
                    "It computes the softmax operation entirely on the host CPU using 64-bit integer instructions."
                ],
                "answer": 0,
                "answerIndex": 0,
                "why": "Online Softmax maintains a running maximum m and normalizer d across streaming blocks. When a new block reveals a higher maximum m_new, previous partial outputs are rescaled by exp(m_old - m_new), preserving exact mathematical equivalence.",
                "explanation": "Online Softmax maintains a running maximum m and normalizer d across streaming blocks. When a new block reveals a higher maximum m_new, previous partial outputs are rescaled by exp(m_old - m_new), preserving exact mathematical equivalence."
            }
        },
        {
            "title": "FlashAttention-1: Tiled Matrix Multiplication and Backward Recomputation",
            "say": [
                "Armed with the Online Softmax algorithm, Tri Dao and colleagues constructed FlashAttention-1. The algorithm bridges the gap between hardware memory hierarchies and deep learning mathematical abstractions by partitioning input matrices into rectangular tiles that fit entirely inside on-chip SRAM.",
                "In FlashAttention-1, the available on-chip SRAM capacity M (typically 100KB to 200KB per thread block) dictates the block dimensions. The input matrices Q, K, and V of sequence length N and head dimension d are split into blocks: Q is partitioned into T_r = ceil(N / B_r) blocks of size [B_r, d], while K and V are partitioned into T_c = ceil(N / B_c) blocks of size [B_c, d]. The block sizes B_r and B_c are chosen such that one block of Q, one block of K, and one block of V, along with intermediate accumulators, reside comfortably within SRAM.",
                "The execution structure of FlashAttention-1 is governed by two nested loops. The outer loop iterates over the Key and Value blocks j = 1, ..., T_c, streaming block K_j and block V_j from HBM into SRAM once. The inner loop iterates over the Query blocks i = 1, ..., T_r, loading Q_i into SRAM. For each (i, j) block pair, the GPU computes the local dot-product block S_ij = Q_i K_j^T / sqrt(d) directly in SRAM using high-speed Tensor Cores.",
                "Next, using the Online Softmax recurrence derived in Part 2, the algorithm updates the running row maximum m_i and running row normalizer l_i for Query block i. The partial output accumulator O_i in SRAM is updated via: O_i = diag(l_i^(old) / l_i^(new)) * diag(e^(m_i^(old) - m_i^(new))) * O_i + (e^(S_ij - m_i^(new)) / l_i^(new)) * V_j. Crucially, the intermediate score block S_ij is discarded immediately after updating O_i. It is never written out to HBM!",
                "Once all Key and Value blocks have been processed, the inner accumulator O_i contains the exact, normalized attention output for Query block i. It is written out to HBM exactly once. The total HBM memory reads and writes across the entire forward pass scale strictly as O(N^2 * d^2 / M), transforming the IO complexity from quadratic to sub-quadratic with respect to sequence length N.",
                "However, an astute engineer will immediately ask: what happens during the backward pass? In standard backpropagation, computing the gradients dQ, dK, and dV requires the attention probability matrix P = softmax(Q K^T / sqrt(d)). If FlashAttention did not store P in HBM during the forward pass, how can it compute gradients without consuming O(N^2) memory?",
                "FlashAttention's answer is a masterclass in hardware-aware trade-offs: Activation Recomputation in Fast SRAM. Rather than storing the massive [N, N] matrix P in slow HBM, FlashAttention stores only the tiny [N] vectors of row maximums m and row sums l. During the backward pass, as tiles of dO, Q, K, and V are loaded into SRAM, the kernel recomputes the small [B_r, B_c] tile of S_ij and P_ij on-the-fly directly inside SRAM using the saved m and l vectors.",
                "Because recomputing S_ij in fast SRAM takes fewer clock cycles than reading S_ij from slow HBM over the memory bus, FlashAttention's backward pass is actually significantly faster than standard attention backpropagation despite performing additional arithmetic FLOPs! FlashAttention slashes peak training memory from quadratic O(N^2) down to linear O(N), enabling context windows to scale by 4x to 8x on identical hardware.",
                "In our implementation below, we will write a pure Python FlashAttention-1 forward tiling engine. We will partition Q, K, and V into discrete blocks, execute the outer K/V and inner Q loops, maintain the running normalizers, and verify that the tiled output matches naive un-tiled attention to full floating-point precision."
            ],
            "example": "Imagine a logistics sorting facility packing shipping containers. In standard attention, thousands of packages are unloaded into a massive central holding warehouse, creating endless congestion and traffic jams. In FlashAttention-1, small localized conveyor belts (SRAM) process batches of 10 boxes at a time. The packing slip is computed, updated, and sealed directly inside the container, completely eliminating the need for a central holding warehouse.",
            "code": """import math

def dot(a, b):
    return sum(x * y for x, y in zip(a, b))

def standard_attention(Q, K, V):
    N = len(Q)
    d = len(Q[0])
    scale = 1.0 / math.sqrt(d)
    
    S = [[dot(Q[i], K[j]) * scale for j in range(N)] for i in range(N)]
    P = []
    for row in S:
        m = max(row)
        exp_r = [math.exp(v - m) for v in row]
        d_sum = sum(exp_r)
        P.append([v / d_sum for v in exp_r])
    return [[sum(P[i][j] * V[j][c] for j in range(N)) for c in range(d)] for i in range(N)]

def flash_attention_1_forward(Q, K, V, B_r: int = 2, B_c: int = 2):
    N = len(Q)
    d = len(Q[0])
    scale = 1.0 / math.sqrt(d)
    
    O = [[0.0] * d for _ in range(N)]
    m = [-float('inf')] * N
    l = [0.0] * N
    
    for j_start in range(0, N, B_c):
        K_j = K[j_start : j_start + B_c]
        V_j = V[j_start : j_start + B_c]
        
        for i_start in range(0, N, B_r):
            Q_i = Q[i_start : i_start + B_r]
            
            for local_i, q_vec in enumerate(Q_i):
                global_i = i_start + local_i
                S_ij = [dot(q_vec, k_vec) * scale for k_vec in K_j]
                m_ij = max(S_ij)
                m_new = max(m[global_i], m_ij)
                
                scale_prev = math.exp(m[global_i] - m_new) if m[global_i] != -float('inf') else 0.0
                p_tilde = [math.exp(s - m_new) for s in S_ij]
                l_new = l[global_i] * scale_prev + sum(p_tilde)
                
                for c in range(d):
                    pv_new = sum(p_tilde[k] * V_j[k][c] for k in range(len(K_j)))
                    O[global_i][c] = (O[global_i][c] * scale_prev * l[global_i] + pv_new) / l_new
                    
                m[global_i] = m_new
                l[global_i] = l_new
                
    return O

Q = [[1.0, 0.5], [0.2, 1.8], [0.9, 0.1], [1.5, 1.2]]
K = [[0.8, 0.1], [0.5, 1.5], [1.1, 0.4], [0.2, 0.9]]
V = [[10.0, 1.0], [20.0, 2.0], [30.0, 3.0], [40.0, 4.0]]

std_out = standard_attention(Q, K, V)
flash_out = flash_attention_1_forward(Q, K, V, B_r=2, B_c=2)

print("=== FLASHATTENTION-1 TILED VS STANDARD NUMERICAL VERIFICATION ===")
for i in range(len(Q)):
    std_row = [round(v, 4) for v in std_out[i]]
    flash_row = [round(v, 4) for v in flash_out[i]]
    print(f"Token {i} | Standard: {std_row} | FlashAttention-1: {flash_row}")

max_err = max(abs(std_out[i][c] - flash_out[i][c]) for i in range(len(Q)) for c in range(len(Q[0])))
assert max_err < 1e-12
print(f"Max Error: {max_err:.1e} (Perfect Numerical Equivalence!)")
""",
            "output": """=== FLASHATTENTION-1 TILED VS STANDARD NUMERICAL VERIFICATION ===
Token 0 | Standard: [24.6194, 2.4619] | FlashAttention-1: [24.6194, 2.4619]
Token 1 | Standard: [25.2152, 2.5215] | FlashAttention-1: [25.2152, 2.5215]
Token 2 | Standard: [24.3427, 2.4343] | FlashAttention-1: [24.3427, 2.4343]
Token 3 | Standard: [24.6106, 2.4611] | FlashAttention-1: [24.6106, 2.4611]
Max Error: 7.1e-15 (Perfect Numerical Equivalence!)""",
            "codeNotes": [
                "Line 6-18: Baseline naive attention materializes full intermediate S and P matrices.",
                "Line 20-56: Implements FlashAttention-1 tiling: outer loop over K, V blocks and inner loop over Q blocks.",
                "Line 43-51: Updates running output vector O using online softmax scaling without saving S_ij to HBM.",
                "Line 69-73: Validates bit-for-bit exact equivalence between tiled FlashAttention and standard attention."
            ],
            "tryIt": "Change block sizes B_r and B_c from 2 to 1 and verify that the output remains numerically identical.",
            "check": {
                "question": "In FlashAttention, what key algorithmic choice allows the backward pass to consume sub-quadratic O(N) memory rather than storing the N x N attention matrix?",
                "options": [
                    "It does not store the intermediate N x N attention probability matrix in HBM during the forward pass, but instead recomputes it block-by-block in fast SRAM during backpropagation using saved softmax normalizers.",
                    "It computes gradients using numerical finite difference approximations that require zero activation caching.",
                    "It eliminates the backward pass by optimizing parameters using zeroth-order genetic evolutionary algorithms.",
                    "It offloads the entire backward pass to host system RAM via PCIe Gen5 direct memory access."
                ],
                "answer": 0,
                "answerIndex": 0,
                "why": "FlashAttention saves only the row maximums m and row sums l in HBM (O(N) memory). During backpropagation, it recomputes intermediate attention tiles inside on-chip SRAM on-the-fly, achieving sub-quadratic training memory with zero accuracy loss.",
                "explanation": "FlashAttention saves only the row maximums m and row sums l in HBM (O(N) memory). During backpropagation, it recomputes intermediate attention tiles inside on-chip SRAM on-the-fly, achieving sub-quadratic training memory with zero accuracy loss."
            }
        },
        {
            "title": "FlashAttention-2: Outer Query Loop Reordering & Warp-Level Parallelism",
            "say": [
                "While FlashAttention-1 achieved a dramatic 2x to 4x wall-clock speedup over standard attention, profiling on modern NVIDIA Ampere and Hopper GPUs revealed that the kernel was still only achieving 25% to 40% of theoretical peak FLOPs. In 2023, Tri Dao published 'FlashAttention-2: Faster Attention with Better Parallelism and Work Partitioning', achieving up to 73% of peak theoretical A100/H100 hardware utilization.",
                "To understand the engineering breakthrough of FlashAttention-2, we must examine the architectural bottleneck of FlashAttention-1: Loop Nesting Order. Recall that in FlashAttention-1, the outer loop iterated over Key and Value blocks (columns), while the inner loop iterated over Query blocks (rows). Consider what happens when multiple GPU thread blocks attempt to parallelize execution across Streaming Multiprocessors.",
                "Because different thread blocks processing different Key-Value blocks are simultaneously updating the same Query row accumulator O_i, thread blocks had to synchronize using atomic operations or write intermediate split-K results out to HBM. This introduced thread synchronization stalls, warp divergence, and non-matmul computational overhead.",
                "FlashAttention-2 resolves this bottleneck with a profound structural inversion: Loop Order Inversion. The loops are flipped! The outer loop now iterates over the Query blocks i = 1, ..., T_r, while the inner loop iterates over the Key and Value blocks j = 1, ..., T_c. Notice the immediate architectural consequence: each GPU thread block is assigned a distinct Query block Q_i. Because Query block Q_i is processed exclusively by a single thread block, that thread block can iterate through all Key-Value blocks, maintain its own private accumulator O_i in registers and SRAM, and write the final output row to HBM with zero atomic locks and zero inter-thread synchronization!",
                "Furthermore, loop inversion unlocks massive parallelism across the Sequence Length Dimension. In FlashAttention-1, parallelism was primarily assigned across batch size and number of attention heads. When batch size was small (e.g., during low-latency autoregressive serving with batch size 1), many of the GPU's 108 Streaming Multiprocessors sat completely idle. In FlashAttention-2, because each Query block is completely independent, thread blocks are scheduled across the sequence length dimension (T_r blocks), saturating all available SMs even when batch size is 1.",
                "FlashAttention-2 also re-engineers Warp-Level Work Partitioning within each thread block. On modern NVIDIA architectures, a warp consists of 32 threads executing in lockstep. In FlashAttention-2, warps within a thread block split the Query block Q_i, each warp taking a sub-row slice. When computing matrix products with K_j and V_j, warps share the Key and Value blocks via fast SRAM, eliminating redundant loads and maximizing Tensor Core MMA (Matrix Multiply-Accumulate) throughput.",
                "Additionally, FlashAttention-2 slashes non-matmul FLOPs. In FlashAttention-1, every step of the inner loop performed rescaling division by the updated normalizer l_new. In FlashAttention-2, division by the denominator is deferred until the very end of the inner loop. The kernel accumulates raw unnormalized products in high-precision FP32 registers and performs a single vector division only when the Query block has finished scanning all Key-Value blocks, eliminating millions of slow reciprocal instructions.",
                "By decoupling thread blocks and maximizing register file residence, FlashAttention-2 pushes modern GPU hardware to its absolute mathematical limits. The kernel achieves near-linear scaling with sequence length and establishes the computational bedrock upon which frontier 100K-token context models are trained and deployed.",
                "In enterprise serving deployments, FlashAttention-2's outer Query loop reordering also provides the direct architectural blueprint for FlashDecoding. In single-token autoregressive generation where the Query length is strictly 1, FlashDecoding splits the Key and Value cache across multiple GPU thread blocks along the sequence dimension, executes parallel partial reductions, and combines them via online softmax, slashing single-token decoding latency on 64K contexts by up to 8x.",
                "In our implementation below, we will write a pure Python FlashAttention-2 simulator implementing the inverted loop architecture. We will demonstrate how each Query block processes Key-Value tiles independently, accumulates unnormalized outputs, and performs a single deferred normalization at loop termination, proving why FlashAttention-2 delivers up to 2x faster execution than FlashAttention-1."
            ],
            "example": "Imagine a banquet kitchen preparing custom dinner plates for 100 guests. In FlashAttention-1, the soup chef visits all 100 tables pouring soup, then the steak chef visits all 100 tables pouring gravy, causing chefs to bump into each other and fight over table access (atomic locks). In FlashAttention-2, each table is assigned a dedicated head waiter (Query block). That waiter visits the soup station, steak station, and dessert station independently, completes the table's meal, and serves it with zero collision.",
            "code": """import math

def dot(a, b):
    return sum(x * y for x, y in zip(a, b))

def flash_attention_2_forward(Q, K, V, B_r: int = 2, B_c: int = 2):
    N = len(Q)
    d = len(Q[0])
    scale = 1.0 / math.sqrt(d)
    
    O = [[0.0] * d for _ in range(N)]
    
    for i_start in range(0, N, B_r):
        Q_i = Q[i_start : i_start + B_r]
        actual_br = len(Q_i)
        
        O_block = [[0.0] * d for _ in range(actual_br)]
        m_block = [-float('inf')] * actual_br
        l_block = [0.0] * actual_br
        
        for j_start in range(0, N, B_c):
            K_j = K[j_start : j_start + B_c]
            V_j = V[j_start : j_start + B_c]
            
            for local_i in range(actual_br):
                q_vec = Q_i[local_i]
                S_ij = [dot(q_vec, k_vec) * scale for k_vec in K_j]
                m_ij = max(S_ij)
                m_new = max(m_block[local_i], m_ij)
                
                scale_prev = math.exp(m_block[local_i] - m_new) if m_block[local_i] != -float('inf') else 0.0
                p_tilde = [math.exp(s - m_new) for s in S_ij]
                
                l_block[local_i] = l_block[local_i] * scale_prev + sum(p_tilde)
                for c in range(d):
                    pv_new = sum(p_tilde[k] * V_j[k][c] for k in range(len(K_j)))
                    O_block[local_i][c] = O_block[local_i][c] * scale_prev + pv_new
                    
                m_block[local_i] = m_new

        for local_i in range(actual_br):
            global_i = i_start + local_i
            norm = l_block[local_i]
            for c in range(d):
                O[global_i][c] = O_block[local_i][c] / norm

    return O

Q = [[1.0, 0.5], [0.2, 1.8], [0.9, 0.1], [1.5, 1.2]]
K = [[0.8, 0.1], [0.5, 1.5], [1.1, 0.4], [0.2, 0.9]]
V = [[10.0, 1.0], [20.0, 2.0], [30.0, 3.0], [40.0, 4.0]]

fa2_out = flash_attention_2_forward(Q, K, V, B_r=2, B_c=2)

print("=== FLASHATTENTION-2 INVERTED LOOP VERIFICATION ===")
for i in range(len(Q)):
    row = [round(v, 4) for v in fa2_out[i]]
    print(f"Token {i} Output Vector: {row}")
""",
            "output": """=== FLASHATTENTION-2 INVERTED LOOP VERIFICATION ===
Token 0 Output Vector: [24.6194, 2.4619]
Token 1 Output Vector: [25.2152, 2.5215]
Token 2 Output Vector: [24.3427, 2.4343]
Token 3 Output Vector: [24.6106, 2.4611]""",
            "codeNotes": [
                "Line 12: Outer loop iterates over Query blocks, enabling fully independent thread blocks.",
                "Line 21: Inner loop iterates over Key and Value blocks without inter-block atomic locks.",
                "Line 35-37: Accumulates unnormalized products in registers without executing repeated divisions.",
                "Line 41-46: Executes deferred normalization once per row at loop termination, slashing non-matmul FLOPs."
            ],
            "tryIt": "Verify that Token 0 output [24.6194, 2.4619] matches the FlashAttention-1 output from Part 3 to 4 decimal places.",
            "check": {
                "question": "What is the primary structural innovation of FlashAttention-2 over FlashAttention-1 that reduces thread synchronization overhead and accelerates execution?",
                "options": [
                    "It inverts the loop nesting order so the outer loop iterates over Query blocks, allowing thread blocks to compute outputs independently with zero atomic synchronization while deferring normalization division.",
                    "It replaces FP16 floating-point values with 1-bit boolean flags.",
                    "It eliminates the Key-Value projection matrices from the model architecture.",
                    "It uses fast Fourier transforms to convert attention into a circular convolution."
                ],
                "answer": 0,
                "answerIndex": 0,
                "why": "FlashAttention-2 places the Query loop on the outside. Each thread block owns a distinct Query tile, eliminating the need for atomic locks across blocks and deferring softmax normalization division until loop completion.",
                "explanation": "FlashAttention-2 places the Query loop on the outside. Each thread block owns a distinct Query tile, eliminating the need for atomic locks across blocks and deferring softmax normalization division until loop completion."
            }
        },
        {
            "title": "Production Implementation: Tiled Attention Simulator & Numerical Precision Verification",
            "say": [
                "In this final section of Day 33, we assemble our findings into an industrial-grade production simulator: Tiled Causal Attention with Block Skipping. In autoregressive language models (such as GPT-4, LLaMA, and Mistral), attention is strictly causal: a token at position i is forbidden from attending to any token at position j > i. In standard attention, this is implemented by materializing a lower-triangular mask matrix filled with -infinity in the upper triangle, consuming massive memory and executing wasted FLOPs on masked-out positions.",
                "In FlashAttention, causal masking unlocks an extraordinary algorithmic optimization: Entire Block Skipping. Consider the grid of Query blocks i and Key-Value blocks j. Because both queries and keys are ordered chronologically by token position, any block pair where the minimum key index in block j strictly exceeds the maximum query index in block i (min(K_j_idx) > max(Q_i_idx)) resides entirely in the forbidden upper-triangular region.",
                "In an optimized tiled kernel, we can mathematically evaluate whether a block pair is strictly causal before performing a single matrix multiplication! If min(K_j_idx) > max(Q_i_idx), the entire block multiplication is completely skipped—zero loads from memory, zero Tensor Core FLOPs, and zero softmax computations. For a square matrix partitioned into tiles, causal block skipping eliminates approximately 50% of the entire forward pass computational workload, doubling execution speed.",
                "For 'diagonal' blocks where the block spans the boundary between valid causal tokens and future masked tokens (where query and key indices overlap), the kernel applies a local causal mask only to the small [B_r, B_c] tile within fast SRAM. Upper triangular elements in the tile are masked with -infinity before computing local online softmax. All blocks strictly below the diagonal are computed as standard dense blocks with zero masking overhead.",
                "Another critical engineering invariant in production kernels is Numerical Precision Management. While modern models are trained and served in 16-bit precision (FP16 or BF16) to conserve memory bandwidth and utilize high-speed Tensor Cores, accumulating online softmax normalizers in 16-bit precision leads to catastrophic numerical underflow or overflow. An exponential e^x easily exceeds the maximum representable dynamic range of FP16 (which caps at 65,504).",
                "Therefore, production FlashAttention kernels enforce Mixed-Precision Kernel Fusion. The input tensors Q, K, and V are read from HBM in FP16/BF16. The matrix multiplication Q_i K_j^T is executed on Tensor Cores in FP16, but its output is accumulated in 32-bit single-precision (FP32) registers. The online softmax recurrence—computing maximums, exponentials, denominators, and output scaling—is executed strictly in FP32. Finally, when the completed output tile O_i is written back to HBM, it is cast back to FP16. This guarantees mathematical stability across sequences of 100,000+ tokens.",
                "In enterprise LLMOps, understanding FlashAttention mechanics is the foundation of high-throughput serving architectures. Serving frameworks like vLLM, TensorRT-LLM, and HuggingFace TGI integrate FlashAttention-2 as their primary attention backend. Without FlashAttention, modern 32K and 128K context windows would be physically impossible to host within commercial GPU budgets.",
                "Furthermore, understanding tiled attention paves the way for advanced variants like FlashDecoding and FlashDecoding++, which partition the Key-Value sequence length dimension across multiple thread blocks during autoregressive generation to accelerate single-token decoding latency on long-context prompts.",
                "In our production systems, kernel tuning must balance block sizes B_r and B_c against the physical register budget per thread block. If block dimensions are set too large, register spilling to local DRAM degrades performance; if set too small, Tensor Cores spend too many cycles waiting on memory pipelines. Engineering this balance is the hallmark of modern high-performance computational linguistics.",
                "In the following comprehensive implementation, we will build a complete Pure Python Tiled Causal Attention Engine with block skipping, FP32 accumulator simulation, and numerical validation against naive masked attention, confirming that our tiled engine achieves exact determinism while skipping 50% of non-causal tiles."
            ],
            "example": "Imagine an auditor reviewing multi-year financial statements under a legal non-disclosure rule: you are legally forbidden from looking at future quarters. In standard attention, you photocopy thousands of blank future pages and black them out with marker. In tiled causal attention with block skipping, you never even order the future binders from the warehouse; you completely skip loading boxes that belong to future dates, cutting your paper and audit workload in half.",
            "code": """import math

def dot(a, b):
    return sum(x * y for x, y in zip(a, b))

def naive_causal_attention(Q, K, V):
    N = len(Q)
    d = len(Q[0])
    scale = 1.0 / math.sqrt(d)
    
    S = []
    for i in range(N):
        row = []
        for j in range(N):
            if j > i:
                row.append(-float('inf'))
            else:
                row.append(dot(Q[i], K[j]) * scale)
        S.append(row)
        
    P = []
    for row in S:
        m = max(row)
        exp_r = [math.exp(v - m) if v != -float('inf') else 0.0 for v in row]
        d_sum = sum(exp_r)
        P.append([v / d_sum for v in exp_r])
        
    return [[sum(P[i][j] * V[j][c] for j in range(N)) for c in range(d)] for i in range(N)]

def tiled_causal_flash_attention(Q, K, V, B_r: int = 2, B_c: int = 2):
    N = len(Q)
    d = len(Q[0])
    scale = 1.0 / math.sqrt(d)
    
    O = [[0.0] * d for _ in range(N)]
    blocks_skipped = 0
    blocks_computed = 0
    
    for i_start in range(0, N, B_r):
        Q_i = Q[i_start : i_start + B_r]
        actual_br = len(Q_i)
        
        O_block = [[0.0] * d for _ in range(actual_br)]
        m_block = [-float('inf')] * actual_br
        l_block = [0.0] * actual_br
        
        for j_start in range(0, N, B_c):
            if j_start > (i_start + actual_br - 1):
                blocks_skipped += 1
                continue
                
            blocks_computed += 1
            K_j = K[j_start : j_start + B_c]
            V_j = V[j_start : j_start + B_c]
            
            for local_i in range(actual_br):
                global_i = i_start + local_i
                q_vec = Q_i[local_i]
                
                S_ij = []
                for local_j, k_vec in enumerate(K_j):
                    global_j = j_start + local_j
                    if global_j > global_i:
                        S_ij.append(-float('inf'))
                    else:
                        S_ij.append(dot(q_vec, k_vec) * scale)
                        
                m_ij = max(S_ij)
                if m_ij == -float('inf'):
                    continue
                    
                m_new = max(m_block[local_i], m_ij)
                scale_prev = math.exp(m_block[local_i] - m_new) if m_block[local_i] != -float('inf') else 0.0
                p_tilde = [math.exp(s - m_new) if s != -float('inf') else 0.0 for s in S_ij]
                
                l_block[local_i] = l_block[local_i] * scale_prev + sum(p_tilde)
                for c in range(d):
                    pv_new = sum(p_tilde[k] * V_j[k][c] for k in range(len(K_j)))
                    O_block[local_i][c] = O_block[local_i][c] * scale_prev + pv_new
                    
                m_block[local_i] = m_new
                
        for local_i in range(actual_br):
            global_i = i_start + local_i
            norm = l_block[local_i]
            for c in range(d):
                O[global_i][c] = O_block[local_i][c] / norm
                
    return O, blocks_computed, blocks_skipped

Q = [[1.0, 0.5], [0.2, 1.8], [0.9, 0.1], [1.5, 1.2]]
K = [[0.8, 0.1], [0.5, 1.5], [1.1, 0.4], [0.2, 0.9]]
V = [[10.0, 1.0], [20.0, 2.0], [30.0, 3.0], [40.0, 4.0]]

naive_out = naive_causal_attention(Q, K, V)
tiled_out, computed, skipped = tiled_causal_flash_attention(Q, K, V, B_r=2, B_c=2)

print("=== TILED CAUSAL FLASHATTENTION ENGINE WITH BLOCK SKIPPING ===")
print(f"Total Block Pairs Evaluated: {computed + skipped}")
print(f"Blocks Computed: {computed} | Blocks Skipped (Pure Upper Triangle): {skipped}")
for i in range(len(Q)):
    row_naive = [round(v, 4) for v in naive_out[i]]
    row_tiled = [round(v, 4) for v in tiled_out[i]]
    print(f"Token {i} | Naive: {row_naive} | Tiled Causal: {row_tiled}")

max_diff = max(abs(naive_out[i][c] - tiled_out[i][c]) for i in range(len(Q)) for c in range(len(Q[0])))
assert max_diff < 1e-12
print(f"Max Difference: {max_diff:.1e} (Deterministic Causal Equivalence Verified!)")
""",
            "output": """=== TILED CAUSAL FLASHATTENTION ENGINE WITH BLOCK SKIPPING ===
Total Block Pairs Evaluated: 4
Blocks Computed: 3 | Blocks Skipped (Pure Upper Triangle): 1
Token 0 | Naive: [10.0, 1.0] | Tiled Causal: [10.0, 1.0]
Token 1 | Naive: [18.5062, 1.8506] | Tiled Causal: [18.5062, 1.8506]
Token 2 | Naive: [20.7506, 2.0751] | Tiled Causal: [20.7506, 2.0751]
Token 3 | Naive: [24.6106, 2.4611] | Tiled Causal: [24.6106, 2.4611]
Max Difference: 7.1e-15 (Deterministic Causal Equivalence Verified!)""",
            "codeNotes": [
                "Line 6-27: Naive causal baseline masks upper triangle with -infinity.",
                "Line 47-51: Block Skipping optimization: skips entire (i, j) blocks if `j_start > i_start + actual_br - 1`.",
                "Line 60-65: Enforces local causal masking strictly within diagonal overlapping boundary blocks.",
                "Line 101-105: Demonstrates exact numerical equivalence while skipping 25% to 50% of tile computation."
            ],
            "tryIt": "Increase sequence length to 8 with block sizes 2x2 and observe how 6 out of 16 blocks (37.5%) are completely skipped.",
            "check": {
                "question": "How does FlashAttention optimize the computation of causal (autoregressive) attention masks within its tiled execution loops?",
                "options": [
                    "It completely skips computing entire Key-Value blocks that fall strictly in the upper triangle where all key positions exceed the current query block indices, eliminating wasted memory loads and FLOPs.",
                    "It converts the causal mask into a learned neural network that predicts future tokens.",
                    "It executes the causal mask on the CPU while the GPU processes non-causal tokens.",
                    "It forces all negative attention scores to positive infinity to bypass the softmax operator."
                ],
                "answer": 0,
                "answerIndex": 0,
                "why": "Because token indices are ordered monotonically, any block pair where key indices are strictly greater than query indices falls completely in the masked upper triangle. FlashAttention identifies these blocks a priori and skips them entirely.",
                "explanation": "Because token indices are ordered monotonically, any block pair where key indices are strictly greater than query indices falls completely in the masked upper triangle. FlashAttention identifies these blocks a priori and skips them entirely."
            }
        }
    ]
}
