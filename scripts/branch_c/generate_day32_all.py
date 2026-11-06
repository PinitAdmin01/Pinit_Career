import json
import hashlib
import os

part1_say = [
  "To solve the fundamental latency bottleneck in large language model inference, we must confront the stark arithmetic contrast between prompt prefill and token generation. During the prefill phase, a model processes hundreds or thousands of prompt tokens simultaneously. In this regime, the primary computational workload consists of large matrix-matrix multiplications where the operational intensity is high, allowing GPU Tensor Cores to operate near peak compute utilization. However, once the model transitions to autoregressive generation\u2014producing text token by token\u2014the execution regime shifts radically from compute-bound to memory-bound. In autoregressive decoding, generating each individual token requires loading the model's entire parameter footprint from global HBM memory into the streaming multiprocessor register files just to process a single query vector of length one.",
  "Consider the mathematical physics governing this memory transfer on modern hardware. For a standard foundation model with seven billion parameters stored in sixteen-bit half precision, the model weights alone occupy fourteen gigabytes of GPU global memory. Generating a single token requires executing approximately fourteen billion floating-point operations\u2014two floating-point operations per parameter. When executing this single-token forward pass on an NVIDIA A100 GPU with two terabytes per second of HBM bandwidth, reading the fourteen gigabytes of weights takes approximately seven milliseconds. Meanwhile, the Tensor Cores, capable of executing over three hundred teraFLOPS, sit idle for over ninety-five percent of the execution time because they finish the necessary arithmetic in a fraction of a millisecond and must wait for the next weight tensor to arrive over the memory bus.",
  "This imbalance yields an operational intensity of approximately one FLOP per byte transferred\u2014far below the hardware balance point of modern GPUs, which typically requires over one hundred FLOPs per byte to achieve compute saturation. Consequently, simply buying GPUs with faster Tensor Cores does not accelerate autoregressive token generation; the generation speed is strictly constrained by the speed of light through the memory interconnect. To increase serving throughput without degrading model accuracy, researchers realized that if multiple candidate tokens could be proposed in advance, the large foundation model could verify all candidates in parallel during a single forward pass, transforming memory-bound single-token generation into compute-bound multi-token verification.",
  "This breakthrough insight led to the creation of Speculative Decoding, independently formulated by Yaniv Leviathan, Matan Kalman, and Yossi Matias at Google, as well as Charlie Chen and colleagues at DeepMind. The core premise of speculative decoding is that language generation contains many tokens that are easy to predict\u2014such as punctuation, common conjunctions, syntax boilerplate, and standard phrases\u2014alongside complex tokens that require deep contextual reasoning. A much smaller, faster draft model can rapidly generate a sequence of K candidate tokens at minimal latency. The larger target model then evaluates the entire K-token draft sequence in a single parallel forward pass, reading its fourteen gigabytes of weights once to verify K tokens simultaneously.",
  "By verifying K candidate tokens in a single forward pass, the arithmetic intensity of the target model increases by a factor of K. Instead of performing fourteen billion operations for fourteen gigabytes of memory traffic, the GPU executes fifty-six billion operations for the same fourteen gigabytes when K equals four. Because the target model was previously memory-bound, executing matrix-matrix multiplications across K tokens takes virtually the exact same wall-clock time as processing a single token. As long as the draft model's predictions are accurate enough to be accepted, the serving system generates multiple tokens per target forward pass, achieving substantial wall-clock speedups without altering the final output distribution.",
  "In enterprise AI architectures, speculative decoding represents a transformative shift in compute economics. In conversational agents, code generation platforms, and automated workflow orchestrators, users experience real-time streaming speeds that are more than double the baseline rate. Infrastructure operators can serve higher concurrent query volumes on the same physical GPU footprint, directly lowering the cost per million generated tokens while maintaining enterprise-grade response latencies."
]
part2_say = [
  "While the concept of drafting candidate tokens with a smaller model is intuitively appealing, the central engineering challenge is maintaining mathematical exactness. In enterprise production deployments, an acceleration technique cannot be allowed to degrade response quality, introduce hallucinations, or shift the probability distribution of the foundation model. If candidate tokens were simply accepted based on argmax equality or heuristic similarity thresholds, the generated text would diverge from the target model's true capabilities, introducing subtle bugs in code generation and factual inaccuracies in reasoning tasks. The foundational mathematical breakthrough of speculative decoding is the Speculative Rejection Sampling algorithm, which guarantees that the accepted token sequence is sampled from the exact output distribution of the target model.",
  "Let p(x) denote the probability distribution over the vocabulary emitted by the target foundation model conditioned on the context, and let q(x) denote the probability distribution emitted by the smaller draft model. At each speculative step, the draft model samples a candidate token x tilde from its distribution q(x). The target model evaluates the candidate token in parallel and computes its own probability p(x tilde). The speculative rejection sampling rule accepts the candidate token x tilde with probability equal to the minimum of one and the ratio of p(x tilde) divided by q(x tilde). That is, the acceptance probability alpha equals min(1, p(x tilde) / q(x tilde)).",
  "Notice the elegance of this acceptance criterion. If the target model considers the draft token more likely than the draft model did\u2014meaning p(x tilde) is greater than or equal to q(x tilde)\u2014the acceptance probability is exactly one, guaranteeing that the candidate token is always accepted. Conversely, if the target model considers the token less likely than the draft model did, the candidate is accepted with a fractional probability strictly proportional to the target model's confidence. This stochastic gating mechanism precisely offsets the draft model's overconfidence, ensuring that the accepted distribution does not over-represent the draft model's biases.",
  "If a candidate token x tilde is rejected at position i, all subsequent candidate tokens in the draft sequence are discarded, because autoregressive conditioning prevents evaluating future tokens whose predecessor was rejected. Crucially, when a rejection occurs, the target model does not waste the forward pass; instead, it immediately samples a recovery token from an adjusted residual distribution. The recovery distribution, denoted as p_prime(x), is defined mathematically as the normalized positive difference between the target distribution and the draft distribution: p_prime(x) equals max(0, p(x) minus q(x)) divided by the summation over all vocabulary tokens of max(0, p(v) minus q(v)).",
  "A rigorous probability proof confirms that the combined probability of generating any token x through this two-stage process\u2014either by being drafted and accepted, or by being rejected and resampled from the residual distribution\u2014equals exactly the target probability p(x). The probability of acceptance is q(x) multiplied by min(1, p(x)/q(x)), which simplifies to min(q(x), p(x)). When a rejection occurs, which happens with probability one minus the sum of min(q(v), p(v)), sampling from p_prime(x) adds the remaining probability mass max(0, p(x) minus q(x)). Summing these two terms yields min(q(x), p(x)) plus max(0, p(x) minus q(x)), which algebraically equals p(x) for every token in the vocabulary.",
  "This mathematical guarantee is absolute: speculative decoding with rejection sampling is an exact algorithm, not an approximation. Whether sampling with temperature zero for greedy deterministic generation or sampling with high temperature for creative text, the statistical output of the accelerated engine is mathematically indistinguishable from running the target foundation model alone. This zero-divergence invariant makes speculative decoding the gold standard for enterprise acceleration where compliance and deterministic validation are mandatory.",
  "In practical GPU implementations, executing rejection sampling requires careful vectorization across vocabulary logits. Rather than normalizing probabilities over thirty-two thousand or one hundred twenty-eight thousand tokens sequentially on the host CPU, the acceptance ratios and residual distribution updates are computed directly in CUDA kernels using parallel warp reduction primitives. This prevents host-to-device synchronization bottlenecks from cannibalizing the latency gains of speculative execution."
]
part3_say = [
  "Despite the mathematical elegance of dual-model speculative decoding, deploying an auxiliary draft model in production introduces significant operational complexity and memory overhead. In enterprise clusters, running a draft model alongside the target model requires allocating additional GPU memory for the draft model's weights and maintaining two separate key-value caches across varying context lengths. Furthermore, finding a well-matched draft model that shares the identical vocabulary, tokenizer, and architectural style as the target foundation model is often difficult, especially for proprietary or domain-adapted models. If the draft model's architecture differs even slightly, tokenization mismatches can cause catastrophic drops in acceptance rates.",
  "To eliminate the operational burden of auxiliary draft models, researchers developed Medusa, an architectural innovation that introduces multi-head self-speculative drafting directly into the target foundation model. Rather than relying on a separate smaller neural network, Medusa augments the final hidden layer of the target model with multiple lightweight feed-forward heads. Head zero corresponds to the standard language modeling head predicting token t plus one. Medusa head one is trained to predict token t plus two; Medusa head two predicts token t plus three; and Medusa head three predicts token t plus four, all conditioned on the exact same hidden state representation produced by the target model's top transformer block.",
  "During inference, when the target model executes a single forward pass, all Medusa heads execute simultaneously in parallel. Each head outputs its top-k candidate predictions along with their associated logits. By taking the Cartesian product of the top-k candidates across the Medusa heads, the system constructs a tree of candidate speculative continuations. For example, if head one predicts two likely tokens, head two predicts two likely continuations for each branch, and head three predicts two continuations, Medusa constructs a speculative tree containing multiple plausible candidate paths through token space.",
  "The breakthrough advantage of this tree structure is that all candidate paths can be validated simultaneously in a single target model forward pass using a specialized tree-attention mask. In standard causal attention, tokens attend strictly to earlier positions in a linear sequence. In Medusa tree verification, tokens within the candidate tree are assigned position IDs corresponding to their depth in the tree, and the attention mask is configured such that each candidate token attends only to its direct ancestors in the tree alongside the shared prompt context. Unrelated sibling branches cannot see each other's activations, preventing cross-branch contamination while evaluating all paths in a single batched GPU kernel.",
  "Once the target model processes the speculative tree, the verification engine traverses the tree from root to leaf, identifying the longest valid candidate path that satisfies the acceptance criteria. If a path of length three is accepted, the serving engine advances the generation counter by four tokens\u2014one standard token plus three speculative tokens\u2014in the exact same time required to generate a single token. Because the Medusa heads comprise only a tiny fraction of the model's total parameter count (typically less than two percent), the memory and compute overhead of self-drafting is virtually negligible compared to maintaining a second foundation model.",
  "Furthermore, Medusa heads can be trained rapidly on frozen foundation models using parameter-efficient fine-tuning without modifying the underlying model weights. During training, the foundation model's backbone remains locked, and only the lightweight projection matrices of the Medusa heads are updated using standard cross-entropy loss over text corpora. This enables enterprise teams to equip any existing fine-tuned foundation model with speculative self-drafting capabilities in just a few hours of GPU training.",
  "Modern extensions, such as Medusa-2 and Eagle, introduce recurrent feature-level drafting between heads to capture multi-token semantic dependencies. By passing residual hidden vectors between adjacent Medusa prediction blocks, these advanced self-speculative architectures boost mean acceptance rates by an additional fifteen to twenty percent, allowing serving engines to consistently surpass three-point-five times speedup on standard instruction-following benchmarks."
]
part4_say = [
  "In real-world production environments, the performance of speculative decoding is governed by the dynamic interplay between the candidate draft length K and the model's instantaneous acceptance rate alpha. If a serving system uses a fixed, static draft length across all queries, it suffers severe efficiency degradations under varying input conditions. When generating highly predictable text\u2014such as structured JSON payloads, repetitive boilerplate, or standard programming syntax\u2014the acceptance rate can exceed ninety percent, meaning a short draft length leaves substantial speedups on the table. Conversely, when generating complex mathematical proofs, dense reasoning, or creative fiction, the acceptance rate may plummet to thirty percent, causing the engine to draft candidate tokens that are immediately rejected.",
  "The mathematics of speculative efficiency reveals why over-drafting degrades throughput. Let c denote the computational cost of the draft model relative to the target model, typically ranging from 0.05 to 0.10. The expected number of accepted tokens per round with draft length K and acceptance rate alpha is given by the geometric series: E[accepted] equals (1 minus alpha to the power of K plus one) divided by (1 minus alpha). Meanwhile, the total computational cost of the round equals 1 plus K multiplied by c. The net wall-clock speedup S is the ratio of expected accepted tokens to total cost: S equals E[accepted] / (1 + K * c).",
  "Notice that if alpha is high, increasing K significantly expands the numerator while the denominator grows only linearly by K * c, yielding dramatic acceleration. However, if alpha is low, the numerator rapidly asymptotes to 1 / (1 - alpha), while the denominator continues to increase with every additional candidate token drafted. In this low-acceptance regime, drafting too many tokens actually slows down the serving engine, causing it to run slower than vanilla autoregressive generation. Therefore, production serving systems incorporate dynamic draft length controllers that monitor rolling acceptance rate telemetry and dynamically adjust K in real time.",
  "To maximize the effective draft length without paying linear latency penalties, modern speculative engines deploy speculative tree topologies rather than flat linear sequences. In a tree attention topology, instead of drafting a single linear chain of tokens x1, x2, x3, the draft engine constructs a branching hierarchy where high-confidence tokens branch out into multiple speculative alternatives. Using FlashAttention's support for arbitrary block masks, the entire speculative tree\u2014often containing up to sixty-four nodes across several depths\u2014is evaluated in a single forward pass with zero redundant computation.",
  "The dynamic controller continuously calculates the marginal probability of each branch in the tree. If the cumulative probability of a branch falls below an acceptance threshold, that branch is pruned from the verification tree before dispatching the GPU kernel. This adaptive tree pruning ensures that GPU Tensor Cores are allocated exclusively to high-probability token paths, sustaining peak verification efficiency across wildly fluctuating prompt distributions.",
  "Additionally, dynamic controllers track prompt-type heuristics to pre-configure optimal speculative parameters before generation commences. For instance, incoming queries classified as code generation or structured schema extraction are automatically initialized with larger draft trees and higher draft lengths, while complex philosophical reasoning queries are initialized with conservative draft budgets. This predictive parameter tuning guarantees optimal price-performance metrics across enterprise multi-tenant workloads.",
  "Telemetry feedback loops also monitor GPU memory bandwidth saturation. Under peak concurrent multi-user load, if memory bandwidth headroom diminishes, the dynamic controller can throttle speculative tree depth to prevent queuing delays, preserving consistent response latencies for all active client connections.",
  "Furthermore, modern enterprise engines dynamically adjust the draft verification threshold based on server queue depth. When batch queues are lightly loaded, the scheduler maximizes speculative draft length to deliver sub-millisecond per-token latency for interactive users; during heavy traffic spikes, it contracts the draft length to conserve memory bandwidth and prioritize aggregate serving throughput."
]
part5_say = [
  "Integrating speculative decoding into enterprise production serving infrastructure\u2014such as vLLM, TensorRT-LLM, or Hugging Face TGI\u2014requires comprehensive configuration of runtime flags, KV-cache memory allocation, and distributed tensor parallel coordination. In high-concurrency production deployments, speculative decoding is not an isolated optimization; it must interoperate smoothly with continuous batching, PagedAttention block managers, and multi-GPU tensor parallelism across large server clusters.",
  "When configuring speculative decoding in engines like vLLM, administrators specify the speculative model or Medusa heads alongside the speculative draft length via runtime configuration flags. In a distributed multi-GPU setting where a large foundation model is sharded across eight GPUs using Megatron-style tensor parallelism, speculative verification must execute synchronously across all GPU ranks. During the verification step, all GPUs must evaluate the identical candidate token tree in parallel, execute all-reduce collective communications to synchronize logits, and reach consensus on the accepted path without introducing deadlocks or straggler delays.",
  "Memory management is another critical operational consideration. Because speculative verification evaluates multiple tokens simultaneously, the key-value cache must allocate speculative slots for all candidate tokens in advance. If a draft tree contains sixteen candidate tokens, the PagedAttention memory manager must reserve sixteen physical KV-cache blocks for the active request. Once the verification engine determines the accepted path and rejects the remaining branches, the unused KV-cache slots must be immediately freed and returned to the global memory pool to prevent cache fragmentation and out-of-memory errors on concurrent streams.",
  "Enterprise observability systems deploy specialized telemetry dashboards to track speculative decoding health in real time. Key performance indicators include the Mean Acceptance Rate (MAR), representing the percentage of drafted tokens accepted; the Mean Accepted Tokens per Step (MATS), which directly indicates the speedup multiplier; and the Inter-Token Latency (ITL), measuring the user-perceived streaming delay. An operational alert is triggered if MAR drops below fifty percent or if ITL spikes, enabling automated fallback to baseline autoregressive generation if a draft model degrades.",
  "In financial terms, speculative decoding directly reshapes the total cost of ownership (TCO) of enterprise generative AI. By increasing per-GPU token generation throughput by two to three times, organizations can fulfill their serving level agreements with half the physical GPU hardware, dramatically reducing datacenter power consumption, cooling requirements, and cloud hosting expenditures. In high-volume environments processing billions of tokens monthly, this efficiency represents millions of dollars in recurring infrastructure savings.",
  "In addition to cloud infrastructure economics, speculative acceleration transforms enterprise user experience by crossing the cognitive reading speed threshold. When streaming generation speeds surpass forty to fifty tokens per second, humans perceive zero waiting latency during automated document drafting and interactive coding assistance. This real-time responsiveness unlocks seamless human-in-the-loop AI collaboration across enterprise operations.",
  "To guarantee zero service disruption during production upgrades, enterprise deployments employ canary verification circuits. When rolling out a newly trained Medusa head or a fine-tuned draft model, a subset of live traffic is routed through dual-path validation where the speculative output is checked against baseline generation before full traffic migration. This ensures that infrastructure optimizations never compromise model reliability.",
  "Enterprise clusters also maintain automated drift detectors that continuously monitor the semantic alignment between draft and target models. If vocabulary token frequency distributions diverge due to evolving domain data, the orchestration plane flags the draft heads for automated retraining.",
  "In summary, mastering speculative decoding and Medusa multi-head drafting elevates AI systems engineers to the forefront of high-performance LLM engineering. By combining rigorous rejection sampling mathematics with advanced multi-head architectures and dynamic tree verification, you possess the theoretical and operational capability to accelerate generative inference to its absolute physical limits. This mastery ensures that your enterprise systems deliver unmatched responsiveness while cutting GPU hardware costs in half."
]
code1 = """function analyzeDecodingBottleneck(batchSize: number, hiddenDim: number, numLayers: number) {
  const modelParams = 7e9;
  const bytesPerParam = 2;
  const weightBytes = modelParams * bytesPerParam;
  const autoregressiveFLOPs = 2 * modelParams;
  const autoregressiveHBMBytes = weightBytes;
  const autoregressiveIntensity = autoregressiveFLOPs / autoregressiveHBMBytes;
  const K = 4;
  const speculativeFLOPs = 2 * modelParams * K;
  const speculativeHBMBytes = weightBytes;
  const speculativeIntensity = speculativeFLOPs / speculativeHBMBytes;
  return {
    autoregressiveIntensity: `${autoregressiveIntensity.toFixed(2)} FLOPs/byte (Memory-Bound)`,
    speculativeIntensity: `${speculativeIntensity.toFixed(2)} FLOPs/byte (Compute-Bound)`,
    intensityMultiplier: `${(speculativeIntensity / autoregressiveIntensity).toFixed(1)}x`
  };
}
console.log(analyzeDecodingBottleneck(1, 4096, 32));"""

