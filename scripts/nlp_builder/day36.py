"""
Day 36: Empirical Scaling Laws: Chinchilla, Kaplan Compute-Optimal Frontiers & Over-Training Dynamics
Course 37: Natural Language Processing & Computational Linguistics
PinIT Career OS - Month 2 Enterprise Expansion
"""

DAY_36_DATA = {
    "day": 36,
    "title": "Day 36: Empirical Scaling Laws: Chinchilla, Kaplan Compute-Optimal Frontiers & Over-Training Dynamics",
    "description": "Master the mathematical, statistical, and economic principles governing large language model pre-training. Explore power laws, empirical loss forecasting, the compute budget identity C = 6ND, Kaplan's parameter-heavy regime, Hoffmann's Chinchilla compute-optimal frontier, and the post-Chinchilla over-training economics defining models like LLaMA and Mistral.",
    "parts": [
        {
            "title": "The Foundations of Neural Scaling: Power Laws, Loss Predictability & The Compute Budget C ≈ 6ND",
            "say": [
                "Welcome to Block 8 of our Natural Language Processing and Computational Linguistics curriculum: Large Language Model Pre-Training & Scaling Laws. Having mastered the internal mechanics, attention optimizations, and hardware-efficient kernel designs of modern decoder blocks in Block 7, we now step back to examine the macroscopic physics governing foundation model training. Before allocating millions of dollars in compute, reserving thousands of GPU accelerators, or initiating multi-month pre-training runs, machine learning architects must accurately forecast cross-entropy loss, downstream benchmark capabilities, and training stability. This capability rests entirely on empirical scaling laws.",
                "In deep learning, an empirical scaling law is a mathematical relationship describing how cross-entropy validation loss L(N, D, C) varies predictably as a function of model parameters N, pre-training dataset size D (measured in tokens), and total compute expenditure C (measured in floating-point operations, or FLOPs). Prior to the rigorous empirical formulation of scaling laws, deep learning was largely characterized by trial-and-error hyperparameter tuning. Practitioners frequently scaled models blindly, often encountering training instabilities or severe under-training due to arbitrary compute allocations. Scaling laws transformed foundation model pre-training from an intuitive craft into a deterministic engineering science.",
                "The mathematical cornerstone of scaling laws is the power law relationship. A power law describes a functional relationship between two quantities where a relative change in one quantity results in a proportional relative change in the other, independent of the initial size of those quantities: L(x) = A * x^(-alpha) + L_0. Here, x represents a scaling factor (such as compute, parameters, or dataset tokens), A is a scaling coefficient, alpha is the scaling exponent, and L_0 represents the irreducible loss—the theoretical lower bound of cross-entropy loss dictated by the inherent entropy of natural language (unpredictable noise, spelling errors, and linguistic ambiguity).",
                "When plotted on log-log axes, a power law transforms into a straight line: log(L(x) - L_0) = log(A) - alpha * log(x). The slope of this line is -alpha. The astonishing discovery made across thousands of language model experiments is that this linear relationship holds across more than eight orders of magnitude of compute—from small models trained on a single desktop GPU up to cluster-scale foundation models trained on tens of thousands of Hopper or Blackwell accelerators. As long as model architecture is held constant (e.g., standard decoder-only Transformers) and hyperparameters (such as learning rate schedules and batch sizes) are appropriately tuned, cross-entropy loss decreases monotonically and predictably.",
                "To connect parameters and dataset size to physical compute, we derive the fundamental compute budget identity for Transformer language models: C ≈ 6 * N * D. Let us analyze where the factor of 6 originates from first principles. During the forward pass of a decoder-only Transformer, each parameter undergoes approximately one multiply-accumulate operation (MAC) per token, which equates to 2 floating-point operations (one multiply, one add). Thus, the forward pass consumes 2 * N FLOPs per token. During the backward pass, computing the gradients with respect to the activations requires another 2 * N FLOPs, and computing the gradients with respect to the weights requires an additional 2 * N FLOPs. Therefore, the backward pass consumes 4 * N FLOPs per token. Summing both passes yields 2N + 4N = 6N FLOPs per token.",
                "When a model of N non-embedding parameters is trained across a dataset of D tokens, the total theoretical floating-point operations expended is given by C = 6 * N * D. (Note that embedding parameters are excluded from this compute accounting because the embedding layer and unembedding head involve sparse dictionary lookups and logit projections that do not scale linearly with context length across all hidden layers). This fundamental identity links compute capital directly to architectural dimensions. If an organization secures a compute budget of 10^23 FLOPs, the architect faces a critical optimization dilemma: how should those FLOPs be partitioned between model size N and dataset size D?",
                "Understanding the irreducible loss L_0 is equally crucial for enterprise roadmap planning. If an architect attempts to fit power-law curves without modeling L_0, loss projections will predict that loss approaches zero as compute approaches infinity. In reality, human language contains irreducible semantic ambiguity: even a theoretically omniscient predictor cannot determine with 100% certainty whether the next word following 'I ordered a cup of' will be 'coffee', 'tea', or 'water'. Modeling L_0 prevents over-promising downstream accuracy and allows engineers to compute the true marginal return on investment for additional compute expenditure.",
                "In the following interactive Python simulation, we will implement the foundational power-law loss formulation and verify the C = 6ND compute budget relationship. We will simulate loss trajectories across varying compute budgets, compute the logarithmic power-law decay, and extract the theoretical minimum loss under compute-constrained conditions."
            ],
            "example": "Imagine designing a commercial jet airliner. Aeronautical engineers do not build full-scale prototypes by guess; they use wind tunnel scale models and aerodynamic scaling laws (Reynolds numbers). By measuring drag on a 1:50 scale model, they can predict fuel consumption and lift on a 500-passenger airliner with sub-percent error. Neural scaling laws provide the exact same scale-model predictability for foundation AI models.",
            "code": """import math

def compute_flops(num_params: int, num_tokens: int) -> float:
    # C = 6 * N * D
    return 6.0 * num_params * num_tokens

def power_law_loss(compute_c: float) -> float:
    # L(C) = L_0 + A * (C_ref / C)^alpha
    # Real-world cross-entropy scaling calibrated across 8 orders of magnitude
    return 1.69 + 0.30 * math.pow(1.0e24 / compute_c, 0.08)

print("=== NEURAL SCALING LAWS: COMPUTE & POWER-LAW SIMULATION ===")
models = [
    ("Mini-Model",     125_000_000,     2_000_000_000),      # 125M params, 2B tokens
    ("Medium-Model", 1_300_000_000,    20_000_000_000),     # 1.3B params, 20B tokens
    ("Large-Model",  7_000_000_000,   140_000_000_000),    # 7B params, 140B tokens
    ("Frontier-Model", 70_000_000_000, 1_400_000_000_000) # 70B params, 1.4T tokens
]

for name, N, D in models:
    flops = compute_flops(N, D)
    loss = power_law_loss(flops)
    print(f"[{name}] Params N: {N/1e9:6.2f}B | Tokens D: {D/1e9:6.1f}B | Compute C: {flops:.2e} FLOPs | Pred Loss: {loss:.4f}")
""",
            "output": """=== NEURAL SCALING LAWS: COMPUTE & POWER-LAW SIMULATION ===
[Mini-Model] Params N:   0.12B | Tokens D:    2.0B | Compute C: 1.50e+18 FLOPs | Pred Loss: 2.5671
[Medium-Model] Params N:   1.30B | Tokens D:   20.0B | Compute C: 1.56e+20 FLOPs | Pred Loss: 2.2949
[Large-Model] Params N:   7.00B | Tokens D:  140.0B | Compute C: 5.88e+21 FLOPs | Pred Loss: 2.1425
[Frontier-Model] Params N:  70.00B | Tokens D: 1400.0B | Compute C: 5.88e+23 FLOPs | Pred Loss: 2.0030""",
            "codeNotes": [
                "Line 3-5: Implements the fundamental compute identity C = 6 * N * D.",
                "Line 7-10: Implements power-law loss formulation calibrated to empirical natural language entropy (irreducible loss L_0 = 1.69).",
                "Line 19-23: Iterates across 5 orders of magnitude of compute, demonstrating smooth, monotonic loss reduction."
            ],
            "tryIt": "Increase Frontier-Model tokens by 10x (to 14T tokens) and verify how closely the predicted loss approaches the irreducible asymptote L_0 = 1.69.",
            "check": {
                "question": "In the foundational compute budget formula C ≈ 6ND for a decoder-only Transformer, why is the scalar coefficient exactly 6?",
                "options": [
                    "The forward pass requires 2 FLOPs per parameter per token (1 multiply, 1 add), while the backward pass requires 4 FLOPs per parameter per token (2 for activation gradients, 2 for weight gradients), totaling 6 FLOPs.",
                    "Because a Transformer contains 6 fundamental attention matrices: W_q, W_k, W_v, W_o, W_gate, and W_down.",
                    "Because modern GPUs feature 6 distinct execution pipelines within each Streaming Multiprocessor.",
                    "Because the model processes tokens across 6 distinct linguistic context windows simultaneously."
                ],
                "answer": 0,
                "answerIndex": 0,
                "why": "Each parameter incurs 1 multiply-accumulate (2 FLOPs) on the forward pass, and 2 multiply-accumulates (4 FLOPs) on the backward pass (one to propagate gradients backward through activations, and one to compute weight gradients with respect to inputs), totaling 6 FLOPs per parameter per token.",
                "explanation": "Each parameter incurs 1 multiply-accumulate (2 FLOPs) on the forward pass, and 2 multiply-accumulates (4 FLOPs) on the backward pass (one to propagate gradients backward through activations, and one to compute weight gradients with respect to inputs), totaling 6 FLOPs per parameter per token."
            }
        },
        {
            "title": "The Kaplan Scaling Regime: Model Parameter Over-Allocation & Sub-Optimal Token Ratios",
            "say": [
                "In 2020, Jared Kaplan and his colleagues at OpenAI published a seminal research paper entitled 'Scaling Laws for Neural Language Models'. This paper was the first to systematically investigate power-law scaling relationships across Transformer architectures, examining model sizes ranging from 768 parameters to 1.5 billion parameters, trained across context lengths, dataset sizes, and compute budgets. Kaplan's work fundamentally reshaped the AI industry by proving that language model performance scales with extreme predictability, establishing the initial blueprint for modern foundation models like GPT-3.",
                "Kaplan et al. investigated three primary resource constraints: model parameter count N (excluding embeddings), pre-training dataset size D (in tokens), and total training compute C. They discovered that validation loss exhibits smooth power-law scaling with respect to each of these three variables when the other two are not bottlenecked: L(N) = (N_c / N)^alpha_N, L(D) = (D_c / D)^alpha_D, and L(C) = (C_c / C)^alpha_C. Their empirical fits yielded exponents alpha_N ≈ 0.076, alpha_D ≈ 0.057, and alpha_C ≈ 0.050.",
                "Crucially, Kaplan's paper addressed the central resource allocation question: Given an increase in total compute budget C, how should an architect scale model size N versus dataset size D? Based on their empirical measurements, Kaplan et al. arrived at a dramatic conclusion: when compute budget increases, one should scale model parameter count aggressively while scaling training tokens very slowly. Specifically, Kaplan recommended that model size should scale as N ∝ C^0.73, while dataset size should scale as D ∝ C^0.27. In other words, for every 10x increase in compute budget, Kaplan advocated increasing parameter count by roughly 5.4x, while increasing token count by only 1.8x.",
                "This finding led to the era of 'parameter-heavy' models. Between 2020 and 2022, AI labs across the world interpreted Kaplan's findings as a mandate to construct ever-larger models trained on relatively small token counts. The most prominent manifestation of this paradigm was GPT-3 itself: a mammoth 175-billion parameter model trained on a modest 300 billion tokens. Following GPT-3, other organizations launched similar architectures, such as DeepMind's Gopher (280 billion parameters on 300 billion tokens) and Jurassic-1 (178 billion parameters on 300 billion tokens). All of these models adhered to the Kaplan ratio: massive parameter capacity trained for relatively few gradient steps.",
                "However, there was an undetected methodological flaw in Kaplan's experimental setup that skewed their findings. In Kaplan's scaling experiments, the learning rate schedule was not properly retuned for each individual training run. Specifically, Kaplan used a fixed learning rate cosine schedule with a fixed decay horizon, or evaluated models before the learning rate had decayed to its final minimum value. In Transformer pre-training, a substantial portion of loss reduction occurs during the final cosine decay phase (often called the 'learning rate cooldown'). Because larger models were evaluated under schedules that favored fast initial convergence, Kaplan systematically underestimated the value of training models for more tokens.",
                "Furthermore, Kaplan evaluated models trained on relatively small token budgets where tokens were never repeated. By not extending training runs to explore high token-to-parameter ratios under fully decayed learning rate schedules, Kaplan's empirical fits artificially penalized token scaling. The consequence was that models produced during the 2020-2022 era were severely under-trained relative to their parameter size.",
                "In enterprise environments, the practical ramification of Kaplan's regime was severe inference inefficiency. A 175B parameter model requires 350 gigabytes of memory just to hold its weights in 16-bit precision, demanding expensive multi-GPU clusters (such as an 8-GPU A100 node) simply to serve a single concurrent stream. If that same compute budget had been spent training a smaller model on significantly more tokens, the resulting model would have delivered equivalent or superior task accuracy while running at a fraction of the serving cost.",
                "In the following Python script, we will simulate the Kaplan resource allocation regime. We will compute the Kaplan-optimal parameter count N and token count D for a given compute budget C, demonstrate the severe imbalance between parameter growth and token growth, and quantify the resulting memory footprint during deployment."
            ],
            "example": "Imagine an executive who receives a corporate expansion budget. Following flawed advice (the Kaplan regime), the executive spends 73% of the budget hiring 500 elite PhD engineers (model parameters), but allocates only 27% of the budget to purchasing lab computers and training materials (data tokens). The engineers spend most of their time sitting idle waiting for equipment, resulting in massive payroll overhead and under-utilized intellectual capacity.",
            "code": """import math

def kaplan_optimal_allocation(compute_budget: float):
    # Kaplan scaling: N ~ C^0.73, D ~ C^0.27
    # Anchored to GPT-3 (175B params, 300B tokens at 3.15e23 FLOPs)
    N = 175e9 * math.pow(compute_budget / 3.15e23, 0.73)
    D = compute_budget / (6.0 * N)
    return N, D

print("=== KAPLAN SCALING REGIME: PARAMETER-HEAVY ALLOCATION ===")
budgets = [
    ("Budget 1e21 (Small)",  1e21),
    ("Budget 1e22 (Medium)", 1e22),
    ("Budget 1e23 (GPT-3)",  3.15e23), # Approx GPT-3 compute
    ("Budget 1e24 (Giant)",  1e24)
]

for label, c in budgets:
    n_params, d_tokens = kaplan_optimal_allocation(c)
    param_gb_fp16 = (n_params * 2.0) / (1024**3)
    print(f"[{label}]")
    print(f"  Compute C:        {c:.2e} FLOPs")
    print(f"  Kaplan Params N:  {n_params / 1e9:7.2f}B parameters")
    print(f"  Kaplan Tokens D:  {d_tokens / 1e9:7.2f}B tokens")
    print(f"  Token/Param Ratio:{d_tokens / n_params:7.2f}x")
    print(f"  Weights VRAM FP16:{param_gb_fp16:7.1f} GB")
""",
            "output": """=== KAPLAN SCALING REGIME: PARAMETER-HEAVY ALLOCATION ===
[Budget 1e21 (Small)]
  Compute C:        1.00e+21 FLOPs
  Kaplan Params N:     2.63B parameters
  Kaplan Tokens D:    63.47B tokens
  Token/Param Ratio:  24.17x
  Weights VRAM FP16:    4.9 GB
[Budget 1e22 (Medium)]
  Compute C:        1.00e+22 FLOPs
  Kaplan Params N:    14.10B parameters
  Kaplan Tokens D:   118.19B tokens
  Token/Param Ratio:   8.38x
  Weights VRAM FP16:   26.3 GB
[Budget 1e23 (GPT-3)]
  Compute C:        3.15e+23 FLOPs
  Kaplan Params N:   175.00B parameters
  Kaplan Tokens D:   300.00B tokens
  Token/Param Ratio:   1.71x
  Weights VRAM FP16:  326.0 GB
[Budget 1e24 (Giant)]
  Compute C:        1.00e+24 FLOPs
  Kaplan Params N:   406.70B parameters
  Kaplan Tokens D:   409.81B tokens
  Token/Param Ratio:   1.01x
  Weights VRAM FP16:  757.5 GB""",
            "codeNotes": [
                "Line 4-8: Anchors Kaplan scaling to historical baseline (GPT-3: 175B parameters, 300B tokens at 3.15e23 FLOPs).",
                "Line 21-27: Shows how token-to-parameter ratio collapses from 24.2x down to 1.01x as compute scales under Kaplan's prescription.",
                "Line 28: Calculates that at 1e24 FLOPs, Kaplan demands 757.5 GB of VRAM just for weights in FP16 precision."
            ],
            "tryIt": "Observe how at 1e24 FLOPs, Kaplan's formula prescribes 406.7 billion parameters trained on only 409.8 billion tokens—a ratio of barely 1 token per parameter!",
            "check": {
                "question": "What primary methodological artifact in Kaplan et al.'s 2020 experimental setup led to their recommendation to scale parameters much faster than tokens (N ∝ C^0.73 vs D ∝ C^0.27)?",
                "options": [
                    "The learning rate schedule was not retuned for each individual run, causing models evaluated under fixed cosine decay horizons to appear under-trained on tokens while favoring fast-converging large models.",
                    "The researchers measured execution speed using CPU threads rather than GPU Tensor Cores.",
                    "The study evaluated only recurrent LSTM architectures rather than autoregressive Transformers.",
                    "The tokenizer dropped all numerical digits during pre-processing, causing loss distortion."
                ],
                "answer": 0,
                "answerIndex": 0,
                "why": "Kaplan et al. used a fixed cosine learning rate schedule without adjusting the decay horizon to match total training steps for each run. Because models were evaluated before undergoing proper learning rate cooldown, the benefits of training on larger token counts were masked, artificially penalizing token scaling.",
                "explanation": "Kaplan et al. used a fixed cosine learning rate schedule without adjusting the decay horizon to match total training steps for each run. Because models were evaluated before undergoing proper learning rate cooldown, the benefits of training on larger token counts were masked, artificially penalizing token scaling."
            }
        },
        {
            "title": "Hoffmann's Chinchilla Revolution: Compute-Optimal IsoFLOP Curves & The G = N = D Parity Law",
            "say": [
                "In March 2022, Jordan Hoffmann, Sebastian Borgeaud, Arthur Mensch, and their colleagues at DeepMind published the groundbreaking paper 'Training Compute-Optimal Large Language Models'. This paper shattered the Kaplan paradigm, redefined foundation model pre-training economics, and introduced the famous 'Chinchilla' scaling laws. Recognizing that prior research had produced severely under-trained language models, Hoffmann et al. conducted an unprecedented empirical investigation, training over 400 language models ranging from 70 million to 16 billion parameters across dataset sizes spanning 5 billion to 500 billion tokens.",
                "To eliminate the methodological flaws of previous studies, Hoffmann et al. enforced three rigorous experimental protocols: 1) For every single model size and token budget combination, the learning rate cosine schedule was retuned so that the learning rate decayed to 10% of its peak value exactly at the final training step; 2) Multiple independent approaches were used to fit the scaling exponents (IsoFLOP profiles, parametric loss fitting, and empirical loss minimization); and 3) All models were trained under identical hardware, optimizer, and architectural conditions.",
                "The primary empirical instrument used by Hoffmann was the IsoFLOP profile. An IsoFLOP profile measures validation loss across varying model sizes N while holding total compute budget C strictly constant (e.g., C = 6 * N * D = 10^20 FLOPs). When loss is plotted against model size N for a fixed compute budget C, the resulting curve forms a smooth, convex parabola with a distinct minimum point: the 'compute-optimal' model size N*(C). Model sizes smaller than N* are under-parameterized (insufficient representational capacity), while model sizes larger than N* are under-trained (too few tokens processed before compute is exhausted).",
                "By tracing the minimum points across dozens of IsoFLOP curves spanning several orders of magnitude of compute, Hoffmann et al. uncovered a startling symmetry: model parameter count N and pre-training dataset size D should scale in equal proportion to compute! Specifically, Hoffmann established the Chinchilla scaling laws: N ∝ C^0.50 and D ∝ C^0.50 (with empirical exponents a = 0.49 and b = 0.51). In other words, for every 10x increase in compute budget C, an architect should increase model parameters N by roughly 3.16x and increase dataset tokens D by roughly 3.16x.",
                "This discovery yielded the celebrated 'Chinchilla Parity Law': For compute-optimal pre-training, the ratio of training tokens to model parameters should be approximately 20:1: D ≈ 20 * N. For every 1 billion parameters in the model, the model should be trained on approximately 20 billion tokens. Contrast this with GPT-3 (175B parameters trained on 300B tokens, a ratio of only 1.7:1) or Gopher (280B parameters trained on 300B tokens, a ratio of 1.1:1). Under the Chinchilla lens, these flagship models were vastly over-parameterized and starved for training data.",
                "To prove their theoretical formulation in hardware, DeepMind trained 'Chinchilla': a 70-billion parameter model trained on 1.4 trillion tokens, consuming exactly the same compute budget (C ≈ 5.88 * 10^23 FLOPs) as their previous 280-billion parameter Gopher model. The empirical results were staggering. Despite having only one-fourth the parameters of Gopher, Chinchilla decisively outperformed Gopher, GPT-3, Megatron-Turing NLG (530B), and Jurassic-1 across virtually every NLP benchmark—including MMLU, BIG-bench, CommonsenseQA, and reading comprehension tasks.",
                "The practical implications of Chinchilla reverberated across the entire industry. Chinchilla proved that smaller, compute-optimal models could outperform much larger predecessors while drastically slashing operational costs. A 70B model requires only 140 GB of VRAM for FP16 inference (fitting comfortably on a single 8x A100/H100 node), delivers 4x higher inference throughput, cuts generation latency, and eliminates the need for complex pipeline parallelism during deployment.",
                "In the following Python script, we will implement Hoffmann's parametric loss function: L(N, D) = E + A / N^alpha + B / D^beta. We will generate synthetic IsoFLOP profiles, compute the convex minimum for varying compute budgets, and mathematically verify that compute-optimal scaling prescribes equal proportional growth: N ∝ C^0.5 and D ∝ C^0.5."
            ],
            "example": "Imagine training a commercial airline pilot. Under Kaplan's regime, an airline hires a genius with 5 doctorates (175B parameters) but gives them only 50 hours of flight simulator time (300B tokens). Under Hoffmann's Chinchilla regime, the airline selects an agile candidate (70B parameters) and gives them 1,000 hours of intense flight simulator training (1.4T tokens). In real-world storms, the well-trained pilot vastly outperforms the over-credentialed, inexperienced pilot.",
            "code": """import math

def chinchilla_optimal_allocation(compute_budget: float):
    # Equal proportional scaling: N* ~ C^0.50, D* ~ C^0.50
    # Calibrated to exact Chinchilla point: 70B params, 1.4T tokens at 5.88e23 FLOPs
    ratio_c = compute_budget / 5.88e23
    N_opt = 70e9 * math.pow(ratio_c, 0.50)
    D_opt = 1.4e12 * math.pow(ratio_c, 0.50)
    return N_opt, D_opt

def chinchilla_loss(N: float, D: float, E: float = 1.69, A: float = 406.4, B: float = 410.7, alpha: float = 0.34, beta: float = 0.28) -> float:
    # L(N, D) = E + A / (N^alpha) + B / (D^beta)
    return E + (A / math.pow(N, alpha)) + (B / math.pow(D, beta))

print("=== HOFFMANN'S CHINCHILLA COMPUTE-OPTIMAL SCALING ===")
budgets = [
    ("Budget 1e21 (Small)",  1e21),
    ("Budget 1e22 (Medium)", 1e22),
    ("Budget 5.88e23 (Chinchilla)", 5.88e23), # Exact Chinchilla budget
    ("Budget 1e25 (Frontier)", 1e25)
]

for label, c in budgets:
    n_opt, d_opt = chinchilla_optimal_allocation(c)
    ratio = d_opt / n_opt
    loss = chinchilla_loss(n_opt, d_opt)
    print(f"[{label}] Compute: {c:.2e} FLOPs")
    print(f"  Optimal Params N*: {n_opt / 1e9:6.2f}B parameters")
    print(f"  Optimal Tokens D*: {d_opt / 1e9:6.1f}B tokens")
    print(f"  Token/Param Ratio: {ratio:6.1f}:1 (Target ~ 20:1)")
    print(f"  Predicted Loss:    {loss:.4f}")
""",
            "output": """=== HOFFMANN'S CHINCHILLA COMPUTE-OPTIMAL SCALING ===
[Budget 1e21 (Small)] Compute: 1.00e+21 FLOPs
  Optimal Params N*:   2.89B parameters
  Optimal Tokens D*:   57.7B tokens
  Token/Param Ratio:   20.0:1 (Target ~ 20:1)
  Predicted Loss:    2.3352
[Budget 1e22 (Medium)] Compute: 1.00e+22 FLOPs
  Optimal Params N*:   9.13B parameters
  Optimal Tokens D*:  182.6B tokens
  Token/Param Ratio:   20.0:1 (Target ~ 20:1)
  Predicted Loss:    2.1455
[Budget 5.88e23 (Chinchilla)] Compute: 5.88e+23 FLOPs
  Optimal Params N*:  70.00B parameters
  Optimal Tokens D*: 1400.0B tokens
  Token/Param Ratio:   20.0:1 (Target ~ 20:1)
  Predicted Loss:    1.9366
[Budget 1e25 (Frontier)] Compute: 1.00e+25 FLOPs
  Optimal Params N*: 288.68B parameters
  Optimal Tokens D*: 5773.5B tokens
  Token/Param Ratio:   20.0:1 (Target ~ 20:1)
  Predicted Loss:    1.8513""",
            "codeNotes": [
                "Line 3-9: Solves compute-optimal scaling enforcing equal proportional growth: N ∝ C^0.5 and D ∝ C^0.5.",
                "Line 11-13: Implements Hoffmann's parametric loss equation: L(N, D) = E + A * N^(-alpha) + B * D^(-beta).",
                "Line 27: Confirms that across all compute budgets, the compute-optimal ratio remains strictly 20.0 tokens per parameter."
            ],
            "tryIt": "Compare the 70B Chinchilla model loss against a 280B model trained on 300B tokens under the same compute budget, proving Chinchilla's superior loss.",
            "check": {
                "question": "According to Hoffmann et al.'s Chinchilla scaling laws, what is the compute-optimal ratio of pre-training tokens to model parameters for large language models?",
                "options": [
                    "Approximately 20:1 (20 tokens per model parameter), meaning parameters and tokens should scale in equal proportion: N ∝ C^0.5 and D ∝ C^0.5.",
                    "Approximately 1:1 (1 token per model parameter), meaning model size should scale much faster than dataset size: N ∝ C^0.73.",
                    "Approximately 200:1, meaning parameters should remain frozen while only data is scaled.",
                    "The ratio depends entirely on the batch size and is independent of total compute."
                ],
                "answer": 0,
                "answerIndex": 0,
                "why": "Hoffmann's IsoFLOP analysis established that model size and token count should scale equally with compute (both N and D proportional to C^0.5). For a 70B parameter model at compute-optimal scale, this yields ~1.4 trillion tokens, or a 20:1 token-to-parameter ratio.",
                "explanation": "Hoffmann's IsoFLOP analysis established that model size and token count should scale equally with compute (both N and D proportional to C^0.5). For a 70B parameter model at compute-optimal scale, this yields ~1.4 trillion tokens, or a 20:1 token-to-parameter ratio."
            }
        },
        {
            "title": "Beyond Compute-Optimal Training: The Over-Training Frontier & Inference-Optimal Economics",
            "say": [
                "While Hoffmann's Chinchilla laws established the theoretical frontier for compute-optimal pre-training, the AI industry quickly realized that 'compute-optimal' during training is not synonymous with 'cost-optimal' across the full product lifecycle. In February 2023, Meta AI published the LLaMA paper ('LLaMA: Open and Efficient Foundation Language Models'), inaugurating the 'Over-Training Frontier'. Meta trained a 7-billion parameter model on 1.0 trillion tokens (a 143:1 ratio) and a 65-billion parameter model on 1.4 trillion tokens. Later, LLaMA-2, Mistral, and LLaMA-3 pushed this boundary to extreme heights: LLaMA-3's 8-billion parameter model was pre-trained on over 15 trillion tokens—a staggering token-to-parameter ratio of nearly 1,875:1!",
                "Why would premier AI research laboratories deliberately violate Chinchilla scaling laws by training models on 10x to 100x more tokens than the compute-optimal recommendation? The answer lies in the total economic cost of ownership: Training Cost versus Lifetime Inference Cost. Pre-training a foundation model is a one-time capital expenditure (CapEx). Once trained, however, a popular foundation model is served to millions of users, answering hundreds of millions of API queries over months or years, accumulating continuous operational expenditure (OpEx).",
                "Let us analyze the inference economics quantitatively. During inference (autoregressive generation), the compute required to generate a token is proportional only to the model size N: C_infer ≈ 2 * N FLOPs per token. Furthermore, memory bandwidth consumption—the primary speed bottleneck of modern inference engines—scales directly with N: every generated token requires loading all N parameters from High Bandwidth Memory (HBM) into GPU SRAM. A 70B model requires loading ~140 GB of weights per token, whereas an 8B model requires loading only ~16 GB. Serving an 8B model is nearly 9 times faster and 9 times cheaper per query than serving a 70B model.",
                "If an enterprise trains a Chinchilla-optimal 70B model on 1.4T tokens, they minimize their one-time training compute. However, if they instead train an 8B model on 12T tokens, they expend roughly the same total pre-training compute (6 * 8B * 12T ≈ 5.76 * 10^23 FLOPs), but the resulting 8B model delivers downstream performance matching or exceeding the 70B model while operating at one-ninth the inference cost forever! For any model that will process more than a few million API requests in production, 'over-training' a smaller model far beyond the Chinchilla frontier is overwhelmingly the economically superior strategy.",
                "This paradigm shift is formalised as Inference-Optimal Scaling. In inference-optimal scaling, the objective function minimizes total lifecycle expenditure: Total_Cost = C_train(N, D) + Q * C_infer(N), where Q represents the total anticipated query volume (in tokens) over the model's deployment lifetime. As Q approaches infinity, the optimal model size N* shrinks, and the optimal training token count D* grows without bound. An architect designing a foundation model must evaluate their expected query traffic before selecting model dimensions.",
                "A natural question arises: Does cross-entropy loss continue to decrease when a model is trained on 15 trillion tokens, or does the model encounter catastrophic overfitting or diminishing returns? Empirical results from LLaMA-3 confirm that validation loss continues to decrease monotonically across 15 trillion tokens with zero sign of saturation, provided that the training corpus is sufficiently diverse and high quality. The model does not overfit because 15 trillion tokens of internet text represents only a fraction of the total entropy available in human knowledge.",
                "In enterprise deployments, understanding over-training economics is the single most valuable financial skill for an AI architect. By resisting the temptation to train unnecessarily large models and instead investing pre-training budgets into massive token volumes on compact architectures (e.g., 8B or 14B), organizations achieve state-of-the-art accuracy while enabling low-latency deployment on edge devices, single-GPU workstations, and cost-effective cloud instances.",
                "In the following Python script, we will model the complete lifecycle cost of ownership. We will compare a Chinchilla-optimal large model against an over-trained compact model across varying production query volumes Q, computing the exact financial breakeven threshold where over-training delivers millions of dollars in net operational savings."
            ],
            "example": "Imagine choosing between two commercial delivery vans. Van A (Chinchilla-optimal) costs $30,000 to manufacture (cheap pre-training) but consumes $1.00 of fuel per mile. Van B (Over-trained) costs $80,000 to manufacture (expensive high-token pre-training) but consumes only $0.10 of fuel per mile. If your fleet drives 500,000 miles, Van A costs $530,000 total, whereas Van B costs only $130,000 total, saving $400,000 over its operational lifespan.",
            "code": """def evaluate_lifecycle_cost(N_params: float, D_train_tokens: float, Q_query_tokens: float, gpu_dollar_per_petaflop: float = 0.00002):
    # Training FLOPs: C_train = 6 * N * D
    train_flops = 6.0 * N_params * D_train_tokens
    # Inference FLOPs: C_infer = 2 * N * Q
    infer_flops = 2.0 * N_params * Q_query_tokens
    
    train_cost = (train_flops / 1e15) * gpu_dollar_per_petaflop
    infer_cost = (infer_flops / 1e15) * gpu_dollar_per_petaflop
    total_cost = train_cost + infer_cost
    
    return {
        "train_flops": train_flops,
        "infer_flops": infer_flops,
        "train_cost": train_cost,
        "infer_cost": infer_cost,
        "total_cost": total_cost
    }

print("=== INFERENCE-OPTIMAL ECONOMICS: CHINCHILLA VS OVER-TRAINED ===")
# Scenario: 5 Trillion production query tokens served over model lifetime
Q = 5_000_000_000_000 

# Option A: Chinchilla-Optimal 70B Model (70B params, 1.4T tokens)
opt_a = evaluate_lifecycle_cost(70e9, 1.4e12, Q)

# Option B: Over-Trained Compact 8B Model (8B params, 12T tokens)
opt_b = evaluate_lifecycle_cost(8e9, 12.0e12, Q)

print(f"Query Volume: {Q/1e12:.1f}T production tokens served")
print("-" * 65)
print("Option A (Chinchilla-Optimal 70B on 1.4T tokens):")
print(f"  Training Cost:    ${opt_a['train_cost']:10,.2f}")
print(f"  Inference Cost:   ${opt_a['infer_cost']:10,.2f}")
print(f"  Total Lifecycle:  ${opt_a['total_cost']:10,.2f}")
print("-" * 65)
print("Option B (Over-Trained 8B on 12T tokens):")
print(f"  Training Cost:    ${opt_b['train_cost']:10,.2f}")
print(f"  Inference Cost:   ${opt_b['infer_cost']:10,.2f}")
print(f"  Total Lifecycle:  ${opt_b['total_cost']:10,.2f}")
print("-" * 65)
savings = opt_a['total_cost'] - opt_b['total_cost']
print(f"Net Economic Savings with Over-Trained 8B Model: ${savings:,.2f}")
""",
            "output": """=== INFERENCE-OPTIMAL ECONOMICS: CHINCHILLA VS OVER-TRAINED ===
Query Volume: 5.0T production tokens served
-----------------------------------------------------------------
Option A (Chinchilla-Optimal 70B on 1.4T tokens):
  Training Cost:    $ 11,760.00
  Inference Cost:   $ 14,000.00
  Total Lifecycle:  $ 25,760.00
-----------------------------------------------------------------
Option B (Over-Trained 8B on 12T tokens):
  Training Cost:    $ 11,520.00
  Inference Cost:   $  1,600.00
  Total Lifecycle:  $ 13,120.00
-----------------------------------------------------------------
Net Economic Savings with Over-Trained 8B Model: $12,640.00""",
            "codeNotes": [
                "Line 1-15: Models total cost of ownership combining CapEx pre-training FLOPs and OpEx serving FLOPs.",
                "Line 20-25: Compares a 70B model against an over-trained 8B model with identical pre-training compute (~5.8e23 FLOPs).",
                "Line 34-39: Quantifies an 88% reduction in inference serving costs ($14,000 down to $1,600), producing $12,640 in net savings."
            ],
            "tryIt": "Increase query volume Q to 50 trillion tokens and verify that inference savings exceed $120,000, dwarfing the initial training cost.",
            "check": {
                "question": "Why do modern frontier AI labs deliberately train models like LLaMA-3 8B on 15 trillion tokens (a 1,875:1 token-to-parameter ratio), far exceeding the Chinchilla compute-optimal recommendation of 20:1?",
                "options": [
                    "Because pre-training is a one-time capital cost, whereas inference cost scales directly with model parameter count N; heavily over-training a compact model drastically slashes lifetime serving latency and hardware costs.",
                    "Because models smaller than 10B parameters cannot run on NVIDIA GPUs unless trained on at least 10 trillion tokens.",
                    "Because Chinchilla scaling laws were proven to be mathematically invalid for English language corpora.",
                    "Because training on fewer than 10 trillion tokens causes Transformer attention matrices to become non-invertible."
                ],
                "answer": 0,
                "answerIndex": 0,
                "why": "Inference compute (2N FLOPs/tok) and memory bandwidth scale strictly with parameter size N. Over-training a smaller model achieves equivalent downstream benchmark accuracy while permanently reducing serving cost and latency by 4x to 10x over millions of production queries.",
                "explanation": "Inference compute (2N FLOPs/tok) and memory bandwidth scale strictly with parameter size N. Over-training a smaller model achieves equivalent downstream benchmark accuracy while permanently reducing serving cost and latency by 4x to 10x over millions of production queries."
            }
        },
        {
            "title": "Production Scaling Law Estimator: Simulating Power-Law Loss Projections & Compute Allocations in Python",
            "say": [
                "In this final section of Day 36, we synthesize all mathematical and economic principles into an authoritative, enterprise-grade tool: The Production Scaling Law Estimator and Compute Allocator. An enterprise AI architect is regularly presented with organizational requirements such as: 'We have 256 NVIDIA H100 GPUs allocated for 21 days. What model architecture should we train, how many tokens must we clean, what validation loss can we guarantee, and what will our per-query serving cost be?' Answering these questions requires integrating hardware FLOP utilization, power-law projections, and parametric loss modeling.",
                "Let us walk through the complete calculation pipeline implemented in our sovereign Python engine. The engine accepts hardware specifications: number of GPU accelerators N_gpu, accelerator peak theoretical throughput T_peak (for an H100 SXM5, peak theoretical 16-bit Tensor Core performance is 989.5 teraFLOPs, or 9.895 * 10^14 FLOP/s), total training duration in hours, and Model FLOPs Utilization (MFU).",
                "Model FLOPs Utilization (MFU) is the critical bridge between theoretical hardware capability and realized training throughput. MFU is defined as the ratio of observed floating-point operations (calculated via C = 6ND) to the theoretical maximum operations of the hardware: MFU = (Observed_FLOPs_per_sec) / (N_gpu * T_peak). In practice, communication overhead in distributed parallelism (all-reduce latency, pipeline bubbles), memory bandwidth stalls, and non-matrix operations (layer norms, activations) prevent hardware from running at 100% capacity. Well-optimized Megatron-LM clusters achieve 45% to 55% MFU, while poorly configured pipelines often languish below 25% MFU.",
                "Hardware topology plays a decisive role in governing realized MFU. Within a single 8-GPU HGX server node, NVLink bridges provide massive bi-directional bandwidth (900 GB/s on H100), allowing intra-node tensor parallel communication to achieve near-zero latency overhead. However, across multi-node cluster networks, communication must traverse InfiniBand or RoCE (RDMA over Converged Ethernet) switches with bandwidths typically limited to 400 Gb/s (50 GB/s) per GPU. If an architect misconfigures parallel dimensions—for instance, by splitting tensor-parallel groups across InfiniBand links rather than confining them strictly within NVLink domains—inter-node communication latency explodes, stalling Tensor Cores and causing MFU to plummet from 50% to under 20%.",
                "Using the realized compute budget C_realized = N_gpu * T_peak * MFU * Duration_seconds, our estimator calculates two contrasting architectural strategies: 1) The Hoffmann Chinchilla Strategy (compute-optimal 20:1 token-to-parameter parity); and 2) The LLaMA Over-Trained Strategy (compact architecture scaled across massive token volume for inference cost optimization).",
                "For each strategy, the engine computes: exact parameter count N, pre-training token count D, token-to-parameter ratio, estimated validation loss L(N, D) via Hoffmann's parametric loss equation, memory footprint for deployment in 16-bit precision, minimum GPU count required for inference serving, and the maximum concurrent user throughput achievable under standard memory bandwidth limits.",
                "In enterprise pre-training campaigns, training stability and checkpointing protocols must also be incorporated into the project timeline. Large-scale runs spanning billions of tokens periodically experience numerical anomalies, such as loss spikes caused by bad data batches or optimizer momentum instability. Production clusters integrate auxiliary loss terms (such as z-loss on logit projections: L_z = 1e-4 * log^2(sum(exp(z)))) to prevent logit explosion, while taking asynchronous snapshot checkpoints to NVMe storage every few hundred steps. Factoring a 3% to 5% temporal buffer for checkpoint serialization and warm restarts guarantees that pre-training campaigns finish strictly on schedule.",
                "By evaluating architectural paradigms side-by-side prior to cluster initialization, engineering leadership can make rigorous, data-driven trade-offs between pre-training wall-clock time, downstream model capability, and long-term operational budget. This eliminates multi-million-dollar training misallocations and provides stakeholders with transparent, predictable engineering timelines.",
                "In the following production-grade Python script, we execute the complete `ScalingLawEstimator` simulation. We will configure an enterprise cluster of 256 NVIDIA H100 GPUs running for 21 days at 48% MFU, project the optimal model parameters and token counts across all three regimes, and output an executive architectural decision matrix."
            ],
            "example": "Imagine a civil engineering firm planning a municipal reservoir. The engineers don't just order concrete; they model seasonal rainfall, evaporation rates, water pressure dynamics, and population growth over 50 years. The ScalingLawEstimator is that complete structural engineering suite for foundation AI models, ensuring the architectural reservoir is neither dangerously undersized nor wastefully over-built.",
            "code": """import math

class ScalingLawEstimator:
    def __init__(self, num_gpus: int, peak_tflops_per_gpu: float, mfu: float):
        self.num_gpus = num_gpus
        self.peak_flops = peak_tflops_per_gpu * 1e12
        self.mfu = mfu
        self.effective_flops_per_sec = num_gpus * self.peak_flops * mfu

    def compute_total_budget(self, duration_days: float) -> float:
        seconds = duration_days * 24 * 3600
        return self.effective_flops_per_sec * seconds

    def chinchilla_optimal(self, C: float):
        ratio_c = C / 5.88e23
        N = 70e9 * math.pow(ratio_c, 0.50)
        D = 1.4e12 * math.pow(ratio_c, 0.50)
        loss = 1.69 + 406.4 / math.pow(N, 0.34) + 410.7 / math.pow(D, 0.28)
        return N, D, loss

    def overtrained_compact(self, C: float, target_params: float):
        N = target_params
        D = C / (6.0 * N)
        loss = 1.69 + 406.4 / math.pow(N, 0.34) + 410.7 / math.pow(D, 0.28)
        return N, D, loss

estimator = ScalingLawEstimator(num_gpus=256, peak_tflops_per_gpu=989.5, mfu=0.48)
duration_days = 21.0
total_compute = estimator.compute_total_budget(duration_days)

n_chin, d_chin, loss_chin = estimator.chinchilla_optimal(total_compute)
n_over, d_over, loss_over = estimator.overtrained_compact(total_compute, target_params=8.0e9)

print("=== EXECUTIVE SCALING LAW DECISION MATRIX ===")
print(f"Cluster:       256x H100 SXM5 (989.5 TFLOPs FP16)")
print(f"Training Time: {duration_days:.1f} Days | Target MFU: {estimator.mfu*100:.1f}%")
print(f"Total Budget:  {total_compute:.2e} FLOPs")
print("-" * 65)
print("Option 1: Chinchilla Compute-Optimal Strategy")
print(f"  Model Size:        {n_chin / 1e9:6.2f}B parameters")
print(f"  Training Tokens:   {d_chin / 1e9:6.1f}B tokens")
print(f"  Token/Param Ratio: {d_chin / n_chin:6.1f}:1")
print(f"  Predicted Loss:    {loss_chin:.4f}")
print(f"  VRAM (FP16):       {n_chin * 2 / (1024**3):6.1f} GB (Requires Multi-GPU)")
print("-" * 65)
print("Option 2: LLaMA-Style Over-Trained Strategy (Inference-Optimal)")
print(f"  Model Size:        {n_over / 1e9:6.2f}B parameters")
print(f"  Training Tokens:   {d_over / 1e9:6.1f}B tokens")
print(f"  Token/Param Ratio: {d_over / n_over:6.1f}:1")
print(f"  Predicted Loss:    {loss_over:.4f}")
print(f"  VRAM (FP16):       {n_over * 2 / (1024**3):6.1f} GB (Fits on Single GPU!)")
print("-" * 65)
assert abs((6.0 * n_chin * d_chin) - total_compute) / total_compute < 1e-4
print("Assertion Passed: Total compute budget conservation verified!")
""",
            "output": """=== EXECUTIVE SCALING LAW DECISION MATRIX ===
Cluster:       256x H100 SXM5 (989.5 TFLOPs FP16)
Training Time: 21.0 Days | Target MFU: 48.0%
Total Budget:  2.21e+23 FLOPs
-----------------------------------------------------------------
Option 1: Chinchilla Compute-Optimal Strategy
  Model Size:         42.88B parameters
  Training Tokens:    857.5B tokens
  Token/Param Ratio:   20.0:1
  Predicted Loss:    1.9758
  VRAM (FP16):         79.9 GB (Requires Multi-GPU)
-----------------------------------------------------------------
Option 2: LLaMA-Style Over-Trained Strategy (Inference-Optimal)
  Model Size:          8.00B parameters
  Training Tokens:   4596.1B tokens
  Token/Param Ratio:  574.5:1
  Predicted Loss:    1.9815
  VRAM (FP16):         14.9 GB (Fits on Single GPU!)
-----------------------------------------------------------------
Assertion Passed: Total compute budget conservation verified!""",
            "codeNotes": [
                "Line 3-9: Calculates realized compute budget factoring in GPU count, hardware peak theoretical TFLOPs, and MFU.",
                "Line 13-20: Solves Chinchilla IsoFLOP minimum for 2.21e23 FLOPs, yielding a 42.9B model trained on 857.5B tokens.",
                "Line 22-28: Projects an 8B model over-trained on 4.6T tokens, demonstrating competitive loss with a single-GPU VRAM footprint (14.9 GB)."
            ],
            "tryIt": "Increase MFU from 48% to 55% (achievable with FlashAttention-2 and Triton kernel fusion) and see how many additional tokens can be trained in the same 21 days.",
            "check": {
                "question": "What does Model FLOPs Utilization (MFU) measure, and why is it essential when translating theoretical compute budgets into physical training schedules?",
                "options": [
                    "MFU measures the ratio of executed model floating-point operations to the theoretical maximum peak throughput of the hardware, capturing distributed communication bubbles, memory bandwidth overhead, and kernel stalls.",
                    "MFU measures the percentage of GPU VRAM consumed by model weights during forward passes.",
                    "MFU measures the ratio of training tokens to validation tokens in the dataset.",
                    "MFU measures the rate at which floating-point numbers underflow to zero in 16-bit precision."
                ],
                "answer": 0,
                "answerIndex": 0,
                "why": "MFU = (Observed_FLOPs_per_sec) / (Num_GPUs * Peak_FLOPs_per_sec). Because real-world distributed clusters lose time to all-reduce synchronization, pipeline bubbles, and non-GEMM memory bandwidth operations, MFU (typically 40-55%) is required to determine actual wall-clock training time.",
                "explanation": "MFU = (Observed_FLOPs_per_sec) / (Num_GPUs * Peak_FLOPs_per_sec). Because real-world distributed clusters lose time to all-reduce synchronization, pipeline bubbles, and non-GEMM memory bandwidth operations, MFU (typically 40-55%) is required to determine actual wall-clock training time."
            }
        }
    ]
}
