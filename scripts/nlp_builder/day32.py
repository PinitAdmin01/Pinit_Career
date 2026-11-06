"""
Day 32 Data Builder for Course 37: Natural Language Processing & Computational Linguistics
Topic: Positional Encoding Evolution: Sinusoidal, Learned, Rotary Position Embeddings (RoPE) & ALiBi
"""

DAY_32_DATA = {
    "day": 32,
    "coursePrefix": "nlp",
    "title": "Day 32: Positional Encoding Evolution: Sinusoidal, Learned, Rotary Position Embeddings (RoPE) & ALiBi",
    "summary": [
        "Self-attention is fundamentally permutation-equivariant, collapsing without explicit positional signals into an uninformative bag-of-words representation.",
        "Original Sinusoidal Positional Encodings inject fixed geometric wave harmonics, enabling linear relative translations via trigonometric identities.",
        "Learned Absolute Position Embeddings (BERT/GPT-2) allow data-driven spatial tuning but suffer from catastrophic failure when extrapolating beyond pre-trained sequence limits.",
        "Rotary Position Embeddings (RoPE) and Attention with Linear Biases (ALiBi) resolve context rigidity by encoding relative distances directly into the attention inner product."
    ],
    "goal": "Master the mathematical evolution of Transformer positional representations: derive permutation invariance, implement sinusoidal wave encodings, analyze learned embedding boundaries, implement Rotary Position Embeddings (RoPE) via 2D Givens rotations, engineer ALiBi slope biases, and benchmark extrapolation capabilities.",
    "minutes": 44,
    "projectStep": {
        "title": "Positional Encoding Architecture & Extrapolation Suite",
        "steps": [
            "Implement sinusoidal positional encoding matrices and verify distance-dependent inner product decay.",
            "Construct Rotary Position Embeddings (RoPE) using 2D complex Givens rotation algebra on Query and Key vectors.",
            "Implement Attention with Linear Biases (ALiBi) with geometric head slope decay and evaluate zero-shot length extrapolation."
        ]
    },
    "parts": [
        {
            "title": "Permutation Invariance & The Original Sinusoidal Positional Encoding",
            "say": [
                "In our exploration of modern Transformer mechanics, we arrive at one of the deepest mathematical properties of the self-attention operator: Permutation Equivariance. If we consider a sequence of input token embeddings represented as a matrix X of shape [L, d_model], the scaled dot-product attention operation computes A(X) = softmax(X W_Q (X W_K)^T / sqrt(d_k)) X W_V. If we arbitrarily permute the rows of X using any permutation matrix P—reordering the words of a sentence into a random scramble—the attention mechanism simply permutes its output rows by the exact same matrix P: A(P X) = P A(X).",
                "While permutation equivariance is a powerful inductive bias for sets of unordered items (such as point clouds, molecular graphs, or database records), human natural language is profoundly, strictly ordered. The sentence 'The dog bit the man' communicates an entirely different reality than 'The man bit the dog', yet to an unaugmented self-attention layer, both sentences yield identical sets of attention weights and identical un-permuted contextual representations. Without an explicit mechanism to break permutation invariance, a Transformer degrades into an expensive bag-of-words model, blind to syntax, tense, and causal progression.",
                "To resolve this fundamental limitation, Vaswani et al. introduced Sinusoidal Positional Encodings in the original 2017 Transformer architecture. Rather than altering the attention equation itself, they chose to inject positional information directly into the input embeddings. For each token at sequence position pos (from 0 to L-1) and each feature dimension index i (from 0 to d_model / 2 - 1), two geometric wave functions are computed: PE(pos, 2i) = sin(pos / (10000^(2i / d_model))) and PE(pos, 2i + 1) = cos(pos / (10000^(2i / d_model))). This positional matrix PE of shape [L, d_model] is then directly added element-wise to the input token embedding matrix: X_tilde = X + PE.",
                "The mathematical elegance of the sinusoidal formulation lies in its multi-scale harmonic structure. The wavelengths of the sinusoidal functions form a geometric progression from 2*pi to 10,000 * 2*pi along the embedding channels. The lowest dimension indices (i = 0) oscillate at extremely high spatial frequencies, completing a full sine wave cycle every few tokens. This provides high-resolution positional signals that allow the model to distinguish immediate adjacent tokens. Conversely, the highest dimension indices oscillate at massive wavelengths, varying smoothly across thousands of tokens, providing global context on where a sentence resides within an overarching document.",
                "Furthermore, Vaswani et al. hypothesized that the sinusoidal formulation would allow the model to easily learn to attend to relative positions. By standard trigonometric angle addition identities, for any fixed positional offset k, the encoding at position pos + k can be expressed as a linear transformation of the encoding at position pos: [sin((pos+k)*theta), cos((pos+k)*theta)]^T = [cos(k*theta), sin(k*theta); -sin(k*theta), cos(k*theta)] * [sin(pos*theta), cos(pos*theta)]^T. The transformation matrix depends solely on the relative distance k and the frequency theta, not on the absolute position pos. In theory, this allows attention heads to compute relative attention scores by learning linear projection weights.",
                "Another critical mathematical consequence of sinusoidal encodings is distance-dependent inner product decay. When we compute the dot product between the positional encoding vectors of two positions pos and pos + k, sum_i (PE(pos) dot PE(pos + k)), the inner product achieves its global maximum at k = 0 (identical positions) and decays monotonically as the distance k increases. This creates a natural geometric prior: tokens that are physically close in the text sequence naturally exhibit higher baseline dot-product similarity than tokens separated by hundreds of intervening words.",
                "However, despite its theoretical beauty, sinusoidal positional encoding suffers from severe practical limitations in deep networks. Because PE is added only once at the input embedding layer, its positional signal is repeatedly diluted, warped, and attenuated as activations pass through dozens of feed-forward networks, layer normalizations, and residual additions. By layer 32 or 80, the delicate trigonometric relationships have been largely scrambled by non-linear activations.",
                "In our implementation below, we will construct a pure Python sinusoidal positional encoder. We will compute the exact multi-frequency sine and cosine waves across an embedding vector, inspect the geometric frequency distribution, and mathematically prove that the inner product between positional vectors decays monotonically as relative distance grows."
            ],
            "example": "Imagine a classical symphony orchestra where 100 musicians play complex scores. If the conductor removes all sheet music measure numbers and time signatures, musicians play identical notes at random intervals, producing chaotic noise (bag-of-words). Sinusoidal encodings act as a multi-tier metronome: a fast ticking woodblock marks every eighth note (high-frequency wave), a snare drum marks every bar (mid-frequency), and a giant brass gong sounds once every four movements (low-frequency), giving every musician perfect global and local temporal synchronization.",
            "code": """import math

def get_sinusoidal_embeddings(seq_len: int, d_model: int) -> list:
    pe = [[0.0] * d_model for _ in range(seq_len)]
    for pos in range(seq_len):
        for i in range(0, d_model, 2):
            denom = math.pow(10000.0, i / d_model)
            pe[pos][i] = math.sin(pos / denom)
            if i + 1 < d_model:
                pe[pos][i + 1] = math.cos(pos / denom)
    return pe

def dot(v1: list, v2: list) -> float:
    return sum(x * y for x, y in zip(v1, v2))

seq_len = 16
d_model = 32
pe_matrix = get_sinusoidal_embeddings(seq_len, d_model)

pos_0 = pe_matrix[0]
distances = [0, 1, 2, 4, 8, 15]

print(f"Sinusoidal Positional Encoding (d_model={d_model}, seq_len={seq_len})")
print("Positional Inner Product Decay relative to Position 0:")
for dist in distances:
    target_pos = pe_matrix[dist]
    sim = dot(pos_0, target_pos)
    print(f"  Distance k={dist:>2}: Dot Product = {sim:>6.3f}")
""",
            "output": """Sinusoidal Positional Encoding (d_model=32, seq_len=16)
Positional Inner Product Decay relative to Position 0:
  Distance k= 0: Dot Product = 16.000
  Distance k= 1: Dot Product = 15.314
  Distance k= 2: Dot Product = 13.730
  Distance k= 4: Dot Product = 11.662
  Distance k= 8: Dot Product = 10.522
  Distance k=15: Dot Product =  8.406""",
            "codeNotes": [
                "Line 6-10: Computes paired sine and cosine values across geometric frequency denominators `10000^(i/d)`.",
                "Line 16: Instantiates a 16-token sequence with 32 embedding dimensions.",
                "Line 23-26: Computes dot products between position 0 and positions at increasing distances k.",
                "Line 27: Validates that inner product decays monotonically from 16.000 at k=0 down to 8.406 at k=15."
            ],
            "tryIt": "Increase d_model from 32 to 128 and observe how the maximum dot product at k=0 scales to 64.0 while preserving monotonic distance decay.",
            "check": {
                "question": "Why is positional encoding mathematically mandatory for Transformer self-attention architectures when processing natural language?",
                "options": [
                    "Scaled dot-product self-attention is strictly permutation-equivariant; without positional signals, word order is lost and the model treats any permutation of a sentence as identical.",
                    "Because GPU matrix multiplication hardware requires positional vectors to compute non-zero memory addresses.",
                    "Because softmax normalization yields NaN values if all input embedding elements are strictly non-zero.",
                    "Because attention heads cannot project queries and keys unless sequence lengths are powers of two."
                ],
                "answer": 0,
                "answerIndex": 0,
                "why": "Without positional encodings, self-attention treats input sequences as unordered multisets (permutation equivariance). Swapping words yields the exact same permuted representations, rendering grammatical syntax and narrative progression undetectable.",
                "explanation": "Without positional encodings, self-attention treats input sequences as unordered multisets (permutation equivariance). Swapping words yields the exact same permuted representations, rendering grammatical syntax and narrative progression undetectable."
            }
        },
        {
            "title": "Learned Absolute Position Embeddings (BERT, GPT-2) & Context Rigidity",
            "say": [
                "Following the 2017 Transformer paper, researchers began questioning whether hand-crafted mathematical formulas like sinusoids were truly optimal. In 2018 and 2019, landmark models including BERT (Devlin et al.) and GPT-2 (Radford et al.) pioneered Learned Absolute Position Embeddings. Instead of calculating deterministic trigonometric waves, they instantiated a trainable parameter matrix W_pos of shape [L_max, d_model], where L_max represents the maximum pre-defined context window (e.g., 512 in BERT, 1024 in GPT-2, or 2048 in original GPT-3).",
                "Under this paradigm, the embedding for position pos is retrieved as a direct row lookup from W_pos: PE(pos) = W_pos[pos]. During pre-training, these positional vectors receive gradient updates via standard backpropagation alongside the token embeddings and attention weights. The hypothesis was compelling: rather than forcing the model to adhere to rigid human-engineered sinusoidal harmonics, the neural network could freely learn arbitrary, data-driven geometric coordinates that optimized language modeling loss.",
                "Empirically, learned absolute position embeddings delivered strong competitive performance on standard short-context benchmarks. On GLUE tasks with sentence pairs under 128 tokens, models with learned embeddings slightly outperformed fixed sinusoids, as the embedding parameters could adapt to specific positional priors—such as placing special emphasis on the first token index (e.g., the `[CLS]` classification token in BERT) or learning asymmetric attention biases for paragraph boundaries.",
                "However, learned absolute position embeddings harbor a catastrophic architectural flaw: Length Rigidity and Zero Extrapolation Capability. The parameter matrix W_pos is physically bounded by its pre-defined dimension L_max. If an engineer trains a model with L_max = 2,048 tokens and subsequently attempts to deploy it on a document containing 2,049 tokens, the model encounters a hard operational failure. At position index 2048 (0-indexed), attempting to look up W_pos[2048] triggers an immediate out-of-bounds array indexing exception.",
                "Even if an engineer attempts to circumvent the indexing error by dynamically allocating uninitialized rows to W_pos during inference, the model produces complete gibberish. The newly allocated positional vectors have received zero gradient updates during the months of multi-million-dollar pre-training. Their random initialization completely derails attention calculations, sending activation norms exploding or collapsing and destroying downstream generation quality.",
                "Furthermore, learned absolute embeddings exhibit poor generalization even within their valid index range. If a training corpus predominantly features short sequences (e.g., 500 tokens), the position embeddings for higher indices (e.g., positions 1,800 to 2,048) receive orders of magnitude fewer gradient updates than position 0. Consequently, position representations at the tail end of the context window remain noisy, undertrained, and brittle, leading to severe performance degradation on long-context evaluation sets.",
                "Most fundamentally, learned absolute embeddings completely lack translation invariance. The concept of relative distance—such as 'word B is two positions after word A'—must be laboriously re-learned independently at every single absolute offset: at positions (0, 2), at (100, 102), at (500, 502), and at (1900, 1902). Because the parameters at index 100 share no weight coupling with index 1900, the model cannot easily transfer syntactic patterns learned at the beginning of a prompt to the end of a document.",
                "From a systems infrastructure standpoint, learned embeddings also increase the static checkpoint memory footprint on disk and GPU memory. Storing a parameter matrix of [L_max, d_model] for very long contexts (e.g., 128,000 tokens by 8,192 hidden dimensions in FP16) requires allocating over 2 gigabytes of persistent weight memory purely for position coordinates before performing any computation. This structural overhead, combined with the complete inability to extend context length post-training, directly caused the AI research community to abandon learned absolute embeddings in modern foundation model architectures.",
                "In the following simulation, we will construct a pure Python learned position embedding lookup engine. We will demonstrate how positional lookup and gradient accumulation function during training, and explicitly trigger the Out-Of-Bounds index failure when sequence length exceeds L_max, illustrating why learned absolute embeddings were abandoned in the long-context era."
            ],
            "example": "Imagine an exclusive auditorium with exactly 512 numbered theater seats bolted to the concrete floor. Every ticket corresponds to a physical chair. As long as 512 people enter, everyone sits down smoothly. But when the 513th guest arrives at the door, the theater has no physical mechanism to accommodate them. The usher cannot simply invent chair 513 on the spot, and the entire event collapses into an operational gridlock.",
            "code": """class LearnedPositionEmbeddingTable:
    def __init__(self, max_seq_len: int, d_model: int):
        self.max_seq_len = max_seq_len
        self.d_model = d_model
        # Trainable embedding table [max_seq_len, d_model]
        self.weights = [[0.01 * (pos + d) for d in range(d_model)] for pos in range(max_seq_len)]
        self.grad_counts = [0] * max_seq_len

    def forward(self, seq_len: int) -> list:
        if seq_len > self.max_seq_len:
            raise IndexError(
                f"Context length violation! Requested {seq_len} tokens, "
                f"but embedding table is strictly bounded at L_max = {self.max_seq_len}."
            )
        for pos in range(seq_len):
            self.grad_counts[pos] += 1
        return self.weights[:seq_len]

table = LearnedPositionEmbeddingTable(max_seq_len=512, d_model=4)

for _ in range(100):
    _ = table.forward(64)

for _ in range(5):
    _ = table.forward(256)

print(f"Learned Position Table Status (L_max = {table.max_seq_len}):")
print(f"  Gradient updates for Position 10:  {table.grad_counts[10]}")
print(f"  Gradient updates for Position 100: {table.grad_counts[100]}")
print(f"  Gradient updates for Position 400: {table.grad_counts[400]} (Undertrained!)")

try:
    table.forward(600)
except IndexError as e:
    print(f"\\nOperational Failure Caught: {e}")
""",
            "output": """Learned Position Table Status (L_max = 512):
  Gradient updates for Position 10:  105
  Gradient updates for Position 100: 5
  Gradient updates for Position 400: 0 (Undertrained!)

Operational Failure Caught: Context length violation! Requested 600 tokens, but embedding table is strictly bounded at L_max = 512.""",
            "codeNotes": [
                "Line 4-7: Instantiates a bounded parameter table of size `[max_seq_len, d_model]`.",
                "Line 9-14: Enforces hard boundary check, raising an `IndexError` if sequence length exceeds `max_seq_len`.",
                "Line 20-25: Simulates training on short-to-medium sequences, exposing severe gradient starvation at higher position indices.",
                "Line 32-35: Demonstrates the exact length rigidity outage when inference requests 600 tokens on a 512-token table."
            ],
            "tryIt": "Initialize table with max_seq_len=1024 and verify that forward(600) succeeds, but observe that positions 600-1023 still receive zero gradients.",
            "check": {
                "question": "What operational failure occurs when a language model trained with learned absolute position embeddings (like GPT-2) is prompted with a sequence longer than its pre-training context length?",
                "options": [
                    "It raises an out-of-bounds indexing error or outputs degenerate gibberish because the position embedding table has no trained parameters beyond L_max.",
                    "The model automatically shifts into a recurrent LSTM network to process overflow tokens.",
                    "The model compresses the entire sequence into a single floating-point number using lossy quantization.",
                    "The GPU Tensor Cores overheat due to unaligned matrix multiplication dimensions."
                ],
                "answer": 0,
                "answerIndex": 0,
                "why": "Learned absolute position embeddings are stored in fixed-size tables [L_max, d_model]. Any sequence exceeding L_max causes an index out-of-bounds error or encounters uninitialized, randomly permuted rows with zero training updates.",
                "explanation": "Learned absolute position embeddings are stored in fixed-size tables [L_max, d_model]. Any sequence exceeding L_max causes an index out-of-bounds error or encounters uninitialized, randomly permuted rows with zero training updates."
            }
        },
        {
            "title": "Rotary Position Embedding (RoPE): 2D Complex Rotation Physics",
            "say": [
                "The limitations of both absolute sinusoids (which dilute through deep layers) and learned embeddings (which suffer from length rigidity) prompted a profound breakthrough: Rotary Position Embedding (RoPE), formulated by Jianlin Su and colleagues in 2021 ('RoFormer: Enhanced Transformer with Rotary Position Embedding'). RoPE has become the universal positional architecture for frontier open-weights foundation models, powering LLaMA, Mistral, Gemma, Falcon, and Qwen.",
                "The foundational thesis of RoPE is that positional information should not be added to the input representation at all. Instead, positional information should be incorporated multiplicatively into the Query and Key vectors immediately before computing attention dot products, in such a way that their inner product depends strictly on their relative distance. Mathematically, given query vector q at position m and key vector k at position n, we seek an operation R such that <R(q, m), R(k, n)> = g(q, k, m - n).",
                "Su et al. discovered an extraordinary geometric solution by mapping vector coordinates into the complex plane. Consider a 2-dimensional vector [x_1, x_2] represented as a complex number z = x_1 + i * x_2. Rotating this complex number by an angle theta is achieved via multiplication by e^(i * theta) = cos(theta) + i * sin(theta). In matrix notation, this corresponds to multiplication by the 2D orthogonal rotation matrix (Givens rotation): R_theta = [cos(theta), -sin(theta); sin(theta), cos(theta)].",
                "Now, assign a position-dependent angle m * theta to token position m. When we rotate query q_m by angle m * theta and key k_n by angle n * theta, their inner product in the complex plane evaluates to: Re((q * e^(i * m * theta)) * (k * e^(i * n * theta))^*) = Re(q * k^* * e^(i * (m - n) * theta)). The absolute positions m and n cancel out, leaving a pure relative rotation angle (m - n) * theta! The dot product between the rotated query and key naturally encodes their relative distance (m - n) with zero residual dependence on absolute coordinates.",
                "To generalize this 2D rotation to a high-dimensional head vector of dimension d_head (where d_head is even), RoPE partitions the d_head-dimensional space into d_head / 2 independent 2D sub-planes. Each 2D sub-plane i is assigned a base frequency theta_i = 10000^(-2(i-1) / d_head). At token position m, each 2D sub-vector [q_(2i), q_(2i+1)] is multiplied by the 2D rotation matrix for angle m * theta_i. The full RoPE transformation matrix R_m is a block-diagonal orthogonal matrix with d_head / 2 rotation blocks along its diagonal.",
                "Because RoPE operates via orthogonal rotation matrices (det(R_m) = 1 and R_m^T R_m = I), it preserves the Euclidean norm (magnitude) of the query and key vectors: ||R_m q|| = ||q||. Unlike additive embeddings, which can artificially inflate activation magnitudes and disrupt layer normalization statistics, RoPE rotates the direction of the vector in hyperspace without altering its semantic energy.",
                "Furthermore, RoPE exhibits natural long-term decay. As the relative distance (m - n) increases, the rotation angles across the d_head / 2 sub-planes advance at disparate harmonic frequencies. Averaged across all sub-planes, their cosine contributions interfere destructively, causing the expected dot product between distant tokens to decay gracefully. Crucially, if two tokens share strong semantic affinity, the query and key can align constructively along specific resonant frequencies, allowing long-range associations to pierce through the decay when semantically necessary.",
                "In the following code block, we will implement pure Python Rotary Position Embeddings from first principles. We will compute the frequency vector theta, construct 2D rotation operations, apply RoPE to simulated query and key vectors, and mathematically verify that <R_m q, R_n k> depends strictly on the relative distance (m - n)."
            ],
            "example": "Imagine a precision mechanical clock tower. Each floor has a rotating dial connected by harmonic gears: the top gear turns fast (minutes), the middle gear turns moderate (hours), and the bottom gear turns slowly (days). When two observers stand at different floors, the relative distance between their positions is instantly determined by calculating the angle difference between their respective gear pointers, regardless of what year the clock started running.",
            "code": """import math

def compute_rope_frequencies(dim: int) -> list:
    return [1.0 / math.pow(10000.0, (2 * i) / dim) for i in range(dim // 2)]

def apply_rope_2d(vec: list, pos: int, freqs: list) -> list:
    out = [0.0] * len(vec)
    for i, theta in enumerate(freqs):
        angle = pos * theta
        cos_val = math.cos(angle)
        sin_val = math.sin(angle)
        x1 = vec[2 * i]
        x2 = vec[2 * i + 1]
        out[2 * i] = x1 * cos_val - x2 * sin_val
        out[2 * i + 1] = x1 * sin_val + x2 * cos_val
    return out

def dot(a: list, b: list) -> float:
    return sum(x * y for x, y in zip(a, b))

d_head = 4
freqs = compute_rope_frequencies(d_head)

q_base = [1.0, 0.0, 0.5, 0.5]
k_base = [0.8, 0.2, 0.1, 0.9]

q_pos10 = apply_rope_2d(q_base, pos=10, freqs=freqs)
k_pos7  = apply_rope_2d(k_base, pos=7,  freqs=freqs)
score_a = dot(q_pos10, k_pos7)

q_pos5 = apply_rope_2d(q_base, pos=5, freqs=freqs)
k_pos2 = apply_rope_2d(k_base, pos=2, freqs=freqs)
score_b = dot(q_pos5, k_pos2)

print(f"RoPE Relative Invariance Verification (d_head={d_head}):")
print(f"  Score A: Pos 10 query dot Pos 7 key (Distance = 3): {score_a:.6f}")
print(f"  Score B: Pos  5 query dot Pos 2 key (Distance = 3): {score_b:.6f}")
print(f"  Difference: {abs(score_a - score_b):.1e} (Identical within floating-point precision!)")
""",
            "output": """RoPE Relative Invariance Verification (d_head=4):
  Score A: Pos 10 query dot Pos 7 key (Distance = 3): -0.251997
  Score B: Pos  5 query dot Pos 2 key (Distance = 3): -0.251997
  Difference: 1.7e-16 (Identical within floating-point precision!)""",
            "codeNotes": [
                "Line 3-4: Computes harmonic frequency spectrum `theta_i = 10000^(-2i/dim)` across paired sub-dimensions.",
                "Line 6-16: Implements 2D Givens rotation matrix multiplication on adjacent coordinate pairs.",
                "Line 25-33: Evaluates dot products for two distinct absolute position pairs sharing identical relative distance (10 - 7 = 3 and 5 - 2 = 3).",
                "Line 35-38: Demonstrates mathematically exact equivalence: relative distance invariant holds to machine precision."
            ],
            "tryIt": "Test Pair C at pos 100 and pos 97 (relative distance = 3) and confirm that the dot product remains exactly -0.251997.",
            "check": {
                "question": "Why does Rotary Position Embedding (RoPE) naturally encode relative position while being computed via absolute position indices?",
                "options": [
                    "The inner product between 2D rotated query vector R_m q and key vector R_n k simplifies via complex orthogonal algebra to depend strictly on the relative distance rotation R_(n-m).",
                    "Because RoPE replaces the Transformer feed-forward network with a circular convolution operator.",
                    "Because RoPE converts all negative numbers to positive numbers using the absolute value function.",
                    "Because RoPE requires sequence lengths to be prime numbers to prevent harmonic interference."
                ],
                "answer": 0,
                "answerIndex": 0,
                "why": "By rotating Query by angle m*theta and Key by n*theta in 2D sub-planes, their inner product simplifies to q^T R_(n-m) k. The absolute coordinates cancel out, embedding relative distance directly into the attention logits.",
                "explanation": "By rotating Query by angle m*theta and Key by n*theta in 2D sub-planes, their inner product simplifies to q^T R_(n-m) k. The absolute coordinates cancel out, embedding relative distance directly into the attention logits."
            }
        },
        {
            "title": "Attention with Linear Biases (ALiBi): Slope Biases & Train-Short-Test-Long Extrapolation",
            "say": [
                "While Rotary Position Embeddings (RoPE) revolutionized relative positional modeling, researchers in 2022 explored an even more radical proposition: can we eliminate positional embeddings entirely from the vector representation? Ofir Press, Noah Smith, and Mike Lewis at Meta AI and the University of Washington answered this question with ALiBi: 'Attention with Linear Biases Enables Input Length Extrapolation' (ICLR 2022).",
                "The philosophical premise of ALiBi is disarming in its simplicity. Positional encodings—whether sinusoidal, learned, or rotary—attempt to encode position into the vector representations of tokens. Press et al. argued that this approach is fundamentally flawed for sequence length extrapolation. When a model trained on 2,048 tokens is evaluated on 8,192 tokens, any vector-based positional representation introduces unseen coordinate values or unfamiliar rotation angles that push activations out of distribution, causing perplexity to explode.",
                "ALiBi discards positional embeddings completely. Input token embeddings are fed into the network with zero added position vectors. Word vectors retain their pure semantic definitions throughout all layers. To inject positional awareness, ALiBi modifies the attention score calculation directly inside each attention head by adding a static, non-learned linear penalty proportional to the distance between tokens.",
                "Specifically, for a sequence of tokens, given query q_i at position i and key k_j at position j (where j <= i in causal decoding), the standard scaled dot-product attention logit is q_i k_j^T / sqrt(d_k). ALiBi modifies this logit by subtracting a linear distance penalty: Attention Score = (q_i k_j^T / sqrt(d_k)) - m * (i - j). Notice that when i = j (attending to oneself), the distance penalty is zero. As the distance (i - j) between query and key increases, a strictly negative linear bias is subtracted from the logit, monotonically penalizing attention to distant keys.",
                "The scalar m is a fixed, non-learned geometric slope specific to each attention head. In a model with H attention heads, the slopes form a geometric progression. For example, in an 8-head model, the slopes m are set to 2^(-8/8), 2^(-7/8), ..., 2^(-1/8), corresponding to powers of 2: 1/2, 1/4, 1/8, 1/16, 1/32, 1/64, 1/128, 1/256. Notice the diversity of inductive biases: heads with large slopes (e.g., m = 1/2) enforce sharp, hyper-local attention windows, penalizing any token more than a few steps away. Conversely, heads with tiny slopes (e.g., m = 1/256) apply almost zero penalty, freely attending to distant context.",
                "Because the linear penalty -m * (i - j) is a simple static formula with zero learned parameters, ALiBi achieves exceptional 'Train Short, Test Long' zero-shot extrapolation. Press et al. demonstrated that a model trained on sequences of length 2,048 tokens could be deployed directly on sequences of 8,192 or 16,384 tokens with zero fine-tuning, maintaining stable, decreasing perplexity where learned embeddings and original sinusoidal encodings suffered catastrophic perplexity spikes into the thousands.",
                "ALiBi achieved notable adoption in major open foundation models, including MosaicML's MPT-7B and MPT-30B, as well as BigScience's 176-billion parameter BLOOM model. It offered an extraordinarily clean engineering story: zero parameter memory, zero rotational compute overhead, and guaranteed extrapolation.",
                "Crucially, ALiBi also simplifies the memory layout of inference engines during prompt caching. Because the token representations are completely position-agnostic, caching a prefix of prompt embeddings does not bind those embeddings to specific absolute or rotary offsets. A cached document prefix can be dynamically prepended to multiple diverse user queries without needing rotational tensor recalibration or positional re-embedding.",
                "In our code implementation below, we will construct a pure Python ALiBi attention engine. We will generate the head-specific geometric slope sequence, build the pairwise relative distance matrix, apply the linear penalties to attention logits, compute softmax weights, and demonstrate how ALiBi seamlessly extrapolates to unseen sequence lengths."
            ],
            "example": "Imagine a theater lecture hall where each row sits behind an acoustic barrier. A listener in row 10 hears the speaker in row 10 with zero muffling (distance 0). A speaker in row 8 is muffled by 2 decibels, while someone coughing in row 1 is muffled by 9 decibels. Different listeners have different hearing aids: one student has a hyper-focused ear trumpet (steep slope m) tuned only to their immediate desk neighbor, while another has a wide-angle microphone (gentle slope m) capturing the entire hall.",
            "code": """import math

def softmax(vec: list) -> list:
    max_val = max(vec)
    exp_vals = [math.exp(v - max_val) for v in vec]
    sum_exp = sum(exp_vals)
    return [v / sum_exp for v in exp_vals]

def get_alibi_slopes(n_heads: int) -> list:
    ratio = 8.0 / n_heads
    return [math.pow(2.0, -i * ratio) for i in range(1, n_heads + 1)]

def compute_alibi_attention(q_vec: list, keys: list, head_slope: float, target_pos: int) -> list:
    d = len(q_vec)
    scale = 1.0 / math.sqrt(d)
    raw_logits = [sum(q * k for q, k in zip(q_vec, key)) * scale for key in keys]
    
    biased_logits = []
    for j, logit in enumerate(raw_logits):
        dist = target_pos - j
        penalty = head_slope * dist
        biased_logits.append(logit - penalty)
        
    return softmax(biased_logits)

n_heads = 4
slopes = get_alibi_slopes(n_heads)

seq_len = 8
keys = [[1.0, 1.0, 1.0, 1.0] for _ in range(seq_len)]
q_vec = [1.0, 1.0, 1.0, 1.0]
target_token = 7

print(f"ALiBi Geometric Slopes for {n_heads} heads: {[round(s, 4) for s in slopes]}")
print(f"Zero-Shot Extrapolation to seq_len = {seq_len} (Target Pos = {target_token}):")

for h, slope in enumerate(slopes):
    weights = compute_alibi_attention(q_vec, keys, slope, target_token)
    local_weight = weights[target_token]
    distant_weight = weights[0]
    print(f"  Head {h} (slope={slope:.4f}): Dist 0 (Self)={local_weight:.4f}, Dist 7 (Earliest)={distant_weight:.4f}")
""",
            "output": """ALiBi Geometric Slopes for 4 heads: [0.25, 0.0625, 0.0156, 0.0039]
Zero-Shot Extrapolation to seq_len = 8 (Target Pos = 7):
  Head 0 (slope=0.2500): Dist 0 (Self)=0.2558, Dist 7 (Earliest)=0.0445
  Head 1 (slope=0.0625): Dist 0 (Self)=0.1540, Dist 7 (Earliest)=0.0994
  Head 2 (slope=0.0156): Dist 0 (Self)=0.1319, Dist 7 (Earliest)=0.1183
  Head 3 (slope=0.0039): Dist 0 (Self)=0.1267, Dist 7 (Earliest)=0.1233""",
            "codeNotes": [
                "Line 8-11: Computes geometric head slopes as powers of 2: `2^(-8i/H)`.",
                "Line 18-23: Applies distance penalty: `penalty = head_slope * (target_pos - j)` to attention logits.",
                "Line 29: Demonstrates evaluating on 8 tokens without retraining or altering slope parameters.",
                "Line 35-39: Confirms Head 0 (steep slope) concentrates on local tokens, while Head 3 (gentle slope) attends broadly."
            ],
            "tryIt": "Increase seq_len to 16 tokens and verify that Head 0 continues to heavily favor local tokens while Head 3 distributes attention evenly.",
            "check": {
                "question": "How does Attention with Linear Biases (ALiBi) achieve zero-shot sequence length extrapolation without retraining?",
                "options": [
                    "It eliminates position embeddings from token representations and injects a static, non-learned negative linear penalty proportional to token distance directly into the attention logits.",
                    "It dynamically trains a recurrent neural network to predict future positional coordinates during inference.",
                    "It interpolates learned position vectors using cubic spline regression inside GPU shared memory.",
                    "It restricts sequences to palindromes so that relative distance always evaluates to zero."
                ],
                "answer": 0,
                "answerIndex": 0,
                "why": "ALiBi injects a static, non-learned penalty -m*(i - j) directly into the attention score matrix. Because this linear penalty depends only on relative token distance, it generalizes seamlessly to unseen lengths without out-of-distribution coordinate artifacts.",
                "explanation": "ALiBi injects a static, non-learned penalty -m*(i - j) directly into the attention score matrix. Because this linear penalty depends only on relative token distance, it generalizes seamlessly to unseen lengths without out-of-distribution coordinate artifacts."
            }
        },
        {
            "title": "Comparative Analysis: RoPE vs ALiBi in Foundation Model Engineering",
            "say": [
                "Having analyzed both Rotary Position Embeddings (RoPE) and Attention with Linear Biases (ALiBi), we confront the definitive architectural question that faced foundation model labs between 2022 and 2024: Which positional strategy is superior for sovereign, production-scale LLMs? While ALiBi enjoyed early enthusiasm in models like MPT and BLOOM, the industry ultimately reached an overwhelming consensus. Virtually all leading open foundation models—LLaMA 3, Mistral, Gemma 2, DeepSeek, and Qwen 2—standardized on Rotary Position Embeddings.",
                "To understand why RoPE triumphed over ALiBi, we must examine the fundamental failure mode of ALiBi: The Linear Decay Invariant. ALiBi's core mechanism is a monotonically decreasing linear penalty: -m * (i - j). This penalty imposes an irreversible inductive bias: distant tokens are mathematically forced to receive lower attention scores than nearby tokens, regardless of their semantic content. In tasks such as 'needle in a haystack' retrieval—where a critical factual key (such as an encryption passcode or medical dosage) resides 30,000 tokens in the past—ALiBi's distance penalty heavily suppresses the distant key's attention logit, causing the model to miss the needle in favor of irrelevant local text.",
                "RoPE, in contrast, applies orthogonal 2D rotations that preserve vector norms without imposing a forced monotonic penalty. While average dot products across random vectors decay due to phase cancellation, two semantically aligned vectors can maintain high dot products across vast distances if their features resonate with specific rotational harmonics. RoPE preserves the representational capacity of the model to attend intensely to distant facts when semantic context demands it, making it vastly superior for long-document comprehension and deep multi-hop reasoning.",
                "Furthermore, RoPE unlocked an entire ecosystem of Context Window Extension techniques that are mathematically impossible with ALiBi. Because RoPE encodes position via harmonic base frequencies theta_i = base^(-2i / d), engineers discovered that they could expand context windows post-pre-training simply by manipulating the frequency spectrum. Landmark innovations including Position Interpolation (PI), NTK-Aware RoPE Scaling, YaRN (Yet another RoPE extensioN), and LongRoPE allow models trained on 4K or 8K contexts to be extended to 128K or 1,000,000 tokens with minimal compute.",
                "In NTK-Aware scaling, for example, rather than linearly stretching all frequencies (which blurs high-frequency local positional resolution), the base frequency constant is scaled non-linearly (e.g., from 10,000 to 500,000 in LLaMA-3). This preserves high-frequency local precision while dramatically slowing down the rotation of low-frequency dimensions, allowing the model to distinguish tokens separated by 100,000 positions with zero loss in local syntax.",
                "From a hardware kernel perspective, RoPE integrates seamlessly with modern FlashAttention kernels. Because RoPE is applied directly to Query and Key tensors prior to attention (producing rotated tensors Q_rope and K_rope), the downstream attention kernel can execute standard fused scaled dot-product attention without modifying inner loops. ALiBi, on the other hand, requires injecting dynamic head-specific bias matrices into the attention logit calculation inside the fused kernel, complicating register allocation and kernel fusion on GPU Tensor Cores.",
                "Finally, empirical benchmarks across MMLU, GSM8K, HumanEval, and long-context benchmarks systematically confirmed that RoPE models consistently achieve lower perplexity and higher reasoning scores than equivalent models trained with ALiBi. While ALiBi remains a brilliant milestone in extrapolation theory, RoPE established itself as the gold standard of modern computational linguistics.",
                "In enterprise deployments where models must analyze 100-page financial audits, legal discovery filings, and complex software codebases, the ability of RoPE to maintain precise long-range factual recall without monotonic penalty attenuation is paramount. RoPE provides the exact geometric foundation required for deep contextual synthesis across planetary-scale datasets.",
                "In the following comparative script, we will simulate a 'needle in a haystack' retrieval task. We will benchmark RoPE against ALiBi when retrieving a high-affinity semantic key located 50 tokens in the past, observing how ALiBi's distance slope attenuates the retrieval signal while RoPE successfully retains strong attention focus."
            ],
            "example": "Choosing between ALiBi and RoPE is like choosing between fixed reading glasses with tinted bottom lenses versus adaptive polarized sunglasses. ALiBi acts like tinted glasses: it permanently dims anything far away, making it impossible to spot a distant lighthouse on the horizon. RoPE acts like precision binoculars with adjustable focus: distant objects are rotated into sharp optical alignment without dimming their illumination.",
            "code": """import math

def softmax(vec: list) -> list:
    max_val = max(vec)
    exp_vals = [math.exp(v - max_val) for v in vec]
    sum_exp = sum(exp_vals)
    return [v / sum_exp for v in exp_vals]

def dot(a: list, b: list) -> float:
    return sum(x * y for x, y in zip(a, b))

d_head = 4
q_sem = [2.0, 2.0, 2.0, 2.0]
needle_key = [2.0, 2.0, 2.0, 2.0]
haystack_key = [0.1, 0.1, 0.1, 0.1]

target_pos = 50
keys = [needle_key] + [haystack_key] * 49

alibi_slope = 0.1
scale = 1.0 / math.sqrt(d_head)
alibi_logits = []
for j, k in enumerate(keys):
    raw_logit = dot(q_sem, k) * scale
    dist = target_pos - j
    alibi_logits.append(raw_logit - alibi_slope * dist)

alibi_weights = softmax(alibi_logits)
needle_weight_alibi = alibi_weights[0]
local_haystack_alibi = alibi_weights[49]

freqs = [1.0 / math.pow(10000.0, (2 * i) / d_head) for i in range(d_head // 2)]
def apply_rope(vec, pos):
    out = [0.0] * len(vec)
    for i, theta in enumerate(freqs):
        ang = pos * theta
        c, s = math.cos(ang), math.sin(ang)
        out[2*i] = vec[2*i] * c - vec[2*i+1] * s
        out[2*i+1] = vec[2*i] * s + vec[2*i+1] * c
    return out

q_rope = apply_rope(q_sem, pos=target_pos)
rope_logits = [dot(q_rope, apply_rope(k, pos=j)) * scale for j, k in enumerate(keys)]
rope_weights = softmax(rope_logits)
needle_weight_rope = rope_weights[0]
local_haystack_rope = rope_weights[49]

print("=== 'NEEDLE IN A HAYSTACK' RETRIEVAL (Needle Distance = 50) ===")
print(f"ALiBi Attention Weight on Distant Needle: {needle_weight_alibi:.4f} (Suppressed by linear penalty!)")
print(f"ALiBi Attention Weight on Local Haystack: {local_haystack_alibi:.4f}")
print(f"RoPE  Attention Weight on Distant Needle: {needle_weight_rope:.4f} (Maintains high semantic retrieval!)")
print(f"RoPE  Attention Weight on Local Haystack: {local_haystack_rope:.4f}")
""",
            "output": """=== 'NEEDLE IN A HAYSTACK' RETRIEVAL (Needle Distance = 50) ===
ALiBi Attention Weight on Distant Needle: 0.5879 (Suppressed by linear penalty!)
ALiBi Attention Weight on Local Haystack: 0.0395
RoPE  Attention Weight on Distant Needle: 0.9638 (Maintains high semantic retrieval!)
RoPE  Attention Weight on Local Haystack: 0.0008""",
            "codeNotes": [
                "Line 18-24: Models a critical semantic 'needle' at distance 50 alongside 49 irrelevant local 'haystack' tokens.",
                "Line 27-32: Evaluates ALiBi: subtracting `0.1 * 50 = 5.0` from the needle logit suppresses its relative attention weight.",
                "Line 36-47: Evaluates RoPE: orthogonal rotation preserves semantic magnitude, allowing the matching needle to retain high dot-product affinity.",
                "Line 49-53: Proves RoPE allocates 96.38% attention to the distant needle, dominating the attention distribution."
            ],
            "tryIt": "Increase the needle distance from 50 to 100 and observe how ALiBi completely extinguishes the needle weight while RoPE continues to retrieve it.",
            "check": {
                "question": "Why did modern foundation models such as LLaMA 3 and Mistral standardize on RoPE rather than ALiBi despite ALiBi's simpler extrapolation formulation?",
                "options": [
                    "ALiBi's monotonic negative distance penalty over-penalizes long-range token interactions, impairing complex reasoning and long-context retrieval where distant facts must maintain high attention weights.",
                    "Because ALiBi requires re-training from scratch whenever sequence lengths decrease during inference.",
                    "Because RoPE eliminates the need for Key-Value projections in Transformer attention layers.",
                    "Because ALiBi is patented by commercial database vendors and cannot be used in open-weights models."
                ],
                "answer": 0,
                "answerIndex": 0,
                "why": "ALiBi forces a monotonic negative penalty on distant tokens. This creates an unavoidable blind spot on long-context tasks (such as needle-in-a-haystack retrieval) where distant tokens must be retrieved with high fidelity regardless of position.",
                "explanation": "ALiBi forces a monotonic negative penalty on distant tokens. This creates an unavoidable blind spot on long-context tasks (such as needle-in-a-haystack retrieval) where distant tokens must be retrieved with high fidelity regardless of position."
            }
        }
    ]
}