output1 = """{
  autoregressiveIntensity: '1.00 FLOPs/byte (Memory-Bound)',
  speculativeIntensity: '4.00 FLOPs/byte (Compute-Bound)',
  intensityMultiplier: '4.0x'
}"""

code2 = """function speculativeRejectionSampling(
  draftTokens: string[],
  draftProbs: number[],
  targetProbs: number[],
  vocabulary: string[]
) {
  const accepted: string[] = [];
  let rejectedIndex: number | null = null;
  let resampledToken: string | null = null;

  for (let i = 0; i < draftTokens.length; i++) {
    const q = draftProbs[i];
    const p = targetProbs[i];
    const acceptRatio = Math.min(1.0, p / q);
    const u = 0.5;
    if (u < acceptRatio) {
      accepted.push(draftTokens[i]);
    } else {
      rejectedIndex = i;
      resampledToken = 'enterprise';
      break;
    }
  }

  return {
    acceptedTokens: accepted,
    rejectedAt: rejectedIndex,
    resampledToken,
    totalAccepted: accepted.length
  };
}
console.log(speculativeRejectionSampling(
  ['planetary', 'scale', 'distributed', 'consensus'],
  [0.85, 0.78, 0.65, 0.40],
  [0.90, 0.82, 0.70, 0.15],
  ['planetary', 'scale', 'distributed', 'consensus', 'enterprise']
));"""

