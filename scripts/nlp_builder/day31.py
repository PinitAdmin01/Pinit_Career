"""
Day 31 Data Builder for Course 37: Natural Language Processing & Computational Linguistics
Topic: Advanced Attention Architectures: Multi-Query Attention (MQA), Grouped-Query Attention (GQA) & Sliding Window Attention
"""

DAY_31_DATA = {
    "day": 31,
    "coursePrefix": "nlp",
    "title": "Day 31: Advanced Attention Architectures: Multi-Query Attention (MQA), Grouped-Query Attention (GQA) & Sliding Window Attention",
    "summary": [
        "Multi-Head Attention (MHA) creates an unsustainable memory bandwidth bottleneck during autoregressive decoding due to linear KV-cache growth per head.",
        "Multi-Query Attention (MQA) collapses all key and value heads into a single shared projection, achieving up to 32x KV-cache memory compression at the cost of slight capacity loss.",
        "Grouped-Query Attention (GQA) establishes the optimal Pareto frontier by partitioning query heads into groups that share intermediate key-value projections.",
        "Sliding Window Attention (SWA) enforces localized receptive fields with rolling circular buffers, guaranteeing bounded O(W) cache memory per layer while preserving deep multi-layer context propagation."
    ],
    "goal": "Master modern memory-efficient attention architectures: analyze MHA memory bandwidth bottlenecks, implement Multi-Query Attention (MQA), engineer Grouped-Query Attention (GQA) with head grouping, implement Sliding Window Attention (SWA) with rolling buffers, and benchmark production KV-cache footprints.",
    "minutes": 42,
    "projectStep": {
        "title": "Modern Attention Architecture Optimization",
        "steps": [
            "Profile Multi-Head Attention KV-cache memory footprint and compute arithmetic intensity under autoregressive decoding.",
            "Implement Multi-Query Attention (MQA) and Grouped-Query Attention (GQA) tensor projection and broadcasting mechanics.",
            "Construct Sliding Window Attention with rolling circular KV-cache buffers and benchmark serving concurrency gains."
        ]
    },
    "parts": [
        {
            "title": "The Memory Bandwidth Bottleneck & Multi-Head Attention (MHA) KV-Cache Scaling",
            "say": [
                "Welcome to Month 2 of Natural Language Processing and Computational Linguistics. In Month 1, we established the foundational mechanics of computational linguistics: Unicode normalization pipelines, tokenizers, subword segmentation, vector space embeddings, recurrent neural architectures, and the standard Scaled Dot-Product Multi-Head Attention (MHA) mechanism introduced in the seminal 2017 paper 'Attention Is All You Need'. As we enter Month 2, we leave toy classroom architectures behind and transition directly into the harsh engineering realities of industrial foundation model deployment. Our focus shifts from pure theoretical expressiveness to hardware execution efficiency, memory hierarchy bottlenecks, and serving throughput at scale.",
                "In standard Multi-Head Attention (MHA), a model with hidden dimension d_model splits representations across H distinct parallel attention heads, where each head operates on vectors of dimension d_head = d_model / H. During the initial prefill phase of inference, the model processes the entire prompt sequence of length L simultaneously. This operation is compute-bound, represented as high-throughput General Matrix Multiply (GEMM) operations that saturate modern GPU Tensor Cores. However, the moment prefill completes and the model enters the autoregressive generation phase—generating one token at a time—the execution physics invert completely. The model becomes ruthlessly memory bandwidth-bound.",
                "To generate token t, the model must attend to all previous tokens from 1 to t-1. If we recomputed Key and Value projections for all past tokens at every decoding step, generating a sequence of length L would demand O(L^2) projection FLOPs per sequence, resulting in quadratic inference slowdown. To prevent redundant computation, modern inference engines maintain a Key-Value Cache (KV-cache), persisting the Key and Value activation tensors computed for all previous tokens in GPU High Bandwidth Memory (HBM). At step t, the model computes Query, Key, and Value projections only for the single new token, appends the new Key and Value vectors to the KV-cache, and performs matrix-vector dot products across the accumulated history.",
                "While the KV-cache successfully reduces the algorithmic compute complexity from quadratic O(L^2) to linear O(L) per token, it introduces a crippling memory footprint crisis. For a Transformer with n_layers layers, H_kv key/value heads per layer, head dimension d_head, sequence length L, batch size B, and stored in 16-bit floating-point precision (2 bytes per element), the total memory consumed by the KV-cache is exactly 2 * 2 * n_layers * H_kv * d_head * L * B bytes. Notice that the factor of 2 accounts for storing both Keys and Values, and the second factor of 2 accounts for FP16 precision. For a standard 70-billion parameter model (such as LLaMA-2 70B with 80 layers, 64 heads, and d_head = 128), a single sequence of 4,096 tokens consumes over 10.0 gigabytes of VRAM purely for its KV-cache activations.",
                "Now consider an enterprise serving environment running a batch size of 32 concurrent user requests at context length 8,192. Under standard MHA, the KV-cache alone demands over 640 gigabytes of GPU memory! That exceeds the entire physical memory capacity of eight 80GB NVIDIA A100 GPUs combined, before allocating a single byte for the 140 gigabytes of model parameter weights. Consequently, serving systems under MHA cannot utilize their immense compute capacity because they run completely out of VRAM, throttling maximum batch concurrency and driving inference costs to unsustainable levels.",
                "The hardware tragedy of autoregressive decoding is captured by the metric of Arithmetic Intensity, defined as the ratio of floating-point operations (FLOPs) performed per byte of memory transferred from HBM to on-chip SRAM (FLOPs/byte). In GEMV (General Matrix-Vector multiplication), for each token generated, the GPU must stream gigabytes of historical KV-cache activations across the memory bus simply to perform a handful of multiply-accumulate operations with the new query vector. On an NVIDIA H100 GPU capable of 1,979 TFLOPs of FP16 Tensor Core compute but constrained to 3.35 TB/s of memory bandwidth, the hardware requires an arithmetic intensity of roughly 590 FLOPs/byte to achieve full saturation. Autoregressive MHA generation operates at an arithmetic intensity of approximately 1 to 2 FLOPs/byte, leaving over 99% of the GPU's compute silicon sitting completely idle while waiting for memory transfers.",
                "This hardware bottleneck reveals the central architectural lesson of modern LLM serving: model throughput during generation is not governed by parameter counts or compute FLOPs, but by memory bandwidth and the volumetric footprint of the KV-cache. If we can compress the memory footprint of the Key and Value tensors without sacrificing the representational diversity of the Query heads, we can multiply serving throughput by four-fold to eight-fold on identical hardware. This exact realization motivated the structural evolution from Multi-Head Attention to Multi-Query Attention and Grouped-Query Attention.",
                "In the following hands-on simulation, we will construct a pure Python memory profiler that calculates the exact byte-level KV-cache footprint and arithmetic intensity across varying model scales, batch sizes, and sequence lengths. You will observe firsthand how MHA memory usage explodes quadratically with context window expansion, demonstrating why classical MHA has been systematically abandoned in state-of-the-art foundation models."
            ],
            "example": "Imagine an executive conference where 64 corporate attorneys (representing 64 Query heads) are drafting a joint contract. In standard MHA, each attorney insists on hiring their own personal court stenographer (Key) and evidence archivist (Value). When someone asks a question, 64 separate stenographers must read their entire 4,000-page binders out loud simultaneously. The conference table collapses under the physical weight of 64 duplicate paper binders, and proceedings grind to a halt as attorneys wait on filing clerks rather than negotiating.",
            "code": """def calculate_mha_kv_footprint(n_layers: int, n_heads: int, d_head: int, seq_len: int, batch_size: int, dtype_bytes: int = 2) -> dict:
    elements_per_token = 2 * n_layers * n_heads * d_head
    bytes_per_token = elements_per_token * dtype_bytes
    total_bytes = bytes_per_token * seq_len * batch_size
    total_gigabytes = total_bytes / (1024 ** 3)
    
    decode_flops = 4 * n_layers * n_heads * seq_len * d_head * batch_size
    arithmetic_intensity = decode_flops / total_bytes if total_bytes > 0 else 0.0
    
    return {
        "bytes_per_token": bytes_per_token,
        "total_gb": round(total_gigabytes, 3),
        "decode_flops_gflop": round(decode_flops / 1e9, 4),
        "arithmetic_intensity_flops_per_byte": round(arithmetic_intensity, 3)
    }

metrics_4k = calculate_mha_kv_footprint(n_layers=80, n_heads=64, d_head=128, seq_len=4096, batch_size=1)
metrics_8k_b32 = calculate_mha_kv_footprint(n_layers=80, n_heads=64, d_head=128, seq_len=8192, batch_size=32)

print(f"70B MHA (1 seq, 4K context): {metrics_4k['total_gb']} GB, Intensity: {metrics_4k['arithmetic_intensity_flops_per_byte']} FLOPs/B")
print(f"70B MHA (32 batch, 8K context): {metrics_8k_b32['total_gb']} GB, Intensity: {metrics_8k_b32['arithmetic_intensity_flops_per_byte']} FLOPs/B")
""",
            "output": """70B MHA (1 seq, 4K context): 10.0 GB, Intensity: 1.0 FLOPs/B
70B MHA (32 batch, 8K context): 640.0 GB, Intensity: 1.0 FLOPs/B""",
            "codeNotes": [
                "Line 2: Computes exact elements per token as 2 (Keys + Values) * layers * heads * head_dim.",
                "Line 4: Total KV bytes scales linearly with sequence length and batch size.",
                "Line 7-8: Arithmetic intensity during single-token decoding is strictly ~1.0 FLOPs/byte, proving memory bandwidth saturation.",
                "Line 18-20: Demonstrates that 32 concurrent requests at 8K context consumes 640 GB of VRAM purely for KV activations."
            ],
            "tryIt": "Increase batch_size to 64 and sequence length to 16,384 in calculate_mha_kv_footprint to observe how the KV-cache exceeds 2.5 TB of VRAM.",
            "check": {
                "question": "Why does standard Multi-Head Attention (MHA) become severely memory bandwidth-bound during autoregressive token generation?",
                "options": [
                    "Each newly decoded token requires streaming the entire accumulated KV-cache across all layers and heads from high-latency HBM into on-chip SRAM to perform a single matrix-vector multiply, resulting in an arithmetic intensity of ~1 FLOP/byte.",
                    "Because GPU Tensor Cores are mathematically incapable of performing dot products on vectors whose length is not a multiple of 1024.",
                    "Because modern GPUs do not support caching operations inside high bandwidth memory without manual host CPU interrupts.",
                    "Because MHA forces the Query tensor to duplicate itself across all previous sequence positions at every forward pass."
                ],
                "answer": 0,
                "answerIndex": 0,
                "why": "During autoregressive decoding, generating each token requires reading the full KV-cache from HBM to perform a matrix-vector dot product (GEMV). This yields an arithmetic intensity of ~1 FLOP/byte, saturating memory bandwidth while leaving GPU compute units severely underutilized.",
                "explanation": "During autoregressive decoding, generating each token requires reading the full KV-cache from HBM to perform a matrix-vector dot product (GEMV). This yields an arithmetic intensity of ~1 FLOP/byte, saturating memory bandwidth while leaving GPU compute units severely underutilized."
            }
        },
        {
            "title": "Multi-Query Attention (MQA): Single Shared Key-Value Head Mechanics",
            "say": [
                "Having diagnosed the memory bandwidth bottleneck of Multi-Head Attention, we now examine the first radical architectural cure: Multi-Query Attention (MQA), introduced by Noam Shazeer in 2019 ('Fast Transformer Decoding: One Write-Head is All You Need'). Shazeer asked a provocative question: does each attention head truly require its own unique Key and Value projection subspaces, or can multiple Query heads share a single centralized set of Keys and Values?",
                "In classical MHA, given an input tensor X of shape [batch, seq_len, d_model], the model projects X using three parameter matrices W_Q, W_K, and W_V, each of shape [d_model, d_model]. These projections are then split into H distinct heads of dimension d_head. Thus, MHA maintains H Query heads, H Key heads, and H Value heads. In contrast, Multi-Query Attention retains H independent Query heads, but collapses the Key and Value projections into exactly one single Key head and one single Value head. The projection matrices W_K and W_V are reduced in size from [d_model, d_model] to [d_model, d_head].",
                "During the attention calculation, the single Key tensor K (of shape [batch, seq_len, 1, d_head]) and single Value tensor V (of shape [batch, seq_len, 1, d_head]) are broadcast across all H Query heads. Each Query head q_h continues to maintain its own unique semantic perspective and projects its own independent search queries, but all H heads compute attention scores against the exact same set of keys and retrieve weighted averages from the exact same set of values.",
                "The hardware implications of this transformation are breathtaking. Because there is only 1 Key head and 1 Value head per layer instead of H heads, the memory footprint of the KV-cache is slashed by a factor of exactly H. For a 64-head model, Multi-Query Attention reduces the KV-cache memory requirement by 64x (a 98.4% reduction). In the 70B model scenario analyzed in Part 1 where a batch of 32 sequences at 8K context consumed 640 GB of VRAM, MQA shrinks that entire KV-cache footprint down to a trivial 10.0 gigabytes. This allows dozens of concurrent user sessions to be packed onto a single GPU.",
                "Furthermore, MQA drastically increases the arithmetic intensity of autoregressive decoding. When the GPU streams the single Key vector and single Value vector from HBM into on-chip SRAM, it can reuse those exact same cached vectors across all H Query heads. Instead of performing 1 dot product per byte loaded from memory, the GPU performs H parallel dot products per byte loaded. The arithmetic intensity jumps from 1 FLOP/byte to H FLOPs/byte (e.g., 64 FLOPs/byte), shifting execution significantly closer to the GPU's compute saturation ceiling.",
                "However, this dramatic efficiency gain does not come entirely free. Collapsing H distinct Key and Value representation spaces down to a single shared subspace introduces a capacity bottleneck. In MHA, different heads can specialize: Head 1 might use Key subspace 1 to track subject-verb syntactic agreements, while Head 2 uses Key subspace 2 to track pronoun coreferences across paragraphs. Under MQA, all Query heads are forced to query against a single compressed semantic coordinate system. On tasks requiring multi-hop logical reasoning, intricate code syntax resolution, or fine-grained factual recall, early MQA models exhibited observable degradation in perplexity and downstream benchmark accuracy.",
                "Despite this capacity trade-off, MQA proved highly influential and was adopted in landmark production systems, including Google's PaLM (Pathways Language Model) and StarCoder. PaLM trained a 540-billion parameter model using MQA, demonstrating that at massive planetary scales, parameter volume can partially compensate for the representational constraint of a single shared KV head while unlocking massive inference serving speeds.",
                "In our implementation below, we will write a pure Python tensor simulation of Multi-Query Attention. We will construct the projection tensors, perform broadcasting of the single Key and Value heads across all Query heads, execute scaled dot-product attention, and demonstrate how the output preserves multi-head dimensional compatibility while drastically shrinking cached activations."
            ],
            "example": "Consider a bustling courtroom with 16 prosecuting attorneys (Query heads). Under MHA, each attorney demands their own personal witness stand and testimony stenographer, creating 16 simultaneous shouting interrogations. Under MQA, there is only one official witness stand and one court reporter (single KV head) sitting in the center. All 16 attorneys listen to the exact same testimony, but each attorney takes notes on different legal angles according to their specific assignment.",
            "code": """import math

def softmax(vec):
    max_val = max(vec)
    exp_vals = [math.exp(v - max_val) for v in vec]
    sum_exp = sum(exp_vals)
    return [v / sum_exp for v in exp_vals]

def dot(a, b):
    return sum(x * y for x, y in zip(a, b))

n_query_heads = 4
d_head = 4
seq_len = 3

q_heads = [
    [[1.0, 0.0, 1.0, 0.0], [0.0, 1.0, 0.0, 1.0], [1.0, 1.0, 0.0, 0.0]],
    [[0.5, 0.5, 0.0, 0.0], [0.0, 0.0, 1.0, 1.0], [0.2, 0.8, 0.1, 0.0]],
    [[1.0, 0.0, 0.0, 1.0], [0.0, 1.0, 1.0, 0.0], [0.5, 0.5, 0.5, 0.5]],
    [[0.1, 0.9, 0.0, 0.0], [0.8, 0.2, 0.0, 0.0], [0.0, 0.0, 0.5, 0.5]],
]

shared_k = [[1.0, 0.0, 0.0, 1.0], [0.0, 1.0, 1.0, 0.0], [1.0, 1.0, 0.0, 0.0]]
shared_v = [[10.0, 0.0, 0.0, 0.0], [0.0, 20.0, 0.0, 0.0], [0.0, 0.0, 30.0, 0.0]]

scale = 1.0 / math.sqrt(d_head)
mqa_outputs = []

target_idx = 2
for h in range(n_query_heads):
    q_vec = q_heads[h][target_idx]
    scores = [dot(q_vec, k_vec) * scale for k_vec in shared_k]
    weights = softmax(scores)
    out_dim = len(shared_v[0])
    head_out = [sum(weights[t] * shared_v[t][i] for t in range(seq_len)) for i in range(out_dim)]
    mqa_outputs.append([round(v, 2) for v in head_out])

print(f"MQA Query Heads: {n_query_heads}, Shared KV Heads: 1")
print(f"KV Compression Ratio: {n_query_heads}x")
for h, out in enumerate(mqa_outputs):
    print(f"  Head {h} Output Vector: {out}")
""",
            "output": """MQA Query Heads: 4, Shared KV Heads: 1
KV Compression Ratio: 4x
  Head 0 Output Vector: [2.74, 5.48, 13.56, 0.0]
  Head 1 Output Vector: [2.56, 7.26, 11.44, 0.0]
  Head 2 Output Vector: [3.33, 6.67, 10.0, 0.0]
  Head 3 Output Vector: [3.6, 7.2, 8.41, 0.0]""",
            "codeNotes": [
                "Line 11-14: Configures 4 independent query heads alongside a single shared key head and value head.",
                "Line 21-22: `shared_k` and `shared_v` are defined once and broadcast across all 4 query heads.",
                "Line 28-30: Each query head computes independent dot products against the identical shared key vectors.",
                "Line 36-39: Confirms that 4 distinct contextual output vectors are produced from a single shared KV cache."
            ],
            "tryIt": "Add a fifth query head with distinct query weights and verify that it evaluates over the exact same shared_k and shared_v tensors without expanding the KV cache.",
            "check": {
                "question": "What is the primary operational trade-off introduced when replacing Multi-Head Attention (MHA) with Multi-Query Attention (MQA)?",
                "options": [
                    "MQA reduces KV-cache memory footprint and memory bandwidth consumption by a factor of H, but can degrade model capacity and perplexity because all Query heads share a single Key-Value representation subspace.",
                    "MQA increases inference latency by requiring quadratic matrix inversions across the shared Key tensor.",
                    "MQA eliminates the need for Query projection matrices, forcing tokens to be represented as one-hot sparse vectors.",
                    "MQA requires doubling the feed-forward network dimensions to compensate for the absence of positional encodings."
                ],
                "answer": 0,
                "answerIndex": 0,
                "why": "MQA slashes KV-cache memory and bandwidth by a factor of H by sharing 1 KV head across all H Query heads. However, forcing all Query heads to attend over a single shared subspace reduces modeling capacity on complex, multi-faceted reasoning tasks.",
                "explanation": "MQA slashes KV-cache memory and bandwidth by a factor of H by sharing 1 KV head across all H Query heads. However, forcing all Query heads to attend over a single shared subspace reduces modeling capacity on complex, multi-faceted reasoning tasks."
            }
        },
        {
            "title": "Grouped-Query Attention (GQA): Interpolating MHA and MQA with Head Groups",
            "say": [
                "Between the extremes of Multi-Head Attention (which preserves full capacity but incurs crippling memory overhead) and Multi-Query Attention (which maximizes memory efficiency but risks modeling degradation), there lies an elegant mathematical interpolation. In 2023, Joshua Ainslie and colleagues at Google Research published 'GQA: Training Generalized Multi-Query Transformer Models from Multi-Head Checkpoints'. Grouped-Query Attention (GQA) has since emerged as the indisputable industry standard, adopted by LLaMA-2 70B, LLaMA-3, Mistral 7B, Mixtral 8x7B, and Qwen 2.",
                "The core insight of Grouped-Query Attention is simple: instead of maintaining H separate KV heads (MHA) or collapsing down to 1 KV head (MQA), we partition the H Query heads into G distinct groups, where each group contains H / G Query heads. Each group is allocated exactly one dedicated Key head and one dedicated Value head. Thus, the model maintains H Query heads and G Key/Value heads, where 1 < G < H.",
                "Notice the mathematical continuum established by GQA. When G = H, every Query head has its own Key and Value head; GQA becomes identical to standard Multi-Head Attention. When G = 1, all Query heads belong to a single global group sharing one Key and Value head; GQA collapses into Multi-Query Attention. When G is set to an intermediate value—such as G = 8 for a model with H = 64 Query heads (an 8:1 ratio)—we achieve an 8x reduction in KV-cache memory while retaining 8 distinct semantic Key-Value subspaces.",
                "Empirical evaluations across planetary-scale foundation models reveal that GQA achieves a remarkable sweet spot on the Pareto efficiency frontier. At an 8:1 query-to-group ratio, GQA recovers virtually 99.5% to 100% of the benchmark accuracy, reasoning fidelity, and perplexity of full MHA, while simultaneously capturing almost all the inference latency and memory compression benefits of MQA. Models can serve 4x to 8x larger batch sizes within the same VRAM envelope, completely transforming the economics of high-throughput model hosting.",
                "During forward execution, the GQA layer projects the input tensor X into Query tensor Q of shape [batch, seq_len, H, d_head], Key tensor K of shape [batch, seq_len, G, d_head], and Value tensor V of shape [batch, seq_len, G, d_head]. Before computing dot-product attention scores, the Key and Value tensors are expanded along the head dimension by repeating each of the G heads (H / G) times. In optimized GPU kernels, this expansion is performed virtually in on-chip SRAM or registers without materializing redundant copies in HBM.",
                "Another critical advantage of GQA is 'uptraining'. An engineering team that previously pre-trained a massive, expensive foundation model using standard MHA does not need to re-train from scratch to deploy with GQA. Ainslie et al. demonstrated that by taking an existing MHA checkpoint, pooling or mean-averaging the Key and Value projection weights within each group, and fine-tuning on a small fraction (e.g., 5%) of the original pre-training tokens, the model rapidly adapts to GQA with zero loss in downstream performance.",
                "To understand GQA at the tensor level, consider a concrete architectural configuration: 8 Query heads and 2 Key-Value groups (a 4:1 grouping ratio). Query heads 0, 1, 2, and 3 belong to Group 0 and attend to Key-Value Head 0. Query heads 4, 5, 6, and 7 belong to Group 1 and attend to Key-Value Head 1. In this setup, Group 0 can specialize in local syntactic parsing while Group 1 specializes in long-range thematic discourse, preserving representational diversity without requiring 8 independent KV streams.",
                "In the following code block, we will implement a fully functional pure Python Grouped-Query Attention layer. We will project input embeddings into grouped heads, demonstrate the group-wise repeating mechanism, compute scaled dot-product attention scores within groups, and verify the resulting tensor dimensions and memory savings."
            ],
            "example": "Imagine a hospital intensive care unit with 32 specialist physicians (Query heads). In MHA, each doctor has their own dedicated nurse, overflowing the hallways with 32 nurses. In MQA, all 32 doctors share a single overworked nurse, leading to medical oversights. In GQA, the doctors are divided into 4 specialized clinical squads of 8 doctors each (cardiac, neurology, trauma, pediatrics); each squad shares one highly trained lead specialist nurse (KV head). Communication remains fast, hallways stay clear, and domain specialization is preserved.",
            "code": """import math

def softmax(vec):
    max_val = max(vec)
    exp_vals = [math.exp(v - max_val) for v in vec]
    sum_exp = sum(exp_vals)
    return [v / sum_exp for v in exp_vals]

def dot(a, b):
    return sum(x * y for x, y in zip(a, b))

n_query_heads = 8
n_kv_heads = 2
group_size = n_query_heads // n_kv_heads
d_head = 4
seq_len = 2

q_heads = [[[float(h + s + d) for d in range(d_head)] for s in range(seq_len)] for h in range(n_query_heads)]

k_heads = [
    [[1.0, 0.0, 1.0, 0.0], [0.0, 1.0, 0.0, 1.0]],
    [[0.5, 0.5, 0.0, 0.0], [0.0, 0.0, 0.5, 0.5]]
]
v_heads = [
    [[10.0, 0.0, 0.0, 0.0], [0.0, 20.0, 0.0, 0.0]],
    [[0.0, 0.0, 30.0, 0.0], [0.0, 0.0, 0.0, 40.0]]
]

scale = 1.0 / math.sqrt(d_head)
gqa_outputs = []

token_idx = 1
for q_idx in range(n_query_heads):
    group_idx = q_idx // group_size
    assigned_k = k_heads[group_idx]
    assigned_v = v_heads[group_idx]
    
    q_vec = q_heads[q_idx][token_idx]
    scores = [dot(q_vec, assigned_k[t]) * scale for t in range(seq_len)]
    weights = softmax(scores)
    
    out_dim = len(assigned_v[0])
    head_out = [sum(weights[t] * assigned_v[t][i] for t in range(seq_len)) for i in range(out_dim)]
    gqa_outputs.append([round(v, 2) for v in head_out])

print(f"GQA Configuration: {n_query_heads} Q heads, {n_kv_heads} KV heads (Group Size: {group_size})")
print(f"KV-Cache Memory Footprint Reduction vs MHA: {n_query_heads / n_kv_heads:.1f}x")
print(f"Query Head 0 (Group 0) Output: {gqa_outputs[0]}")
print(f"Query Head 3 (Group 0) Output: {gqa_outputs[3]}")
print(f"Query Head 4 (Group 1) Output: {gqa_outputs[4]}")
print(f"Query Head 7 (Group 1) Output: {gqa_outputs[7]}")
""",
            "output": """GQA Configuration: 8 Q heads, 2 KV heads (Group Size: 4)
KV-Cache Memory Footprint Reduction vs MHA: 4.0x
Query Head 0 (Group 0) Output: [2.69, 14.62, 0.0, 0.0]
Query Head 3 (Group 0) Output: [2.69, 14.62, 0.0, 0.0]
Query Head 4 (Group 1) Output: [0.0, 0.0, 8.07, 29.24]
Query Head 7 (Group 1) Output: [0.0, 0.0, 8.07, 29.24]""",
            "codeNotes": [
                "Line 11-13: Defines 8 Query heads mapped to 2 KV heads, establishing group size of 4.",
                "Line 19-26: Only 2 Key heads and 2 Value heads are instantiated, cutting KV memory by 4x.",
                "Line 34-37: Assigns each Query head to its corresponding KV group using integer division `q_idx // group_size`.",
                "Line 48-51: Confirms that Query heads within Group 0 attend to Group 0 KV, while Query heads in Group 1 attend to Group 1 KV."
            ],
            "tryIt": "Modify n_query_heads to 16 and n_kv_heads to 4 (a 4:1 ratio) and verify that the group size remains 4 while supporting 16 distinct query perspectives.",
            "check": {
                "question": "Why has Grouped-Query Attention (GQA) with an intermediate grouping ratio (e.g., 8:1) been universally embraced over both MHA and MQA in modern LLMs like LLaMA 3?",
                "options": [
                    "It achieves the optimal Pareto frontier, recovering virtually 100% of MHA modeling capacity and benchmark performance while reducing KV-cache memory bandwidth and VRAM footprint by 8x.",
                    "Because GQA completely removes the need for matrix multiplication on GPU Tensor Cores.",
                    "Because GQA enforces absolute sinusoidal positional encodings without floating point arithmetic.",
                    "To prevent Query heads from attending to past tokens during pre-training."
                ],
                "answer": 0,
                "answerIndex": 0,
                "why": "GQA provides the best of both worlds: by grouping query heads to share a smaller number of KV heads, it recovers almost all the representational quality of MHA while achieving up to an 8x reduction in KV-cache memory and bandwidth.",
                "explanation": "GQA provides the best of both worlds: by grouping query heads to share a smaller number of KV heads, it recovers almost all the representational quality of MHA while achieving up to an 8x reduction in KV-cache memory and bandwidth."
            }
        },
        {
            "title": "Sliding Window Attention (SWA): Capping Context Receptive Fields",
            "say": [
                "While Grouped-Query Attention addresses the hidden dimension multiplier (H_kv) in the KV-cache equation, there remains a second, even more dangerous linear scaling factor: sequence length L. In standard full self-attention, as context windows expand from 4,096 to 32,768 and onwards to 128,000 tokens, every single token must attend to every preceding token. The KV-cache length grows without bound, and the attention computation scales quadratically as O(L^2). To tame sequence length scaling, foundation model architects turn to Sliding Window Attention (SWA).",
                "Sliding Window Attention was popularized in models like Longformer (Beltagy et al., 2020) and achieved mainstream prominence through Mistral 7B (Jiang et al., 2023). The fundamental intuition of SWA is that in human natural language, semantic dependencies exhibit strong local clustering. A token's grammatical role, syntactic agreement, and immediate semantic meaning are overwhelmingly determined by its nearby neighbors, rather than by a word that appeared 10,000 tokens prior.",
                "In Sliding Window Attention, a fixed window size W is established (for example, W = 4,096 tokens in Mistral 7B). At any layer l, token position i is permitted to attend only to tokens located within the interval [i - W + 1, i]. Any token at position j < i - W is strictly masked out with negative infinity prior to softmax normalization, receiving zero attention weight. Consequently, each token attends to at most W keys, reducing the compute and memory complexity of the attention operation from quadratic O(L^2) down to linear O(L * W).",
                "At first glance, one might assume that restricting attention to a local window of size W prevents the model from reasoning about long-range dependencies across distant paragraphs. This assumption overlooks the profound mathematical effect of multi-layer neural network depth. In a Transformer with n_layers stacked decoder layers, receptive fields compound hierarchically through the network.",
                "Consider Layer 1: token position i attends to tokens back to i - W. Now consider Layer 2: the representation of token i - W at Layer 1 has already aggregated information from tokens back to (i - W) - W = i - 2W. When token i attends to token i - W at Layer 2, it indirectly absorbs context from 2W tokens in the past. By induction, across a network of L layers, the effective theoretical receptive field of token i at layer L extends across a context span of exactly L * W tokens. In a 32-layer model with a sliding window of W = 4,096, the effective receptive field encompasses 32 * 4,096 = 131,072 tokens!",
                "From a systems and inference engineering perspective, Sliding Window Attention unlocks an extraordinary hardware optimization: the Rolling Buffer KV-Cache. In standard attention, the KV-cache must continuously allocate new memory blocks in HBM as the sequence length increases. Under SWA, because token i never attends to keys older than i - W, keys and values older than W steps are permanently dead and can be discarded.",
                "We can implement the KV-cache as a fixed-size circular rolling buffer of physical length W. When token t is generated, its Key and Value vectors are written into the cache at index (t mod W). The new token overwrites the obsolete key-value data from position t - W. The cache memory footprint per sequence is strictly capped at 2 * 2 * n_layers * H_kv * d_head * W bytes, completely decoupling KV-cache VRAM consumption from total generation length. A model can stream millions of continuous tokens without ever suffering an Out-Of-Memory crash.",
                "In our implementation below, we will build a pure Python Sliding Window Attention simulator equipped with a rolling circular buffer. We will enforce causal sliding window masking, demonstrate how circular buffer overwriting functions at step t, and verify that attention computation operates in bounded O(W) memory."
            ],
            "example": "Imagine an express conveyor belt inspection station with a sliding magnifying glass that only shows the last 4 widgets passing by (window W = 4). An inspector does not need an infinite warehouse to store thousands of inspected widgets; they only keep the last 4 widgets on their desk. As a 5th widget arrives, the 1st widget drops into a finished bin and its slot on the desk is reused. Information from the earliest widgets has already been summarized into the current assembly state.",
            "code": """import math

def softmax(vec):
    max_val = max(vec)
    exp_vals = [math.exp(v - max_val) for v in vec]
    sum_exp = sum(exp_vals)
    return [v / sum_exp for v in exp_vals]

def dot(a, b):
    return sum(x * y for x, y in zip(a, b))

window_size = 3
d_head = 4

class RollingKVCache:
    def __init__(self, window_size: int, d_head: int):
        self.W = window_size
        self.d = d_head
        self.k_buffer = [[0.0] * d_head for _ in range(window_size)]
        self.v_buffer = [[0.0] * d_head for _ in range(window_size)]
        self.total_tokens_seen = 0

    def append(self, k_vec: list, v_vec: list):
        slot = self.total_tokens_seen % self.W
        self.k_buffer[slot] = list(k_vec)
        self.v_buffer[slot] = list(v_vec)
        self.total_tokens_seen += 1

    def get_valid_kv(self):
        valid_count = min(self.total_tokens_seen, self.W)
        keys, values = [], []
        start_step = self.total_tokens_seen - valid_count
        for step in range(start_step, self.total_tokens_seen):
            slot = step % self.W
            keys.append(self.k_buffer[slot])
            values.append(self.v_buffer[slot])
        return keys, values

cache = RollingKVCache(window_size=3, d_head=4)
token_keys = [[float(i + 1)] * 4 for i in range(6)]
token_vals = [[float((i + 1) * 10)] * 4 for i in range(6)]

scale = 1.0 / math.sqrt(d_head)
q_vec = [1.0, 1.0, 1.0, 1.0]

print(f"Sliding Window Attention (Window W = {window_size})")
for t in range(6):
    cache.append(token_keys[t], token_vals[t])
    active_k, active_v = cache.get_valid_kv()
    
    scores = [dot(q_vec, k) * scale for k in active_k]
    weights = softmax(scores)
    out = [sum(weights[i] * active_v[i][d] for i in range(len(active_k))) for d in range(d_head)]
    
    active_tokens = [t - len(active_k) + 1 + i for i in range(len(active_k))]
    print(f"Token t={t}: Active Window Tokens={active_tokens}, Cache Size={len(active_k)} (Max={window_size})")
""",
            "output": """Sliding Window Attention (Window W = 3)
Token t=0: Active Window Tokens=[0], Cache Size=1 (Max=3)
Token t=1: Active Window Tokens=[0, 1], Cache Size=2 (Max=3)
Token t=2: Active Window Tokens=[0, 1, 2], Cache Size=3 (Max=3)
Token t=3: Active Window Tokens=[1, 2, 3], Cache Size=3 (Max=3)
Token t=4: Active Window Tokens=[2, 3, 4], Cache Size=3 (Max=3)
Token t=5: Active Window Tokens=[3, 4, 5], Cache Size=3 (Max=3)""",
            "codeNotes": [
                "Line 14-22: `RollingKVCache` initializes fixed-size buffers of length W, eliminating unbounded memory growth.",
                "Line 20: Slot index is determined via modulo arithmetic: `slot = total_tokens_seen % self.W`.",
                "Line 27-33: `get_valid_kv` reconstructs the active sliding window from oldest to newest token.",
                "Line 46-53: Confirms that as generation progresses from t=0 to t=5, active cache size never exceeds W=3."
            ],
            "tryIt": "Increase window_size W from 3 to 4 and observe how the rolling cache retains 4 active historical tokens before overwriting.",
            "check": {
                "question": "How does Sliding Window Attention (SWA) maintain multi-layer information propagation while bounding cache memory to O(W)?",
                "options": [
                    "Each individual layer attends only to the preceding W tokens, but stacking L layers allows token representations to propagate context across a cumulative receptive field of L * W tokens.",
                    "Because SWA stores all historical tokens permanently in the CPU host memory via PCIe bus interrupts.",
                    "Because SWA relies on external recurrent hidden states that bypass the attention mechanism entirely.",
                    "Because the sliding window dynamically doubles in size whenever sequence perplexity exceeds 10.0."
                ],
                "answer": 0,
                "answerIndex": 0,
                "why": "Although each layer only attends locally to W tokens, stacking L transformer layers allows information to propagate hierarchically, yielding an effective receptive field of L * W tokens while strictly capping each layer's KV-cache to W tokens.",
                "explanation": "Although each layer only attends locally to W tokens, stacking L transformer layers allows information to propagate hierarchically, yielding an effective receptive field of L * W tokens while strictly capping each layer's KV-cache to W tokens."
            }
        },
        {
            "title": "Production Benchmarking: Memory Footprint, Serving Concurrency & Latency Verification",
            "say": [
                "In this final capstone section of Day 31, we synthesize our architectural analysis into an empirical production benchmark. As a foundation model systems architect, you will frequently be tasked with presenting infrastructure capacity plans to executive engineering leadership. You must be able to translate theoretical attention mechanics—MHA, GQA, and MQA—into concrete financial and operational metrics: gigabytes of VRAM consumed, maximum concurrent user streams supported per server, and serving cost per million tokens.",
                "To ground our analysis in industrial reality, let us evaluate an enterprise deployment of a 70-billion parameter foundation model with the canonical LLaMA architecture: n_layers = 80, hidden_dim = 8,192, n_query_heads = 64, and head_dim = 128. The model parameters themselves require approximately 140 gigabytes of VRAM when loaded in 16-bit half precision (FP16/BF16). On a standard HGX node equipped with eight 80GB NVIDIA A100 or H100 GPUs (providing 640 gigabytes of total VRAM), after allocating 140 GB for weights and 20 GB for runtime activation buffers, exactly 480 gigabytes of VRAM remain available for the KV-cache.",
                "Now let us benchmark our three attention variants under an enterprise workload demanding a context length of L = 8,192 tokens per request. In Multi-Head Attention (MHA), H_kv = 64. Each token across the 80 layers requires: 2 * 80 layers * 64 heads * 128 dim * 2 bytes = 2,621,440 bytes (~2.50 MB) per token. For an 8,192-token sequence, one single user request consumes exactly 20.0 gigabytes of KV-cache memory! Within our 480 GB budget, MHA can support a maximum of only 24 concurrent user streams before the cluster experiences a catastrophic Out-Of-Memory fault.",
                "Next, consider Grouped-Query Attention (GQA) with an 8:1 grouping ratio (H_kv = 8), as deployed in LLaMA-3 70B. The KV-cache footprint per token collapses by 8x to: 2 * 80 * 8 * 128 * 2 = 327,680 bytes (~0.3125 MB) per token. A full 8,192-token context consumes only 2.50 gigabytes per sequence. Within the exact same 480 GB memory pool, GQA effortlessly supports 192 concurrent user streams—an immediate 8.0x increase in serving throughput with zero hardware investment and virtually identical model quality.",
                "Finally, consider Multi-Query Attention (MQA) with H_kv = 1. The KV-cache footprint drops by 64x to just 40,960 bytes (~0.039 MB) per token, consuming a mere 0.312 gigabytes per 8,192-token sequence. MQA can support up to 1,536 concurrent streams. However, as noted in Part 2, for general-purpose 70B reasoning, the capacity penalty of MQA makes GQA the undisputed choice for frontier models.",
                "Beyond static memory allocation, we must evaluate serving latency dynamics. During autoregressive decoding, time-per-token (TPT) latency is directly proportional to the total bytes read from HBM. Under MHA, generating a token for 24 users requires reading 140 GB of weights plus 480 GB of KV-cache = 620 GB per step. On an A100 node with 16 TB/s aggregate bandwidth across 8 GPUs, this yields a theoretical memory read time of 38.7 milliseconds per token. Under GQA with 24 users, the KV-cache read drops from 480 GB to 60.0 GB, slashing memory read time down to 12.5 milliseconds—a 3.1x reduction in user-perceived decoding latency.",
                "This quantitative reality highlights why modern LLM serving engines like vLLM, TensorRT-LLM, and TGI treat GQA and PagedAttention as non-negotiable architectural requirements. An enterprise deploying MHA is effectively paying an 800% infrastructure tax compared to a competitor serving an equivalent GQA architecture. By eliminating redundant key-value activations, engineers maximize both throughput and latency while staying comfortably within GPU thermal and memory boundaries.",
                "In the following production benchmark script, we will implement an automated infrastructure capacity analyzer. It will model the exact VRAM consumption, maximum concurrency thresholds, and memory bandwidth latency for MHA, GQA, and MQA, outputting an executive engineering ledger comparing all three architectures."
            ],
            "example": "Imagine a commercial airline company configuring its aircraft seating. MHA is like giving every passenger a private four-room hotel suite inside the airplane; the flight is luxurious, but only 24 passengers fit per flight, tickets cost $10,000, and the airline loses money. GQA is like high-efficiency modern business class; passengers enjoy 99% of the comfort and legroom, but 192 passengers fit per flight, slashing operating costs by 80% while keeping flights profitable.",
            "code": """def benchmark_serving_capacity(
    model_name: str,
    n_layers: int,
    n_q_heads: int,
    n_kv_heads: int,
    d_head: int,
    context_len: int,
    available_kv_vram_gb: float
) -> dict:
    bytes_per_token = 2 * n_layers * n_kv_heads * d_head * 2
    kv_per_seq_gb = (bytes_per_token * context_len) / (1024 ** 3)
    max_concurrency = int(available_kv_vram_gb / kv_per_seq_gb)
    
    return {
        "architecture": model_name,
        "n_kv_heads": n_kv_heads,
        "bytes_per_token": bytes_per_token,
        "kv_per_seq_gb": round(kv_per_seq_gb, 3),
        "max_concurrent_requests": max_concurrency
    }

kv_budget = 480.0
seq_len = 8192

mha = benchmark_serving_capacity("70B Multi-Head (MHA)", 80, 64, 64, 128, seq_len, kv_budget)
gqa = benchmark_serving_capacity("70B Grouped-Query (GQA 8:1)", 80, 64, 8, 128, seq_len, kv_budget)
mqa = benchmark_serving_capacity("70B Multi-Query (MQA)", 80, 64, 1, 128, seq_len, kv_budget)

print(f"=== 70B SERVING BENCHMARK (Context: {seq_len}, Available VRAM: {kv_budget} GB) ===")
for res in [mha, gqa, mqa]:
    ratio = mha['kv_per_seq_gb'] / res['kv_per_seq_gb']
    print(f"{res['architecture']:<28} | KV/Seq: {res['kv_per_seq_gb']:>6} GB | Max Streams: {res['max_concurrent_requests']:>4} | Speedup: {ratio:>4.1f}x")
""",
            "output": """=== 70B SERVING BENCHMARK (Context: 8192, Available VRAM: 480.0 GB) ===
70B Multi-Head (MHA)         | KV/Seq:   20.0 GB | Max Streams:   24 | Speedup:  1.0x
70B Grouped-Query (GQA 8:1)  | KV/Seq:    2.5 GB | Max Streams:  192 | Speedup:  8.0x
70B Multi-Query (MQA)        | KV/Seq:  0.312 GB | Max Streams: 1536 | Speedup: 64.1x""",
            "codeNotes": [
                "Line 9-11: Computes exact memory per sequence in GB as `(bytes_per_token * context_len) / 1024^3`.",
                "Line 12: Determines maximum serving concurrency supported within available VRAM budget.",
                "Line 24-26: Evaluates canonical 70B model with 80 layers and head_dim 128 across 64, 8, and 1 KV heads.",
                "Line 29-32: Proves GQA enables an 8.0x increase in serving capacity (from 24 to 192 concurrent streams) over MHA."
            ],
            "tryIt": "Reduce available_kv_vram_gb to 80.0 (a single GPU) and observe how MHA can only serve 4 concurrent users at 8K context while GQA serves 32.",
            "check": {
                "question": "In an 80-layer, 64-head 70B parameter model operating at sequence length 8,192 in FP16, why does transitioning from MHA to GQA (8 KV heads) enable an 8x increase in serving concurrency?",
                "options": [
                    "The KV-cache memory footprint per token drops by a factor of 8 from 64 heads to 8 heads, freeing massive GPU VRAM previously saturated by redundant key-value activations.",
                    "Because GQA reduces the number of Transformer layers from 80 down to 10.",
                    "Because GQA compresses floating-point representations into 2-bit integers during runtime execution.",
                    "Because GQA transfers model weights to the client browser to eliminate server-side VRAM consumption."
                ],
                "answer": 0,
                "answerIndex": 0,
                "why": "In GQA with 8 KV heads, the KV-cache storage per token scales strictly with the number of KV heads (8 instead of 64). This reduces memory consumption by 8x, allowing 8x more concurrent sequences to fit into GPU memory.",
                "explanation": "In GQA with 8 KV heads, the KV-cache storage per token scales strictly with the number of KV heads (8 instead of 64). This reduces memory consumption by 8x, allowing 8x more concurrent sequences to fit into GPU memory."
            }
        }
    ]
}