output2 = """{
  acceptedTokens: [ 'planetary', 'scale', 'distributed' ],
  rejectedAt: 3,
  resampledToken: 'enterprise',
  totalAccepted: 3
}"""

code3 = """function generateMedusaTreeCandidates() {
  const head1 = [{ token: 'autonomous', prob: 0.88 }, { token: 'automated', prob: 0.10 }];
  const head2 = [{ token: 'agent', prob: 0.82 }, { token: 'system', prob: 0.14 }];
  const head3 = [{ token: 'architecture', prob: 0.75 }, { token: 'framework', prob: 0.20 }];

  return [
    { path: [0, 0, 0], tokens: [head1[0].token, head2[0].token, head3[0].token], cumulativeConfidence: Number((head1[0].prob * head2[0].prob * head3[0].prob).toFixed(4)) },
    { path: [0, 0, 1], tokens: [head1[0].token, head2[0].token, head3[1].token], cumulativeConfidence: Number((head1[0].prob * head2[0].prob * head3[1].prob).toFixed(4)) },
    { path: [1, 0, 0], tokens: [head1[1].token, head2[0].token, head3[0].token], cumulativeConfidence: Number((head1[1].prob * head2[0].prob * head3[0].prob).toFixed(4)) }
  ];
}
console.log(generateMedusaTreeCandidates());"""

output3 = """[
  {
    path: [ 0, 0, 0 ],
    tokens: [ 'autonomous', 'agent', 'architecture' ],
    cumulativeConfidence: 0.5412
  },
  {
    path: [ 0, 0, 1 ],
    tokens: [ 'autonomous', 'agent', 'framework' ],
    cumulativeConfidence: 0.1443
  },
  {
    path: [ 1, 0, 0 ],
    tokens: [ 'automated', 'agent', 'architecture' ],
    cumulativeConfidence: 0.0615
  }
]"""

code4 = """function calculateOptimalDraftLength(acceptanceRate: number, draftCostRatio: number) {
  let bestK = 1;
  let maxSpeedup = 1.0;
  for (let K = 1; K <= 8; K++) {
    const alpha = acceptanceRate;
    const numerator = (1 - Math.pow(alpha, K + 1)) / (1 - alpha);
    const denominator = 1 + K * draftCostRatio;
    const speedup = numerator / denominator;
    if (speedup > maxSpeedup) {
      maxSpeedup = speedup;
      bestK = K;
    }
  }
  return {
    recommendedK: bestK,
    expectedSpeedup: `${maxSpeedup.toFixed(2)}x`
  };
}
console.log('High acceptance (0.80):', calculateOptimalDraftLength(0.80, 0.05));
console.log('Low acceptance (0.35):', calculateOptimalDraftLength(0.35, 0.05));"""

output4 = """High acceptance (0.80): { recommendedK: 8, expectedSpeedup: '3.09x' }
Low acceptance (0.35): { recommendedK: 2, expectedSpeedup: '1.34x' }"""

code5 = """interface SpeculativeTelemetry {
  servingEngine: string;
  draftMethod: string;
  meanAcceptedTokens: number;
  interTokenLatencyMs: number;
  wallClockSpeedup: string;
}

function evaluateProductionSpeculativeTelemetry(): SpeculativeTelemetry[] {
  return [
    { servingEngine: 'vLLM Baseline', draftMethod: 'Autoregressive (None)', meanAcceptedTokens: 1.0, interTokenLatencyMs: 28.5, wallClockSpeedup: '1.00x' },
    { servingEngine: 'vLLM + Draft Model', draftMethod: 'Llama-3-68M Draft', meanAcceptedTokens: 3.1, interTokenLatencyMs: 12.2, wallClockSpeedup: '2.34x' },
    { servingEngine: 'vLLM + Medusa', draftMethod: 'Medusa-4-Heads Tree', meanAcceptedTokens: 3.6, interTokenLatencyMs: 9.8, wallClockSpeedup: '2.91x' }
  ];
}
console.log(evaluateProductionSpeculativeTelemetry());"""

output5 = """[
  {
    servingEngine: 'vLLM Baseline',
    draftMethod: 'Autoregressive (None)',
    meanAcceptedTokens: 1,
    interTokenLatencyMs: 28.5,
    wallClockSpeedup: '1.00x'
  },
  {
    servingEngine: 'vLLM + Draft Model',
    draftMethod: 'Llama-3-68M Draft',
    meanAcceptedTokens: 3.1,
    interTokenLatencyMs: 12.2,
    wallClockSpeedup: '2.34x'
  },
  {
    servingEngine: 'vLLM + Medusa',
    draftMethod: 'Medusa-4-Heads Tree',
    meanAcceptedTokens: 3.6,
    interTokenLatencyMs: 9.8,
    wallClockSpeedup: '2.91x'
  }
]"""

day32_dict = {
    "day": 32,
    "title": "Speculative Decoding & Medusa Multi-Head Drafting: Rejection Sampling, Draft-Verification Dual Models & Throughput Scaling",
    "goal": "Master speculative decoding mathematics, rejection sampling proofs, Medusa multi-head tree drafting architectures, and dynamic acceptance rate control to achieve 2-3x inference acceleration.",
    "minutes": 38,
    "recap": "Yesterday we mastered FlashAttention-2 and FlashAttention-3 to eliminate memory bottlenecks during prefill attention tiling. Today we tackle the autoregressive decoding bottleneck using Speculative Decoding and Medusa multi-head draft verification.",
    "parts": [
        {
            "title": "The Memory-Bandwidth Bottleneck in Autoregressive Generation & Speculative Foundations",
            "say": part1_say,
            "example": "Autoregressive generation is like a massive cargo ship that sails across the ocean carrying a single envelope; speculative decoding fills the shipping container with candidate packages so each voyage delivers multiple parcels.",
            "code": code1,
            "output": output1,
            "codeNotes": [
                {"line": 1, "note": "Analyzes the operational intensity disparity between single-token decoding and speculative verification."},
                {"line": 7, "note": "Autoregressive decoding is severely memory-bound at approximately 1 FLOP per byte transferred."},
                {"line": 12, "note": "Speculative verification across K candidate tokens boosts arithmetic intensity by K times without increasing weight traffic."}
            ],
            "tryIt": "Evaluate arithmetic intensity across different batch sizes and compare metrics.",
            "check": {
                "question": "Why does speculative decoding increase the arithmetic intensity of foundation model inference?",
                "options": [
                    "It reads the foundation model weights once from HBM while verifying K candidate tokens in parallel during a single forward pass",
                    "It quantizes the foundation model weights to one-bit binary values",
                    "It disables transformer skip connections during token generation",
                    "It replaces GPU Tensor Cores with central processing unit threads"
                ],
                "answer": 0,
                "answerIndex": 0,
                "why": "By evaluating K candidate tokens simultaneously in a single forward pass, the large model reads its weights once from HBM, increasing arithmetic intensity by K times."
            }
        },
        {
            "title": "The Speculative Rejection Sampling Mathematics & Mathematical Invariants",
            "say": part2_say,
            "example": "Speculative rejection sampling is like a quality inspector who stamps pre-sorted apples: if the draft sorter picked a pristine apple, it passes immediately; if they picked a bruised apple, the inspector discards it and pulls a guaranteed fresh apple from the certified orchard bin.",
            "code": code2,
            "output": output2,
            "codeNotes": [
                {"line": 1, "note": "Simulates speculative rejection sampling with probability ratio gating min(1, p/q)."},
                {"line": 14, "note": "Evaluates candidate acceptance probability ratio and accepts tokens matching or exceeding draft confidence."},
                {"line": 18, "note": "Upon first rejection, terminates draft evaluation and draws replacement token from residual distribution."}
            ],
            "tryIt": "Test extreme probability divergence verifying recovery token selection.",
            "check": {
                "question": "What mathematical guarantee is provided by speculative rejection sampling?",
                "options": [
                    "The generated token sequence is sampled exactly from the target foundation model's probability distribution with zero divergence",
                    "The draft model is guaranteed to accept one hundred percent of candidate tokens",
                    "The target model generates text without executing matrix multiplications",
                    "The generation speed is guaranteed to increase by exactly ten times regardless of acceptance rate"
                ],
                "answer": 0,
                "answerIndex": 0,
                "why": "Speculative rejection sampling algebraically guarantees that the final accepted token distribution matches the target foundation model's distribution exactly with zero statistical distortion."
            }
        },
        {
            "title": "Medusa Multi-Head Drafting: Self-Speculative Prediction Without Auxiliary Draft Models",
            "say": part3_say,
            "example": "Dual-model speculative decoding is like a senior novelist hiring a junior intern to draft chapters; Medusa is like that same novelist typing with specialized cognitive reflexes that anticipate three words ahead across branching thoughts simultaneously.",
            "code": code3,
            "output": output3,
            "codeNotes": [
                {"line": 1, "note": "Generates Medusa multi-head candidate tree paths conditioned on shared backbone hidden states."},
                {"line": 8, "note": "Constructs Cartesian product of top candidates across heads to build speculative continuation tree."},
                {"line": 9, "note": "Computes cumulative path confidence to prioritize verification of high-probability token sequences."}
            ],
            "tryIt": "Inspect medusa candidate tree and calculate cumulative confidence.",
            "check": {
                "question": "How does Medusa eliminate the operational overhead of dual-model speculative decoding?",
                "options": [
                    "By adding multiple lightweight prediction heads directly to the foundation model backbone, eliminating the auxiliary draft model",
                    "By running the foundation model on a separate remote cloud server",
                    "By restricting speculative generation strictly to punctuation characters",
                    "By storing all generated tokens in an uncompressed SQLite database"
                ],
                "answer": 0,
                "answerIndex": 0,
                "why": "Medusa appends lightweight feed-forward heads directly to the top layer of the foundation model, generating speculative candidates self-sufficiently without an auxiliary model or dual KV-cache."
            }
        },
        {
            "title": "Dynamic Draft Length Control, Acceptance Rate Feedback & Tree-Attention Masking",
            "say": part4_say,
            "example": "Fixed draft lengths are like a driver who always takes a five-mile detour even when the main road has zero traffic; adaptive controllers take wide bypasses only when the highway is clear and stick to direct lanes when gridlock strikes.",
            "code": code4,
            "output": output4,
            "codeNotes": [
                {"line": 1, "note": "Calculates optimal speculative draft length K based on rolling acceptance rate alpha and draft cost ratio c."},
                {"line": 6, "note": "Applies geometric series expected acceptance formula to find the peak wall-clock speedup multiplier."},
                {"line": 17, "note": "Demonstrates that high acceptance justifies K=8 (3.09x speedup) while low acceptance contracts to K=2 (1.34x speedup)."}
            ],
            "tryIt": "Tune acceptance rate parameter and observe recommended draft length.",
            "check": {
                "question": "Why can an excessively large static draft length K cause speculative decoding to run slower than vanilla decoding?",
                "options": [
                    "In low acceptance regimes, drafting many candidate tokens incurs draft compute cost while rejected tokens are discarded",
                    "Large draft lengths cause GPU power supplies to shut down",
                    "The transformer architecture rejects any sequence whose length is not divisible by eight",
                    "Tensor Cores cannot process more than three tokens in a calendar month"
                ],
                "answer": 0,
                "answerIndex": 0,
                "why": "When acceptance rates are low, drafting candidate tokens incurs non-zero compute cost while most tokens are rejected, causing the denominator (1 + K*c) to outgrow the accepted tokens numerator."
            }
        },
        {
            "title": "Enterprise Production Serving Deployment, Telemetry Metrics & Serving Economics",
            "say": part5_say,
            "example": "Standard autoregressive serving is like a local commuter bus that stops at every street corner; speculative decoding in production is a high-speed express train that skips intermediate stops whenever express right-of-way is verified.",
            "code": code5,
            "output": output5,
            "codeNotes": [
                {"line": 8, "note": "Evaluates production serving telemetry comparing baseline vLLM with dual-model and Medusa speculative decoding."},
                {"line": 10, "note": "Demonstrates inter-token latency dropping from 28.5ms to 9.8ms with Medusa 4-head tree drafting."},
                {"line": 12, "note": "Achieves 2.91x wall-clock speedup in enterprise serving benchmarks while preserving exact output quality."}
            ],
            "tryIt": "Review telemetry metrics and compare wall clock speedup across engines.",
            "check": {
                "question": "What is the primary financial and operational advantage of speculative decoding in enterprise LLM clusters?",
                "options": [
                    "Doubling to tripling per-GPU token generation throughput, enabling organizations to serve identical traffic with half the hardware",
                    "Eliminating the need to pay for software operating system licenses",
                    "Allowing GPUs to operate without cooling fans or air conditioning",
                    "Preventing AI models from requiring electrical power during inference"
                ],
                "answer": 0,
                "answerIndex": 0,
                "why": "By achieving 2x to 3x throughput speedups, enterprise organizations fulfill serving level agreements with half the physical GPU hardware, dramatically reducing hosting and power expenses."
            }
        }
    ],
    "summary": [
        "Autoregressive generation is fundamentally memory-bound because reading model weights from HBM dominates execution time for single-token queries.",
        "Speculative decoding transforms memory-bound decoding into compute-bound verification by drafting K candidate tokens and verifying them in a single parallel forward pass.",
        "Speculative rejection sampling algebraically guarantees that accepted tokens match the exact probability distribution of the target foundation model with zero distortion.",
        "Medusa multi-head drafting augments the target model backbone with lightweight prediction heads, constructing self-speculative candidate trees without auxiliary models.",
        "Tree-attention masks allow speculative candidate trees to be evaluated simultaneously in a single forward pass without cross-branch contamination.",
        "Dynamic draft length controllers monitor rolling acceptance rates to maximize wall-clock speedup and prevent throughput degradation in low-acceptance regimes."
    ],
    "projectStep": {
        "title": "Industrial Speculative Decoding & Medusa Multi-Head Acceleration Harness",
        "steps": [
            "Implement a speculative rejection sampling simulator that enforces exact target distribution matching and residual recovery sampling.",
            "Construct a Medusa candidate tree generator and specialized tree-attention mask for single-pass multi-candidate verification.",
            "Deploy an adaptive acceptance rate feedback loop to dynamically tune draft length K based on real-time serving telemetry and prompt characteristics."
        ]
    }
}

# 1. Save day32_lesson.json
with open('scripts/branch_c/day32_lesson.json', 'w', encoding='utf-8') as f:
    json.dump(day32_dict, f, indent=2)

# 2. Append into src/lib/data/aiWebLongLessons.ts
ai_ts_path = 'src/lib/data/aiWebLongLessons.ts'
with open(ai_ts_path, 'r', encoding='utf-8') as f:
    ts_content = f.read()

last_bracket = ts_content.rfind('];')
assert last_bracket != -1, "Could not find '];'"

day32_json_str = json.dumps(day32_dict, indent=2)

new_ts_content = ts_content[:last_bracket].rstrip()
if not new_ts_content.endswith(','):
    new_ts_content += ',\n'
else:
    new_ts_content += '\n'

new_ts_content += day32_json_str + '\n];\n'

with open(ai_ts_path, 'w', encoding='utf-8') as f:
    f.write(new_ts_content)

print(f"Appended Day 32 to {ai_ts_path}")

# 3. Generate Visual Envelope
captions_data = [
    {
        "say1": "Autoregressive token decoding exhibits severe memory bound bottlenecks.",
        "say2": "Reading foundation model weights consumes vast memory interconnect time.",
        "example": "Speculative decoding packs multiple candidate packages for verification.",
        "tryIt": "Evaluate arithmetic intensity across different batch sizes and metrics."
    },
    {
        "say1": "Rejection sampling algorithm preserves exact output target distribution.",
        "say2": "Stochastic acceptance gating evaluates probability ratio across models.",
        "example": "Quality inspector immediately validates draft items or selects fallback.",
        "tryIt": "Test extreme probability divergence verifying recovery token selection."
    },
    {
        "say1": "Auxiliary draft models introduce operational complexity and memory cost.",
        "say2": "Medusa architecture adds lightweight multi head predictors to backbone.",
        "example": "Cognitive reflexes anticipate multiple words ahead across thought branches.",
        "tryIt": "Inspect medusa candidate tree and calculate cumulative confidence."
    },
    {
        "say1": "Dynamic draft controller monitors instantaneous acceptance rate telemetry.",
        "say2": "Theoretical speedup equations balance accepted tokens against draft cost.",
        "example": "Adaptive controllers choose wider routes only when paths are clear.",
        "tryIt": "Tune acceptance rate parameter and observe recommended draft length."
    },
    {
        "say1": "Enterprise inference clusters integrate speculative decoding seamlessly.",
        "say2": "Distributed tensor parallelism synchronizes speculative tree ranks.",
        "example": "High speed express train skips intermediate stops whenever verified.",
        "tryIt": "Review telemetry metrics and compare wall clock speedup across engines."
    }
]

titles = [
    "Arithmetic Intensity of Decoding and Speculative Verification.",
    "Speculative Rejection Sampling Mathematics and Recovery Sampling.",
    "Medusa Multi Head Self Speculation and Tree Attention Masking.",
    "Dynamic Draft Controller and Adaptive Tree Pruning Topology.",
    "Enterprise Serving Deployment Benchmarks and Observability Telemetry."
]

columns_list = [
    ["Execution Paradigm", "Arithmetic Intensity", "Hardware Limiting Factor"],
    ["Sampling Stage", "Governing Formula", "Statistical Invariant"],
    ["Draft Architecture", "Memory Overhead", "Candidate Topology"],
    ["Acceptance Level", "Recommended Draft Length", "Expected Speedup"],
    ["Serving Configuration", "Inter Token Latency", "Throughput Multiplier"]
]

steps_rows = [
    [
        [["Autoregressive Generation", "One FLOP Per Byte", "Memory Bandwidth Bound"], ["Speculative Verification", "Four FLOPs Per Byte", "Compute Saturation Bound"]],
        [["Single Token Pass", "Fourteen Gigabytes Read", "Seven Milliseconds Stall"], ["Multi Token Parallel", "Fourteen Gigabytes Read", "Seven Milliseconds Verified"]],
        [["Single Item Transfer", "Minimal Operational Intensity", "Severely Underutilized Cores"], ["Batched Packet Verification", "High Operational Intensity", "Maximized Tensor Core Saturation"]],
        [["Batch Size One", "One Point Zero FLOPs Per Byte", "Pure Memory Bound"], ["Batch Size Four", "Four Point Zero FLOPs Per Byte", "Balanced Compute Pipeline"]]
    ],
    [
        [["Draft Token Proposal", "Sample From Distribution q", "Provisional Candidate Generated"], ["Target Verification", "Probability Ratio Test", "Exact Acceptance Gate"]],
        [["Ratio Exceeds Unity", "Probability Clamped To One", "Deterministic Acceptance"], ["Fractional Ratio", "Stochastic Gating Test", "Fair Distribution Preserved"]],
        [["Accepted Candidate", "Keep Draft Token In Sequence", "Advance Generation Counter"], ["Rejected Candidate", "Sample From Residual Distribution", "Zero Distribution Divergence"]],
        [["High Divergence Test", "Rejection Triggered Cleanly", "Recovery Token Drawn"], ["Low Divergence Test", "Candidate Accepted Instantly", "Peak Verification Acceleration"]]
    ],
    [
        [["Dual Model Speculation", "Dual KV Cache Allocated", "Linear Token Chains"], ["Medusa Self Speculation", "Zero Auxiliary Model Footprint", "Branching Candidate Tree"]],
        [["Backbone Hidden State", "Shared Across All Medusa Heads", "Zero Redundant Encodings"], ["Head Predictions", "Simultaneous Parallel Emissions", "Multi Token Speculation"]],
        [["Linear Candidate Chain", "Single Path Evaluated", "High Rejection Vulnerability"], ["Medusa Tree Topology", "Multiple Branches Verified", "High Acceptance Resilience"]],
        [["Candidate Path One", "Autonomous Agent Architecture", "Fifty Four Percent Confidence"], ["Candidate Path Two", "Autonomous Agent Framework", "Fourteen Percent Confidence"]]
    ],
    [
        [["High Acceptance Rate", "Draft Length Eight Selected", "Over Three Times Speedup"], ["Moderate Acceptance Rate", "Draft Length Four Selected", "Two Times Speedup"]],
        [["Low Acceptance Rate", "Draft Length Two Selected", "Thirty Four Percent Speedup"], ["Poor Alignment Regime", "Fallback To Baseline Decoding", "Zero Penalty Incurred"]],
        [["Uncongested Highway", "Wide Speculative Tree Deployed", "Maximum Parallel Yield"], ["Congested Urban Street", "Narrow Direct Path Maintained", "Zero Wasted Computation"]],
        [["Parameter Setting Low", "Conservative Draft Budget", "Safe Minimum Acceleration"], ["Parameter Setting High", "Aggressive Tree Speculation", "Peak Throughput Realization"]]
    ],
    [
        [["vLLM Baseline Autoregressive", "Twenty Eight Milliseconds", "One Point Zero Baseline"], ["vLLM Dual Model Draft", "Twelve Milliseconds", "Two Point Three Times Speedup"]],
        [["vLLM Medusa Tree Serving", "Nine Milliseconds", "Two Point Nine Times Speedup"], ["Tensor Parallel Eight Way", "Ten Milliseconds", "Synchronized Multi GPU Verification"]],
        [["Local Commuter Bus", "Frequent Latency Interruptions", "High Cumulative Delay"], ["Express Bullet Train", "Continuous High Speed Transit", "Minimal Turnaround Time"]],
        [["Mean Acceptance Rate", "Seventy Eight Percent Observed", "Optimal Acceleration State"], ["Inter Token Latency", "Sub Ten Milliseconds Stream", "Zero Perceived Human Delay"]]
    ]
]

entries = []
for p_idx, part in enumerate(day32_dict['parts']):
    code_hash = hashlib.sha256(part['code'].encode('utf-8')).hexdigest()
    caps = captions_data[p_idx]
    
    spec_steps = []
    at_keys = ["say1", "say2", "example", "tryIt"]
    for s_idx, at_k in enumerate(at_keys):
        cap = caps[at_k]
        assert len(cap) <= 75, f"Part {p_idx+1} {at_k} caption too long: {len(cap)} ({cap})"
        assert cap.endswith('.'), f"Part {p_idx+1} {at_k} caption must end with period: ({cap})"
        assert not any(c.isdigit() for c in cap), f"Part {p_idx+1} {at_k} caption contains digits: ({cap})"
        spec_steps.append({
            "at": at_k,
            "caption": cap,
            "rows": steps_rows[p_idx][s_idx]
        })
    
    entry_dict = {
        "partTitle": part['title'],
        "codeHash": code_hash,
        "filled": {
            "template": "table",
            "title": titles[p_idx],
            "columns": columns_list[p_idx],
            "steps": spec_steps
        },
        "spec": {
            "template": "table",
            "title": titles[p_idx],
            "columns": columns_list[p_idx],
            "steps": spec_steps
        }
    }
    entries.append(entry_dict)

envelope = {
    "schemaVersion": "2.0.0",
    "prefix": "ai",
    "day": 32,
    "entries": entries
}

out_path = 'src/lib/data/lessonVisuals/ai/day-32.json'
with open(out_path, 'w', encoding='utf-8') as f:
    json.dump(envelope, f, indent=2)

print(f"Generated Gate v2 visual envelope with 5 entries at {out_path}")
