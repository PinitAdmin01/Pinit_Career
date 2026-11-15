import { buildEnrichedDayQuests, type DayConfig } from './curriculumEnricher';
import type { CourseQuest } from './coursesData';
import { MONTH2_LESSON_INDEX } from './month2LessonIndex';

interface RawM2DayTask {
  day: number;
  fallbackTitle: string;
  eTitle: string;
  eDesc: string;
  eStarter: string;
  eHint: string;
  eTest: string;
  aTitle: string;
  aDesc: string;
  aStarter: string;
  aHint: string;
  aTest: string;
}

const RAW_M2_DAY_TASKS: RawM2DayTask[] = [
  {
    "day": 31,
    "fallbackTitle": "Advanced Attention Architectures: Multi-Query Attention (MQA), Grouped-Query Attention (GQA) & Sliding Window Attention",
    "eTitle": "Grouped-Query Attention (GQA) KV-Head Broadcaster & KV-Byte Analyzer",
    "eDesc": "Write `gqa_kv_stats(n_heads: int, n_kv_heads: int, head_dim: int, seq_len: int, bytes_per_elem: int = 2) -> dict`: validate `n_heads % n_kv_heads == 0`, compute `group_size = n_heads // n_kv_heads`, total KV-cache bytes `2 * seq_len * n_kv_heads * head_dim * bytes_per_elem`, and memory reduction ratio `round(n_heads / n_kv_heads, 4)`.",
    "eStarter": "def gqa_kv_stats(n_heads: int, n_kv_heads: int, head_dim: int, seq_len: int, bytes_per_elem: int = 2) -> dict:\n    # TODO\n    pass",
    "eHint": "def gqa_kv_stats(n_heads: int, n_kv_heads: int, head_dim: int, seq_len: int, bytes_per_elem: int = 2) -> dict:\n    if n_kv_heads <= 0 or n_heads % n_kv_heads != 0:\n        return {\"valid\": False, \"group_size\": 0, \"kv_bytes\": 0, \"reduction\": 0.0}\n    kv_b = 2 * seq_len * n_kv_heads * head_dim * bytes_per_elem\n    return {\"valid\": True, \"group_size\": n_heads // n_kv_heads, \"kv_bytes\": kv_b, \"reduction\": round(n_heads / n_kv_heads, 4)}",
    "eTest": "assert gqa_kv_stats(32, 8, 128, 100, 2) == {\"valid\": True, \"group_size\": 4, \"kv_bytes\": 409600, \"reduction\": 4.0}\nassert gqa_kv_stats(32, 5, 128, 100)[\"valid\"] is False\nassert gqa_kv_stats(16, 1, 64, 10, 2) == {\"valid\": True, \"group_size\": 16, \"kv_bytes\": 2560, \"reduction\": 16.0}\nprint('All checks passed.')",
    "aTitle": "Sliding-Window Causal Attention Mask & Sink-Token Router",
    "aDesc": "Write `sliding_window_mask(seq_len: int, window: int, sink_tokens: int = 0) -> list[list[int]]`: return binary `seq_len x seq_len` causal mask where query position `i` attends (`1`) to key `j <= i` iff `j < sink_tokens` OR `(i - j) < window` (`window >= 1`).",
    "aStarter": "def sliding_window_mask(seq_len: int, window: int, sink_tokens: int = 0) -> list[list[int]]:\n    # TODO\n    pass",
    "aHint": "def sliding_window_mask(seq_len: int, window: int, sink_tokens: int = 0) -> list[list[int]]:\n    return [[1 if (j <= i and (j < sink_tokens or (i - j) < window)) else 0 for j in range(seq_len)] for i in range(seq_len)]",
    "aTest": "assert sliding_window_mask(4, 2, 0) == [[1,0,0,0],[1,1,0,0],[0,1,1,0],[0,0,1,1]]\nassert sliding_window_mask(4, 2, 1)[3] == [1, 0, 1, 1]\nassert sliding_window_mask(0, 2) == []\nprint('All checks passed.')"
  },
  {
    "day": 32,
    "fallbackTitle": "Positional Encoding Evolution: Sinusoidal, Learned, Rotary Position Embeddings (RoPE) & ALiBi",
    "eTitle": "Rotary Position Embedding (RoPE) Pairwise 2D Vector Rotator",
    "eDesc": "Write `apply_rope_pair(vec: list[float], pos: int, base: float = 10000.0) -> list[float]`: rotate adjacent 2D pairs `(x0, x1)` at index pair `k = 0, 1, ...` (`dim = len(vec)`) by angle `theta = pos / (base ** (2 * k / dim))`: `(x0*cos - x1*sin, x0*sin + x1*cos)`, rounded to 6 decimals.",
    "eStarter": "import math\n\ndef apply_rope_pair(vec: list[float], pos: int, base: float = 10000.0) -> list[float]:\n    # TODO\n    pass",
    "eHint": "import math\n\ndef apply_rope_pair(vec: list[float], pos: int, base: float = 10000.0) -> list[float]:\n    d = len(vec)\n    out = [0.0] * d\n    for i in range(0, d, 2):\n        th = pos / (base ** (i / d))\n        c, s = math.cos(th), math.sin(th)\n        out[i] = round(vec[i] * c - vec[i + 1] * s, 6)\n        out[i + 1] = round(vec[i] * s + vec[i + 1] * c, 6)\n    return out",
    "eTest": "assert apply_rope_pair([1.0, 2.0, 3.0, 4.0], 0) == [1.0, 2.0, 3.0, 4.0]\nr = apply_rope_pair([1.0, 0.0], 1, 10000.0)\nassert abs(r[0] - 0.540302) < 1e-4 and abs(r[1] - 0.841471) < 1e-4\nassert apply_rope_pair([], 3) == []\nprint('All checks passed.')",
    "aTitle": "ALiBi Linear Relative-Distance Attention Bias Matrix",
    "aDesc": "Write `alibi_bias_matrix(seq_len: int, slope: float) -> list[list[float]]`: return lower-triangular bias matrix where entry `(i, j)` is `-slope * (i - j)` for `j <= i` and `-1e9` for future masked positions `j > i` (rounded to 4 decimals).",
    "aStarter": "def alibi_bias_matrix(seq_len: int, slope: float) -> list[list[float]]:\n    # TODO\n    pass",
    "aHint": "def alibi_bias_matrix(seq_len: int, slope: float) -> list[list[float]]:\n    return [[round(-slope * (i - j), 4) if j <= i else -1e9 for j in range(seq_len)] for i in range(seq_len)]",
    "aTest": "assert alibi_bias_matrix(3, 0.5) == [[0.0, -1e9, -1e9], [-0.5, 0.0, -1e9], [-1.0, -0.5, 0.0]]\nassert alibi_bias_matrix(1, 0.25) == [[0.0]]\nassert alibi_bias_matrix(0, 0.5) == []\nprint('All checks passed.')"
  },
  {
    "day": 33,
    "fallbackTitle": "Memory-Efficient Computation: FlashAttention Mathematical Tiling, Kernel Fusion & Online Softmax",
    "eTitle": "Safe Online Tiled Softmax & Running-Denominator Accumulator",
    "eDesc": "Write `online_softmax(logits: list[float], tile_size: int) -> list[float]`: simulate FlashAttention tiling maintaining running `(m, l)` statistics across chunks without materializing global max upfront; return exact softmax probabilities rounded to 6 decimals.",
    "eStarter": "import math\n\ndef online_softmax(logits: list[float], tile_size: int) -> list[float]:\n    # TODO\n    pass",
    "eHint": "import math\n\ndef online_softmax(logits: list[float], tile_size: int) -> list[float]:\n    if not logits:\n        return []\n    m, l_sum = float(\"-inf\"), 0.0\n    for idx in range(0, len(logits), max(1, tile_size)):\n        blk = logits[idx:idx + max(1, tile_size)]\n        m_blk = max(blk)\n        m_new = max(m, m_blk)\n        l_blk = sum(math.exp(x - m_new) for x in blk)\n        l_sum = (l_sum * math.exp(m - m_new) if m != float(\"-inf\") else 0.0) + l_blk\n        m = m_new\n    return [round(math.exp(x - m) / l_sum, 6) for x in logits]",
    "eTest": "assert online_softmax([1.0, 1.0], 1) == [0.5, 0.5]\nr = online_softmax([1000.0, 1001.0, 1000.0], 2)\nassert abs(sum(r) - 1.0) < 1e-5 and r[1] > r[0]\nassert online_softmax([], 4) == []\nprint('All checks passed.')",
    "aTitle": "Tiled Blockwise FlashAttention Weighted Output Accumulator",
    "aDesc": "Write `flash_attention_1d(scores: list[float], values: list[float], block_n: int) -> float`: perform 1D online FlashAttention updating `O` on-the-fly per tile (`O = O * exp(m_old - m_new) + sum(exp(s - m_new) * v)` normalized by final `l`), returning weighted scalar rounded to 6 decimals (`0.0` if empty).",
    "aStarter": "import math\n\ndef flash_attention_1d(scores: list[float], values: list[float], block_n: int) -> float:\n    # TODO\n    pass",
    "aHint": "import math\n\ndef flash_attention_1d(scores: list[float], values: list[float], block_n: int) -> float:\n    if not scores:\n        return 0.0\n    m, l_sum, acc = float(\"-inf\"), 0.0, 0.0\n    for i in range(0, len(scores), max(1, block_n)):\n        sc = scores[i:i + max(1, block_n)]\n        vs = values[i:i + max(1, block_n)]\n        m_new = max(m, max(sc))\n        scale = math.exp(m - m_new) if m != float(\"-inf\") else 0.0\n        acc = acc * scale + sum(math.exp(s - m_new) * v for s, v in zip(sc, vs))\n        l_sum = l_sum * scale + sum(math.exp(s - m_new) for s in sc)\n        m = m_new\n    return round(acc / l_sum, 6)",
    "aTest": "assert flash_attention_1d([1.0, 1.0], [2.0, 6.0], 1) == 4.0\nassert flash_attention_1d([100.0, 0.0, 0.0], [9.0, 0.0, 0.0], 2) == 9.0\nassert flash_attention_1d([], [], 2) == 0.0\nprint('All checks passed.')"
  },
  {
    "day": 34,
    "fallbackTitle": "Tokenizer Deep Dive: Byte-Pair Encoding (BPE), WordPiece, Unigram & Byte-Fallback Tokenization",
    "eTitle": "Deterministic BPE Pair-Frequency Merge Trainer",
    "eDesc": "Write `train_bpe_merges(corpus_words: dict[tuple[str, ...], int], num_merges: int) -> list[tuple[str, str]]`: perform `num_merges` iterations selecting highest-count adjacent pair (tie-break lexicographically ascending `(a, b)`), merging all adjacent occurrences across words and returning merge pairs in order.",
    "eStarter": "def train_bpe_merges(corpus_words: dict[tuple[str, ...], int], num_merges: int) -> list[tuple[str, str]]:\n    # TODO\n    pass",
    "eHint": "from collections import defaultdict\n\ndef train_bpe_merges(corpus_words: dict[tuple[str, ...], int], num_merges: int) -> list[tuple[str, str]]:\n    vocab = dict(corpus_words)\n    merges = []\n    for _ in range(num_merges):\n        pairs = defaultdict(int)\n        for w, freq in vocab.items():\n            for i in range(len(w) - 1):\n                pairs[(w[i], w[i + 1])] += freq\n        if not pairs:\n            break\n        best = min(pairs.keys(), key=lambda p: (-pairs[p], p))\n        merges.append(best)\n        new_vocab = {}\n        merged = best[0] + best[1]\n        for w, freq in vocab.items():\n            nw, i = [], 0\n            while i < len(w):\n                if i + 1 < len(w) and w[i] == best[0] and w[i + 1] == best[1]:\n                    nw.append(merged)\n                    i += 2\n                else:\n                    nw.append(w[i])\n                    i += 1\n            new_vocab[tuple(nw)] = new_vocab.get(tuple(nw), 0) + freq\n        vocab = new_vocab\n    return merges",
    "eTest": "corp = {(\"l\", \"o\", \"w\"): 5, (\"l\", \"o\", \"w\", \"e\", \"r\"): 2}\nassert train_bpe_merges(corp, 2) == [(\"l\", \"o\"), (\"lo\", \"w\")]\nassert train_bpe_merges({(\"a\",): 3}, 2) == []\nassert train_bpe_merges({}, 3) == []\nprint('All checks passed.')",
    "aTitle": "WordPiece Greedy Longest-Prefix Tokenizer with Byte Fallback",
    "aDesc": "Write `wordpiece_encode(word: str, vocab: set[str]) -> list[str]`: tokenize `word` greedily matching longest prefix (`sub` at offset 0, `\"##\" + sub` for continuation offsets); if no vocab subword matches at offset `i`, emit byte fallback `f\"<0x{b:02x}>\"` for each UTF-8 byte of `word[i]` and advance `1` character.",
    "aStarter": "def wordpiece_encode(word: str, vocab: set[str]) -> list[str]:\n    # TODO\n    pass",
    "aHint": "def wordpiece_encode(word: str, vocab: set[str]) -> list[str]:\n    out, i, n = [], 0, len(word)\n    while i < n:\n        matched = None\n        for j in range(n, i, -1):\n            cand = word[i:j] if i == 0 else \"##\" + word[i:j]\n            if cand in vocab:\n                matched = (cand, j)\n                break\n        if matched:\n            out.append(matched[0])\n            i = matched[1]\n        else:\n            for b in word[i].encode(\"utf-8\"):\n                out.append(f\"<0x{b:02x}>\")\n            i += 1\n    return out",
    "aTest": "assert wordpiece_encode(\"playing\", {\"play\", \"##ing\"}) == [\"play\", \"##ing\"]\nassert wordpiece_encode(\"play!\", {\"play\"}) == [\"play\", \"<0x21>\"]\nassert wordpiece_encode(\"\", {\"a\"}) == []\nprint('All checks passed.')"
  },
  {
    "day": 35,
    "fallbackTitle": "Milestone 7 Capstone: ApexTokenizer & Optimized Decoder Block Engine",
    "eTitle": "Milestone 7A: BPE Encode Applier Over Ordered Merge Rules",
    "eDesc": "Write `bpe_apply_merges(tokens: list[str], merges: list[tuple[str, str]]) -> list[str]`: apply ordered BPE merge pairs iteratively in rank priority until no rule applies to adjacent tokens.",
    "eStarter": "def bpe_apply_merges(tokens: list[str], merges: list[tuple[str, str]]) -> list[str]:\n    # TODO\n    pass",
    "eHint": "def bpe_apply_merges(tokens: list[str], merges: list[tuple[str, str]]) -> list[str]:\n    seq = list(tokens)\n    for a, b in merges:\n        nxt, i = [], 0\n        while i < len(seq):\n            if i + 1 < len(seq) and seq[i] == a and seq[i + 1] == b:\n                nxt.append(a + b)\n                i += 2\n            else:\n                nxt.append(seq[i])\n                i += 1\n        seq = nxt\n    return seq",
    "eTest": "assert bpe_apply_merges([\"n\", \"l\", \"p\", \"!\"], [(\"n\", \"l\"), (\"nl\", \"p\")]) == [\"nlp\", \"!\"]\nassert bpe_apply_merges([\"a\", \"b\"], []) == [\"a\", \"b\"]\nassert bpe_apply_merges([], [(\"a\", \"b\")]) == []\nprint('All checks passed.')",
    "aTitle": "Milestone 7B: RMSNorm + SwiGLU Pre-Norm Decoder Layer Evaluator",
    "aDesc": "Write `rmsnorm(x: list[float], gamma: list[float], eps: float = 1e-6) -> list[float]` computing `x_i * gamma_i / sqrt(mean(x^2) + eps)` rounded to 5 decimals (`[]` if empty).",
    "aStarter": "import math\n\ndef rmsnorm(x: list[float], gamma: list[float], eps: float = 1e-6) -> list[float]:\n    # TODO\n    pass",
    "aHint": "import math\n\ndef rmsnorm(x: list[float], gamma: list[float], eps: float = 1e-6) -> list[float]:\n    if not x:\n        return []\n    rms = math.sqrt(sum(v * v for v in x) / len(x) + eps)\n    return [round((v / rms) * g, 5) for v, g in zip(x, gamma)]",
    "aTest": "assert rmsnorm([3.0, 4.0], [1.0, 1.0], 0.0) == [round(3.0 / math.sqrt(12.5), 5), round(4.0 / math.sqrt(12.5), 5)]\nassert rmsnorm([2.0, -2.0], [0.5, 0.5], 0.0) == [0.5, -0.5]\nassert rmsnorm([], []) == []\nprint('All checks passed.')"
  },
  {
    "day": 36,
    "fallbackTitle": "Empirical Scaling Laws: Chinchilla, Kaplan Compute-Optimal Frontiers & Over-Training Dynamics",
    "eTitle": "Chinchilla Compute-Optimal Parameter-to-Token Allocation (`D = 20*N`)",
    "eDesc": "Write `chinchilla_optimal(flops_budget: float, tokens_per_param: float = 20.0) -> dict`: using transformer FLOP approximation `C = 6 * N * D` with `D = tokens_per_param * N`, solve optimal parameters `N = math.sqrt(C / (6 * tokens_per_param))` and optimal tokens `D = tokens_per_param * N` (returned as integers).",
    "eStarter": "import math\n\ndef chinchilla_optimal(flops_budget: float, tokens_per_param: float = 20.0) -> dict:\n    # TODO\n    pass",
    "eHint": "import math\n\ndef chinchilla_optimal(flops_budget: float, tokens_per_param: float = 20.0) -> dict:\n    if flops_budget <= 0 or tokens_per_param <= 0:\n        return {\"N\": 0, \"D\": 0}\n    n = math.sqrt(flops_budget / (6.0 * tokens_per_param))\n    return {\"N\": int(round(n)), \"D\": int(round(tokens_per_param * n))}",
    "eTest": "assert chinchilla_optimal(120_000_000.0, 20.0) == {\"N\": 1000, \"D\": 20000}\nassert chinchilla_optimal(6_000_000.0, 1.0) == {\"N\": 1000, \"D\": 1000}\nassert chinchilla_optimal(0.0) == {\"N\": 0, \"D\": 0}\nprint('All checks passed.')",
    "aTitle": "Chinchilla Loss Parametric Surface Predictor",
    "aDesc": "Write `predict_chinchilla_loss(N: float, D: float, e0: float = 1.69, A: float = 406.4, B: float = 410.7, alpha: float = 0.34, beta: float = 0.28) -> float`: compute irreducible+reducible loss `e0 + A / (N ** alpha) + B / (D ** beta)`, rounded to 4 decimals.",
    "aStarter": "def predict_chinchilla_loss(N: float, D: float, e0: float = 1.69, A: float = 406.4, B: float = 410.7, alpha: float = 0.34, beta: float = 0.28) -> float:\n    # TODO\n    pass",
    "aHint": "def predict_chinchilla_loss(N: float, D: float, e0: float = 1.69, A: float = 406.4, B: float = 410.7, alpha: float = 0.34, beta: float = 0.28) -> float:\n    return round(e0 + A / (N ** alpha) + B / (D ** beta), 4)",
    "aTest": "assert predict_chinchilla_loss(1e10, 2e11) < predict_chinchilla_loss(1e9, 2e10)\nassert predict_chinchilla_loss(1e12, 1e13) > 1.69\nassert predict_chinchilla_loss(1e6, 1e6, e0=1.5, A=1000.0, B=0.0, alpha=0.5, beta=0.5) == 2.5\nprint('All checks passed.')"
  },
  {
    "day": 37,
    "fallbackTitle": "Distributed Training Topologies: 3D Parallelism (Data, Tensor, Pipeline) & ZeRO Stage 1-3 Memory Partitioning",
    "eTitle": "3D Parallelism Mesh Rank Coordinate Validator & DP Calculator",
    "eDesc": "Write `build_3d_parallel_grid(world_size: int, tp: int, pp: int) -> dict`: validate `world_size % (tp * pp) == 0`; compute `dp = world_size // (tp * pp)` and bubble ratio for 1F1B pipeline `(pp - 1) / (pp - 1 + 4 * pp)` when microbatches `m = 4 * pp`, rounded to 4 decimals.",
    "eStarter": "def build_3d_parallel_grid(world_size: int, tp: int, pp: int) -> dict:\n    # TODO\n    pass",
    "eHint": "def build_3d_parallel_grid(world_size: int, tp: int, pp: int) -> dict:\n    if world_size <= 0 or tp <= 0 or pp <= 0 or world_size % (tp * pp) != 0:\n        return {\"valid\": False, \"dp\": 0, \"bubble_ratio\": 1.0}\n    dp = world_size // (tp * pp)\n    m = 4 * pp\n    bub = (pp - 1) / (pp - 1 + m) if pp > 1 else 0.0\n    return {\"valid\": True, \"dp\": dp, \"bubble_ratio\": round(bub, 4)}",
    "eTest": "assert build_3d_parallel_grid(64, 8, 4) == {\"valid\": True, \"dp\": 2, \"bubble_ratio\": 0.1579}\nassert build_3d_parallel_grid(8, 2, 1) == {\"valid\": True, \"dp\": 4, \"bubble_ratio\": 0.0}\nassert build_3d_parallel_grid(10, 4, 2)[\"valid\"] is False\nprint('All checks passed.')",
    "aTitle": "ZeRO Stages 1/2/3 Per-GPU Memory Footprint Estimator",
    "aDesc": "Write `zero_memory_per_gpu_gb(params_b: float, dp: int, stage: int) -> float`: in mixed-precision Adam (`2B` params + `2B` grads + `12B` optimizer = `16 * params_b` GB total for `params_b` billion params): Stage 0 keeps all `16`; Stage 1 shards `12/dp`; Stage 2 shards `(12+2)/dp`; Stage 3 shards `16/dp`. Round to 4 decimals.",
    "aStarter": "def zero_memory_per_gpu_gb(params_b: float, dp: int, stage: int) -> float:\n    # TODO\n    pass",
    "aHint": "def zero_memory_per_gpu_gb(params_b: float, dp: int, stage: int) -> float:\n    if stage == 0:\n        return round(16.0 * params_b, 4)\n    if stage == 1:\n        return round((4.0 + 12.0 / dp) * params_b, 4)\n    if stage == 2:\n        return round((2.0 + 14.0 / dp) * params_b, 4)\n    return round((16.0 / dp) * params_b, 4)",
    "aTest": "assert zero_memory_per_gpu_gb(1.0, 4, 1) == 7.0\nassert zero_memory_per_gpu_gb(1.0, 4, 2) == 5.5\nassert zero_memory_per_gpu_gb(1.0, 4, 3) == 4.0\nprint('All checks passed.')"
  },
  {
    "day": 38,
    "fallbackTitle": "Mixed-Precision Training Dynamics: FP32 Master Weights, FP16/BF16 Numerical Underflow & Dynamic Loss Scaling",
    "eTitle": "Dynamic FP16 Loss-Scaler (Exponential Backoff + Growth Interval)",
    "eDesc": "Implement `DynamicLossScaler(init_scale: float = 65536.0, growth_interval: int = 3)`: `step(has_inf_or_nan: bool) -> dict` halves scale and resets clean step streak (`\"skipped\": True`) if overflow detected; otherwise accepts step, increments streak, and doubles scale once `streak == growth_interval` resetting streak to `0`.",
    "eStarter": "class DynamicLossScaler:\n    def __init__(self, init_scale: float = 65536.0, growth_interval: int = 3):\n        # TODO\n        pass\n\n    def step(self, has_inf_or_nan: bool) -> dict:\n        # TODO\n        pass",
    "eHint": "class DynamicLossScaler:\n    def __init__(self, init_scale: float = 65536.0, growth_interval: int = 3):\n        self.scale = float(init_scale)\n        self.interval = growth_interval\n        self.streak = 0\n\n    def step(self, has_inf_or_nan: bool) -> dict:\n        if has_inf_or_nan:\n            self.scale = max(1.0, self.scale / 2.0)\n            self.streak = 0\n            return {\"skipped\": True, \"scale\": self.scale}\n        self.streak += 1\n        if self.streak >= self.interval:\n            self.scale *= 2.0\n            self.streak = 0\n        return {\"skipped\": False, \"scale\": self.scale}",
    "eTest": "ls = DynamicLossScaler(1024.0, 2)\nassert ls.step(True) == {\"skipped\": True, \"scale\": 512.0}\nassert ls.step(False) == {\"skipped\": False, \"scale\": 512.0}\nassert ls.step(False) == {\"skipped\": False, \"scale\": 1024.0}\nprint('All checks passed.')",
    "aTitle": "FP16 Subnormal Gradient Underflow & Master-Weight Precision Guard",
    "aDesc": "Write `count_fp16_underflow_and_overflow(grads: list[float], loss_scale: float) -> dict`: given unscaled grads scaled by `loss_scale` into FP16 normal range `[6.1035e-5, 65504.0]`: count `\"underflow\"` (`0 < abs(g * scale) < 6.1035e-5`) and `\"overflow\"` (`abs(g * scale) > 65504.0`).",
    "aStarter": "def count_fp16_underflow_and_overflow(grads: list[float], loss_scale: float) -> dict:\n    # TODO\n    pass",
    "aHint": "def count_fp16_underflow_and_overflow(grads: list[float], loss_scale: float) -> dict:\n    uf = ov = 0\n    for g in grads:\n        ag = abs(g * loss_scale)\n        if ag > 65504.0:\n            ov += 1\n        elif 0.0 < ag < 6.1035e-5:\n            uf += 1\n    return {\"underflow\": uf, \"overflow\": ov}",
    "aTest": "assert count_fp16_underflow_and_overflow([1e-6, 100.0, 0.0], 1024.0) == {\"underflow\": 0, \"overflow\": 1}\nassert count_fp16_underflow_and_overflow([1e-6], 1.0) == {\"underflow\": 1, \"overflow\": 0}\nassert count_fp16_underflow_and_overflow([], 1.0) == {\"underflow\": 0, \"overflow\": 0}\nprint('All checks passed.')"
  },
  {
    "day": 39,
    "fallbackTitle": "Web-Scale Pre-Training Data Engineering: Deduplication (MinHash/LSH), Quality Filtering, Heuristics & Synthetic Data",
    "eTitle": "Char 3-Shingle MinHash & Banded LSH Near-Duplicate Detector",
    "eDesc": "Write `dedup_documents_jaccard(docs: list[str], ngram_n: int, min_jaccard: float) -> list[str]`: compute lowercase alphanumeric character `ngram_n`-shingle sets (or full string set if shorter); retain documents sequentially skipping any doc whose Jaccard similarity with an already-kept doc is `>= min_jaccard`.",
    "eStarter": "import re\n\ndef dedup_documents_jaccard(docs: list[str], ngram_n: int, min_jaccard: float) -> list[str]:\n    # TODO\n    pass",
    "eHint": "import re\n\ndef dedup_documents_jaccard(docs: list[str], ngram_n: int, min_jaccard: float) -> list[str]:\n    kept, k_sets = [], []\n    for d in docs:\n        norm = re.sub(r\"[^a-z0-9]\", \"\", d.lower())\n        sh = {norm[i:i+ngram_n] for i in range(max(1, len(norm) - ngram_n + 1))} if norm else set()\n        dup = any((len(sh & ks) / len(sh | ks) if (sh | ks) else 1.0) >= min_jaccard for ks in k_sets)\n        if not dup:\n            kept.append(d)\n            k_sets.append(sh)\n    return kept",
    "eTest": "ds = [\"The quick brown fox jumps\", \"The quick brown fox jumps!\", \"Completely distinct technical prose\"]\nassert len(dedup_documents_jaccard(ds, 3, 0.8)) == 2\nassert dedup_documents_jaccard([\"alpha\", \"beta\"], 3, 0.9) == [\"alpha\", \"beta\"]\nassert dedup_documents_jaccard([], 3, 0.8) == []\nprint('All checks passed.')",
    "aTitle": "Pre-Training Heuristic Quality & Boilerplate Perplexity Filter",
    "aDesc": "Write `filter_pretrain_corpus(docs: list[str], min_words: int = 5, max_symbol_ratio: float = 0.25) -> list[str]`: discard docs with `< min_words` whitespace words OR fraction of non-alphanumeric-non-space characters `> max_symbol_ratio` OR any line repeated identically `> 2` times.",
    "aStarter": "from collections import Counter\n\ndef filter_pretrain_corpus(docs: list[str], min_words: int = 5, max_symbol_ratio: float = 0.25) -> list[str]:\n    # TODO\n    pass",
    "aHint": "from collections import Counter\n\ndef filter_pretrain_corpus(docs: list[str], min_words: int = 5, max_symbol_ratio: float = 0.25) -> list[str]:\n    out = []\n    for d in docs:\n        if len(d.split()) < min_words or not d:\n            continue\n        syms = sum(1 for c in d if not c.isalnum() and not c.isspace())\n        if syms / len(d) > max_symbol_ratio:\n            continue\n        lc = Counter(ln.strip() for ln in d.splitlines() if ln.strip())\n        if lc and max(lc.values()) > 2:\n            continue\n        out.append(d)\n    return out",
    "aTest": "assert filter_pretrain_corpus([\"Clean high quality pretraining sentence here.\", \"short\", \"$$$$ !!!! ### %%%% @@@\"]) == [\"Clean high quality pretraining sentence here.\"]\nassert filter_pretrain_corpus([\"a b c d e\\nspam line\\nspam line\\nspam line\"]) == []\nassert filter_pretrain_corpus([]) == []\nprint('All checks passed.')"
  },
  {
    "day": 40,
    "fallbackTitle": "Milestone 8 Capstone: Distributed Tensor-Parallel Pre-Training Cluster Simulation",
    "eTitle": "Milestone 8A: Global Batch-Size Gradient Accumulation Step Planner",
    "eDesc": "Write `plan_grad_accum(global_batch_seqs: int, dp_world: int, micro_batch: int) -> dict`: require `global_batch_seqs % (dp_world * micro_batch) == 0`, returning `{\"valid\": True, \"grad_accum_steps\": int, \"tokens_per_step_factor\": int}`.",
    "eStarter": "def plan_grad_accum(global_batch_seqs: int, dp_world: int, micro_batch: int) -> dict:\n    # TODO\n    pass",
    "eHint": "def plan_grad_accum(global_batch_seqs: int, dp_world: int, micro_batch: int) -> dict:\n    unit = dp_world * micro_batch\n    if unit <= 0 or global_batch_seqs <= 0 or global_batch_seqs % unit != 0:\n        return {\"valid\": False, \"grad_accum_steps\": 0}\n    return {\"valid\": True, \"grad_accum_steps\": global_batch_seqs // unit}",
    "eTest": "assert plan_grad_accum(512, 8, 4) == {\"valid\": True, \"grad_accum_steps\": 16}\nassert plan_grad_accum(500, 8, 4) == {\"valid\": False, \"grad_accum_steps\": 0}\nassert plan_grad_accum(32, 8, 4) == {\"valid\": True, \"grad_accum_steps\": 1}\nprint('All checks passed.')",
    "aTitle": "Milestone 8B: Cluster Pre-Training Budget & Wall-Clock Throughput Estimator",
    "aDesc": "Write `estimate_training_hours(total_tokens: float, params: float, n_gpus: int, gpu_tflops: float, mfu: float = 0.45) -> float`: using `6 * params * total_tokens` training FLOPs divided by `(n_gpus * gpu_tflops * 1e12 * mfu * 3600)`, rounded to 2 decimals.",
    "aStarter": "def estimate_training_hours(total_tokens: float, params: float, n_gpus: int, gpu_tflops: float, mfu: float = 0.45) -> float:\n    # TODO\n    pass",
    "aHint": "def estimate_training_hours(total_tokens: float, params: float, n_gpus: int, gpu_tflops: float, mfu: float = 0.45) -> float:\n    denom = n_gpus * gpu_tflops * 1e12 * mfu * 3600.0\n    if denom <= 0 or total_tokens <= 0 or params <= 0:\n        return 0.0\n    return round((6.0 * params * total_tokens) / denom, 2)",
    "aTest": "assert estimate_training_hours(1e12, 7e9, 64, 989.0, 0.45) > 100.0\nassert estimate_training_hours(3600e12, 1.0, 1, 6.0, 1.0) == 1.0\nassert estimate_training_hours(0.0, 7e9, 8, 300.0) == 0.0\nprint('All checks passed.')"
  },
  {
    "day": 41,
    "fallbackTitle": "Supervised Fine-Tuning (SFT), Instruction Formatting & Chat Templates",
    "eTitle": "ChatML Prompt-Loss-Mask Builder (`-100` on Prompt Tokens)",
    "eDesc": "Write `mask_sft_assistant_labels(turns: list[tuple[str, list[int]]]) -> tuple[list[int], list[int]]`: flatten `(role, token_ids)` turns into `(input_ids, labels)` setting `labels` to `-100` for non-`\"assistant\"` turns and keeping token IDs for `\"assistant\"` turns.",
    "eStarter": "def mask_sft_assistant_labels(turns: list[tuple[str, list[int]]]) -> tuple[list[int], list[int]]:\n    # TODO\n    pass",
    "eHint": "def mask_sft_assistant_labels(turns: list[tuple[str, list[int]]]) -> tuple[list[int], list[int]]:\n    inp, lbl = [], []\n    for role, ids in turns:\n        inp.extend(ids)\n        lbl.extend(ids if role == \"assistant\" else [-100] * len(ids))\n    return inp, lbl",
    "eTest": "assert mask_sft_assistant_labels([(\"user\", [1, 2]), (\"assistant\", [3, 4])]) == ([1, 2, 3, 4], [-100, -100, 3, 4])\nassert mask_sft_assistant_labels([(\"system\", [9])]) == ([9], [-100])\nassert mask_sft_assistant_labels([]) == ([], [])\nprint('All checks passed.')",
    "aTitle": "Sequence Packing (First-Fit Decreasing) Without Cross-Doc Attention",
    "aDesc": "Write `pack_sft_sequences(seq_lens: list[int], max_len: int) -> list[list[int]]`: drop sequences `> max_len`; pack remaining lengths descending using First-Fit Decreasing into fixed-capacity `max_len` bins, returning bins of packed lengths.",
    "aStarter": "def pack_sft_sequences(seq_lens: list[int], max_len: int) -> list[list[int]]:\n    # TODO\n    pass",
    "aHint": "def pack_sft_sequences(seq_lens: list[int], max_len: int) -> list[list[int]]:\n    bins = []\n    rem = []\n    for l in sorted(seq_lens, reverse=True):\n        if l <= 0 or l > max_len:\n            continue\n        placed = False\n        for i, r in enumerate(rem):\n            if r >= l:\n                bins[i].append(l)\n                rem[i] -= l\n                placed = True\n                break\n        if not placed:\n            bins.append([l])\n            rem.append(max_len - l)\n    return bins",
    "aTest": "assert pack_sft_sequences([60, 50, 40, 50, 120], 100) == [[60, 40], [50, 50]]\nassert pack_sft_sequences([100], 100) == [[100]]\nassert pack_sft_sequences([], 100) == []\nprint('All checks passed.')"
  },
  {
    "day": 42,
    "fallbackTitle": "Parameter-Efficient Fine-Tuning (PEFT): Low-Rank Adaptation (LoRA), QLoRA & Prefix Tuning",
    "eTitle": "LoRA Trainable Param Ratio & Merged Weight Matrix Calculator",
    "eDesc": "Write `merge_lora_weights(W: list[list[float]], A: list[list[float]], B: list[list[float]], alpha: float) -> list[list[float]]`: given `W (d_out x d_in)`, `B (d_out x r)`, `A (r x d_in)`, compute `W + (alpha / r) * (B @ A)` rounded to 5 decimals.",
    "eStarter": "def merge_lora_weights(W: list[list[float]], A: list[list[float]], B: list[list[float]], alpha: float) -> list[list[float]]:\n    # TODO\n    pass",
    "eHint": "def merge_lora_weights(W: list[list[float]], A: list[list[float]], B: list[list[float]], alpha: float) -> list[list[float]]:\n    if not W:\n        return []\n    r = len(A)\n    s = alpha / r\n    dout, din = len(W), len(W[0])\n    return [[round(W[i][j] + s * sum(B[i][k] * A[k][j] for k in range(r)), 5) for j in range(din)] for i in range(dout)]",
    "eTest": "assert merge_lora_weights([[1.0, 0.0], [0.0, 1.0]], [[1.0, 2.0]], [[3.0], [4.0]], 2.0) == [[7.0, 12.0], [8.0, 17.0]]\nassert merge_lora_weights([[5.0]], [[0.0]], [[2.0]], 4.0) == [[5.0]]\nassert merge_lora_weights([], [], [], 1.0) == []\nprint('All checks passed.')",
    "aTitle": "QLoRA NF4 4-Bit Base + FP16 Adapter Memory Savings Calculator",
    "aDesc": "Write `compare_qlora_memory(base_params_m: float, lora_params_m: float) -> dict`: base weights take `0.5` bytes/param in 4-bit vs `2.0` bytes/param in FP16; LoRA adapters take `2.0` bytes/param. Return MB sizes `qlora_mb`, `fp16_mb`, and `savings_pct` rounded to 2 decimals.",
    "aStarter": "def compare_qlora_memory(base_params_m: float, lora_params_m: float) -> dict:\n    # TODO\n    pass",
    "aHint": "def compare_qlora_memory(base_params_m: float, lora_params_m: float) -> dict:\n    q = 0.5 * base_params_m + 2.0 * lora_params_m\n    f = 2.0 * (base_params_m + lora_params_m)\n    sav = ((f - q) / f * 100.0) if f > 0 else 0.0\n    return {\"qlora_mb\": round(q, 2), \"fp16_mb\": round(f, 2), \"savings_pct\": round(sav, 2)}",
    "aTest": "assert compare_qlora_memory(7000.0, 40.0) == {\"qlora_mb\": 3580.0, \"fp16_mb\": 14080.0, \"savings_pct\": 74.57}\nassert compare_qlora_memory(100.0, 0.0)[\"savings_pct\"] == 75.0\nassert compare_qlora_memory(0.0, 0.0) == {\"qlora_mb\": 0.0, \"fp16_mb\": 0.0, \"savings_pct\": 0.0}\nprint('All checks passed.')"
  },
  {
    "day": 43,
    "fallbackTitle": "Reinforcement Learning from Human Feedback (RLHF): Reward Modeling & Bradley-Terry Preference Scoring",
    "eTitle": "Bradley-Terry Pairwise Preference Reward Loss (`-log sigma(r_w - r_l)`)",
    "eDesc": "Write `bradley_terry_loss(pairs: list[tuple[float, float]]) -> float`: given `(r_chosen, r_rejected)` pairs, compute mean `-log(sigmoid(r_w - r_l)) = log(1 + exp(-(r_w - r_l)))` stably (using `log1p`), rounded to 6 decimals (`0.0` if empty).",
    "eStarter": "import math\n\ndef bradley_terry_loss(pairs: list[tuple[float, float]]) -> float:\n    # TODO\n    pass",
    "eHint": "import math\n\ndef bradley_terry_loss(pairs: list[tuple[float, float]]) -> float:\n    if not pairs:\n        return 0.0\n    tot = 0.0\n    for rw, rl in pairs:\n        d = rw - rl\n        tot += math.log1p(math.exp(-d)) if d >= 0 else (-d + math.log1p(math.exp(d)))\n    return round(tot / len(pairs), 6)",
    "eTest": "assert abs(bradley_terry_loss([(1.0, 1.0)]) - math.log(2.0)) < 1e-5\nassert bradley_terry_loss([(5.0, 0.0)]) < bradley_terry_loss([(0.0, 5.0)])\nassert bradley_terry_loss([]) == 0.0\nprint('All checks passed.')",
    "aTitle": "KL-Penalized PPO Scalar Reward & Advantage Normalizer",
    "aDesc": "Write `kl_penalized_rewards(raw_rewards: list[float], kl_divs: list[float], beta: float) -> list[float]`: compute `r - beta * kl`, normalize across batch `(v - mean) / std` if `std > 1e-8` (else zeros), rounded to 5 decimals.",
    "aStarter": "import math\n\ndef kl_penalized_rewards(raw_rewards: list[float], kl_divs: list[float], beta: float) -> list[float]:\n    # TODO\n    pass",
    "aHint": "import math\n\ndef kl_penalized_rewards(raw_rewards: list[float], kl_divs: list[float], beta: float) -> list[float]:\n    if not raw_rewards:\n        return []\n    vals = [r - beta * k for r, k in zip(raw_rewards, kl_divs)]\n    mu = sum(vals) / len(vals)\n    sd = math.sqrt(sum((v - mu) ** 2 for v in vals) / len(vals))\n    return [round((v - mu) / sd, 5) if sd > 1e-8 else 0.0 for v in vals]",
    "aTest": "assert kl_penalized_rewards([2.0, 4.0], [1.0, 1.0], 0.5) == [-1.0, 1.0]\nassert kl_penalized_rewards([1.0, 1.0], [0.0, 0.0], 0.1) == [0.0, 0.0]\nassert kl_penalized_rewards([], [], 0.1) == []\nprint('All checks passed.')"
  },
  {
    "day": 44,
    "fallbackTitle": "Direct Preference Optimization (DPO), KTO & Odds Ratio Preference Optimization (ORPO)",
    "eTitle": "Direct Preference Optimization (DPO) Loss & Implicit Margin Calculator",
    "eDesc": "Write `dpo_step_metrics(pi_w: float, pi_l: float, ref_w: float, ref_l: float, beta: float) -> dict`: given summed sequence log-probabilities, compute implicit rewards `rw = beta*(pi_w - ref_w)` and `rl = beta*(pi_l - ref_l)`, margin `rw - rl`, and DPO loss `-log(sigmoid(margin))`, rounded to 6 decimals.",
    "eStarter": "import math\n\ndef dpo_step_metrics(pi_w: float, pi_l: float, ref_w: float, ref_l: float, beta: float) -> dict:\n    # TODO\n    pass",
    "eHint": "import math\n\ndef dpo_step_metrics(pi_w: float, pi_l: float, ref_w: float, ref_l: float, beta: float) -> dict:\n    rw = beta * (pi_w - ref_w)\n    rl = beta * (pi_l - ref_l)\n    m = rw - rl\n    loss = math.log1p(math.exp(-m)) if m >= 0 else (-m + math.log1p(math.exp(m)))\n    return {\"margin\": round(m, 6), \"loss\": round(loss, 6)}",
    "eTest": "assert abs(dpo_step_metrics(-1.0, -1.0, -1.0, -1.0, 0.1)[\"loss\"] - math.log(2.0)) < 1e-5\nassert dpo_step_metrics(-1.0, -5.0, -2.0, -2.0, 0.5)[\"margin\"] == 2.0\nassert dpo_step_metrics(-5.0, -1.0, -2.0, -2.0, 0.5)[\"margin\"] == -2.0\nprint('All checks passed.')",
    "aTitle": "ORPO Reference-Free Log-Odds Preference Ratio Loss",
    "aDesc": "Write `orpo_odds_ratio_loss(avg_p_w: float, avg_p_l: float) -> float`: given mean token probabilities `avg_p` in `(0, 1)`, compute odds `odds(p) = p / (1 - p)` and log-odds-ratio loss `-math.log(1 / (1 + exp(-math.log(odds_w / odds_l))))`, rounded to 6 decimals.",
    "aStarter": "import math\n\ndef orpo_odds_ratio_loss(avg_p_w: float, avg_p_l: float) -> float:\n    # TODO\n    pass",
    "aHint": "import math\n\ndef orpo_odds_ratio_loss(avg_p_w: float, avg_p_l: float) -> float:\n    ow = avg_p_w / (1.0 - avg_p_w)\n    ol = avg_p_l / (1.0 - avg_p_l)\n    d = math.log(ow / ol)\n    loss = math.log1p(math.exp(-d)) if d >= 0 else (-d + math.log1p(math.exp(d)))\n    return round(loss, 6)",
    "aTest": "assert abs(orpo_odds_ratio_loss(0.5, 0.5) - math.log(2.0)) < 1e-5\nassert orpo_odds_ratio_loss(0.8, 0.2) < orpo_odds_ratio_loss(0.2, 0.8)\nassert orpo_odds_ratio_loss(0.9, 0.5) < 0.2\nprint('All checks passed.')"
  },
  {
    "day": 45,
    "fallbackTitle": "Milestone 9 Capstone: The ApexAlign Post-Training & Human Preference Alignment Suite",
    "eTitle": "Milestone 9A: Preference Pair Quality Curate & Win-Rate Gate",
    "eDesc": "Write `curate_preference_pairs(pairs: list[dict], min_gap: float) -> list[dict]`: retain preference items `{id, score_w, score_l}` where `score_w - score_l >= min_gap` sorted descending by score margin then `id`.",
    "eStarter": "def curate_preference_pairs(pairs: list[dict], min_gap: float) -> list[dict]:\n    # TODO\n    pass",
    "eHint": "def curate_preference_pairs(pairs: list[dict], min_gap: float) -> list[dict]:\n    ok = [p for p in pairs if (p[\"score_w\"] - p[\"score_l\"]) >= min_gap]\n    ok.sort(key=lambda p: (-(p[\"score_w\"] - p[\"score_l\"]), p[\"id\"]))\n    return ok",
    "eTest": "ps = [{\"id\": \"a\", \"score_w\": 0.9, \"score_l\": 0.2}, {\"id\": \"b\", \"score_w\": 0.6, \"score_l\": 0.55}]\nassert [x[\"id\"] for x in curate_preference_pairs(ps, 0.2)] == [\"a\"]\nassert curate_preference_pairs(ps, 1.0) == []\nassert curate_preference_pairs([], 0.1) == []\nprint('All checks passed.')",
    "aTitle": "Milestone 9B: LoRA + DPO Post-Training Checkpoint Selector",
    "aDesc": "Write `select_aligned_checkpoint(ckpts: list[dict], max_kl: float) -> dict | None`: pick checkpoint `{step, win_rate, kl}` with `kl <= max_kl` maximizing `win_rate` (tie-break lower `kl`, earlier `step`).",
    "aStarter": "def select_aligned_checkpoint(ckpts: list[dict], max_kl: float):\n    # TODO\n    pass",
    "aHint": "def select_aligned_checkpoint(ckpts: list[dict], max_kl: float):\n    ok = [c for c in ckpts if c[\"kl\"] <= max_kl]\n    return min(ok, key=lambda c: (-c[\"win_rate\"], c[\"kl\"], c[\"step\"])) if ok else None",
    "aTest": "cs = [{\"step\": 100, \"win_rate\": 0.72, \"kl\": 0.04}, {\"step\": 200, \"win_rate\": 0.85, \"kl\": 0.15}]\nassert select_aligned_checkpoint(cs, 0.08)[\"step\"] == 100\nassert select_aligned_checkpoint(cs, 0.20)[\"step\"] == 200\nassert select_aligned_checkpoint(cs, 0.01) is None\nprint('All checks passed.')"
  },
  {
    "day": 46,
    "fallbackTitle": "KV Cache Management, PagedAttention & vLLM Internals",
    "eTitle": "PagedAttention Physical KV-Block Allocator (`alloc`/`free`)",
    "eDesc": "Implement `PagedKVAllocator(num_blocks: int, block_size: int)`: `allocate_seq(seq_id: str, n_tokens: int) -> list[int] | None` allocates `ceil(n_tokens / block_size)` lowest-numbered free blocks if sufficient (`None` without partial leak otherwise); `free_seq(seq_id: str)` returns blocks cleanly to pool.",
    "eStarter": "import math\n\nclass PagedKVAllocator:\n    def __init__(self, num_blocks: int, block_size: int):\n        # TODO\n        pass\n\n    def allocate_seq(self, seq_id: str, n_tokens: int):\n        # TODO\n        pass\n\n    def free_seq(self, seq_id: str):\n        # TODO\n        pass",
    "eHint": "import math\n\nclass PagedKVAllocator:\n    def __init__(self, num_blocks: int, block_size: int):\n        self.bs = block_size\n        self.free = set(range(num_blocks))\n        self.tables = {}\n\n    def allocate_seq(self, seq_id: str, n_tokens: int):\n        need = math.ceil(n_tokens / self.bs) if n_tokens > 0 else 0\n        if len(self.free) < need:\n            return None\n        chosen = sorted(self.free)[:need]\n        self.free.difference_update(chosen)\n        self.tables[seq_id] = chosen\n        return chosen\n\n    def free_seq(self, seq_id: str):\n        self.free.update(self.tables.pop(seq_id, []))",
    "eTest": "pa = PagedKVAllocator(4, 16)\nassert pa.allocate_seq(\"s1\", 20) == [0, 1]\nassert pa.allocate_seq(\"s2\", 40) is None\npa.free_seq(\"s1\")\nassert pa.allocate_seq(\"s2\", 40) == [0, 1, 2]\nprint('All checks passed.')",
    "aTitle": "Prefix-Cached Copy-on-Write KV Block Table Deduplicator",
    "aDesc": "Write `prefix_cache_savings(prompts_tokens: list[list[int]], block_size: int) -> dict`: split each prompt into full blocks of length `block_size`; count `\"total_blocks\"` without sharing vs `\"unique_blocks\"` under vLLM automatic prefix caching (identical prefix block tuple from start of sequence shares one physical block).",
    "aStarter": "def prefix_cache_savings(prompts_tokens: list[list[int]], block_size: int) -> dict:\n    # TODO\n    pass",
    "aHint": "def prefix_cache_savings(prompts_tokens: list[list[int]], block_size: int) -> dict:\n    tot = 0\n    uniq = set()\n    for toks in prompts_tokens:\n        n_full = len(toks) // block_size\n        tot += n_full\n        for b in range(n_full):\n            uniq.add(tuple(toks[:(b + 1) * block_size]))\n    return {\"total_blocks\": tot, \"unique_blocks\": len(uniq)}",
    "aTest": "ps = [[1, 2, 3, 4], [1, 2, 5, 6]]\nassert prefix_cache_savings(ps, 2) == {\"total_blocks\": 4, \"unique_blocks\": 3}\nassert prefix_cache_savings([[1, 2]], 4) == {\"total_blocks\": 0, \"unique_blocks\": 0}\nassert prefix_cache_savings([], 4) == {\"total_blocks\": 0, \"unique_blocks\": 0}\nprint('All checks passed.')"
  },
  {
    "day": 47,
    "fallbackTitle": "Speculative Decoding: Draft Models, Verification Latency & Acceptance Rate Tuning",
    "eTitle": "Lossless Speculative Decoding Rejection-Sampling Stepper",
    "eDesc": "Write `verify_speculative_tokens(draft_toks: list[int], q_probs: list[float], p_probs: list[float], rand_u: list[float], bonus_tok: int) -> list[int]`: accept token `t` while `rand_u[t] <= min(1.0, p_probs[t] / q_probs[t])`; at first rejection emit `bonus_tok` and stop; if all `K` accepted, also append `bonus_tok` (`K + 1` tokens emitted!).",
    "eStarter": "def verify_speculative_tokens(draft_toks: list[int], q_probs: list[float], p_probs: list[float], rand_u: list[float], bonus_tok: int) -> list[int]:\n    # TODO\n    pass",
    "eHint": "def verify_speculative_tokens(draft_toks: list[int], q_probs: list[float], p_probs: list[float], rand_u: list[float], bonus_tok: int) -> list[int]:\n    out = []\n    for dt, q, p, u in zip(draft_toks, q_probs, p_probs, rand_u):\n        if q > 0 and u <= min(1.0, p / q):\n            out.append(dt)\n        else:\n            out.append(bonus_tok)\n            return out\n    out.append(bonus_tok)\n    return out",
    "eTest": "assert verify_speculative_tokens([10, 20, 30], [0.5, 0.8, 0.5], [0.6, 0.2, 0.5], [0.5, 0.9, 0.1], 99) == [10, 99]\nassert verify_speculative_tokens([10, 20], [0.5, 0.5], [0.5, 0.5], [0.5, 0.5], 77) == [10, 20, 77]\nassert verify_speculative_tokens([], [], [], [], 5) == [5]\nprint('All checks passed.')",
    "aTitle": "Expected Token Yield & Speculative Speedup Optimizer (`gamma`)",
    "aDesc": "Write `speculative_speedup(alpha: float, gamma: int, draft_to_target_cost: float) -> float`: expected accepted+bonus tokens per verification round is `(1 - alpha**(gamma + 1)) / (1 - alpha)` (`gamma + 1` when `alpha == 1.0`), divided by round cost `gamma * draft_to_target_cost + 1.0`, rounded to 4 decimals.",
    "aStarter": "def speculative_speedup(alpha: float, gamma: int, draft_to_target_cost: float) -> float:\n    # TODO\n    pass",
    "aHint": "def speculative_speedup(alpha: float, gamma: int, draft_to_target_cost: float) -> float:\n    etoks = (gamma + 1.0) if abs(1.0 - alpha) < 1e-9 else (1.0 - alpha ** (gamma + 1)) / (1.0 - alpha)\n    return round(etoks / (gamma * draft_to_target_cost + 1.0), 4)",
    "aTest": "assert speculative_speedup(1.0, 4, 0.1) == round(5.0 / 1.4, 4)\nassert speculative_speedup(0.8, 4, 0.05) > 2.0\nassert speculative_speedup(0.0, 4, 0.1) < 1.0\nprint('All checks passed.')"
  },
  {
    "day": 48,
    "fallbackTitle": "Quantization Architectures: GPTQ, AWQ & SmoothQuant",
    "eTitle": "Symmetric Group-Wise INT4 Quantize-Dequantize Simulator",
    "eDesc": "Write `quantize_group_int4(weights: list[float]) -> dict`: map group into symmetric signed INT4 range `[-7, 7]` using `scale = max(abs(w)) / 7.0` (`1.0` if all zero), quantize `q = int(round(w / scale))` clamped to `[-7, 7]`, reconstruct `dq = [round(q_i * scale, 5)]`, and compute `mse = round(mean((w - dq)^2), 6)`.",
    "eStarter": "def quantize_group_int4(weights: list[float]) -> dict:\n    # TODO\n    pass",
    "eHint": "def quantize_group_int4(weights: list[float]) -> dict:\n    if not weights:\n        return {\"q\": [], \"scale\": 0.0, \"mse\": 0.0}\n    mx = max(abs(w) for w in weights)\n    sc = (mx / 7.0) if mx > 0 else 1.0\n    qs = [max(-7, min(7, round(w / sc))) for w in weights]\n    mse = sum((w - q * sc) ** 2 for w, q in zip(weights, qs)) / len(weights)\n    return {\"q\": qs, \"scale\": round(sc, 6), \"mse\": round(mse, 6)}",
    "eTest": "r = quantize_group_int4([0.7, -0.35, 0.0])\nassert r == {\"q\": [7, -4, 0], \"scale\": 0.1, \"mse\": round(0.0025 / 3, 6)}\nassert quantize_group_int4([0.0, 0.0]) == {\"q\": [0, 0], \"scale\": 1.0, \"mse\": 0.0}\nassert quantize_group_int4([]) == {\"q\": [], \"scale\": 0.0, \"mse\": 0.0}\nprint('All checks passed.')",
    "aTitle": "SmoothQuant Per-Channel Activation/Weight Scale Migrator",
    "aDesc": "Write `smoothquant_scales(act_max: list[float], w_max: list[float], alpha: float = 0.5) -> list[float]`: compute smoothing vector `s_j = (act_max[j] ** alpha) / (w_max[j] ** (1 - alpha))` (`1.0` if either max is 0), rounded to 5 decimals.",
    "aStarter": "def smoothquant_scales(act_max: list[float], w_max: list[float], alpha: float = 0.5) -> list[float]:\n    # TODO\n    pass",
    "aHint": "def smoothquant_scales(act_max: list[float], w_max: list[float], alpha: float = 0.5) -> list[float]:\n    out = []\n    for a, w in zip(act_max, w_max):\n        out.append(round((a ** alpha) / (w ** (1.0 - alpha)), 5) if (a > 0 and w > 0) else 1.0)\n    return out",
    "aTest": "assert smoothquant_scales([16.0, 4.0], [1.0, 4.0], 0.5) == [4.0, 1.0]\nassert smoothquant_scales([0.0, 9.0], [2.0, 1.0], 0.5) == [1.0, 3.0]\nassert smoothquant_scales([], [], 0.5) == []\nprint('All checks passed.')"
  },
  {
    "day": 49,
    "fallbackTitle": "Continuous Batching, Chunked Prefill & TensorRT-LLM Serving",
    "eTitle": "Iteration-Level Continuous Batch Scheduler",
    "eDesc": "Write `simulate_continuous_batch(requests: list[tuple[str, int, int]], max_batch: int) -> dict[str, int]`: given `(req_id, arrival_step, decode_steps)` sorted ascending by `(arrival_step, req_id)`, step time `t=0, 1, ...`: retire completed requests whose remaining steps hit `0` (recording completion step `t`), admit waiting arrived requests into open slots up to `max_batch` in `(arrival_step, req_id)` order, then advance 1 step for active batch. Return `{req_id: finish_step}`.",
    "eStarter": "def simulate_continuous_batch(requests: list[tuple[str, int, int]], max_batch: int) -> dict[str, int]:\n    # TODO\n    pass",
    "eHint": "def simulate_continuous_batch(requests: list[tuple[str, int, int]], max_batch: int) -> dict[str, int]:\n    wait = sorted(requests, key=lambda x: (x[1], x[0]))\n    act = []\n    done = {}\n    t = 0\n    while wait or act:\n        still = []\n        for rid, rem in act:\n            if rem == 0:\n                done[rid] = t\n            else:\n                still.append([rid, rem])\n        act = still\n        while len(act) < max_batch and wait and wait[0][1] <= t:\n            rid, _arr, st = wait.pop(0)\n            act.append([rid, st])\n        if not act and not wait:\n            break\n        for item in act:\n            item[1] -= 1\n        t += 1\n    return done",
    "eTest": "assert simulate_continuous_batch([(\"r1\", 0, 2), (\"r2\", 0, 1), (\"r3\", 1, 1)], 2) == {\"r2\": 1, \"r1\": 2, \"r3\": 2}\nassert simulate_continuous_batch([(\"a\", 0, 3)], 1) == {\"a\": 3}\nassert simulate_continuous_batch([], 2) == {}\nprint('All checks passed.')",
    "aTitle": "Chunked-Prefill Token-Budget Step Packer",
    "aDesc": "Write `pack_chunked_prefill_step(decode_active: int, prefill_queue: list[tuple[str, int]], token_budget: int) -> list[tuple[str, int]]`: reserve `1` token each for `decode_active` ongoing requests; greedily allocate remaining `token_budget - decode_active` across `prefill_queue` `(req_id, rem_prompt_tokens)` in order, returning `[(req_id, chunk_tokens)]`.",
    "aStarter": "def pack_chunked_prefill_step(decode_active: int, prefill_queue: list[tuple[str, int]], token_budget: int) -> list[tuple[str, int]]:\n    # TODO\n    pass",
    "aHint": "def pack_chunked_prefill_step(decode_active: int, prefill_queue: list[tuple[str, int]], token_budget: int) -> list[tuple[str, int]]:\n    rem = max(0, token_budget - decode_active)\n    out = []\n    for rid, rtoks in prefill_queue:\n        if rem <= 0:\n            break\n        take = min(rem, rtoks)\n        if take > 0:\n            out.append((rid, take))\n            rem -= take\n    return out",
    "aTest": "assert pack_chunked_prefill_step(128, [(\"p1\", 300), (\"p2\", 200)], 512) == [(\"p1\", 300), (\"p2\", 84)]\nassert pack_chunked_prefill_step(512, [(\"p1\", 100)], 512) == []\nassert pack_chunked_prefill_step(0, [], 256) == []\nprint('All checks passed.')"
  },
  {
    "day": 50,
    "fallbackTitle": "Milestone 10 Capstone: ApexInference High-Throughput Enterprise Serving Engine",
    "eTitle": "Milestone 10A: Serving SLA Admission Controller (TTFT / TPOT)",
    "eDesc": "Write `admit_serving_request(kv_free_blocks: int, needed_blocks: int, est_queue_ms: float, max_ttft_ms: float) -> tuple[bool, str]`: reject `\"kv_oom\"` if `kv_free_blocks < needed_blocks`, `\"ttft_sla\"` if `est_queue_ms > max_ttft_ms`, else `(True, \"ok\")`.",
    "eStarter": "def admit_serving_request(kv_free_blocks: int, needed_blocks: int, est_queue_ms: float, max_ttft_ms: float) -> tuple[bool, str]:\n    # TODO\n    pass",
    "eHint": "def admit_serving_request(kv_free_blocks: int, needed_blocks: int, est_queue_ms: float, max_ttft_ms: float) -> tuple[bool, str]:\n    if kv_free_blocks < needed_blocks:\n        return False, \"kv_oom\"\n    if est_queue_ms > max_ttft_ms:\n        return False, \"ttft_sla\"\n    return True, \"ok\"",
    "eTest": "assert admit_serving_request(10, 4, 80.0, 200.0) == (True, \"ok\")\nassert admit_serving_request(2, 4, 80.0, 200.0) == (False, \"kv_oom\")\nassert admit_serving_request(10, 4, 250.0, 200.0) == (False, \"ttft_sla\")\nprint('All checks passed.')",
    "aTitle": "Milestone 10B: INT4 + PagedKV + Speculative Throughput Aggregator",
    "aDesc": "Write `compute_serving_goodput(completed_reqs: list[tuple[int, float, int]], slo_ttft_ms: float, window_sec: float) -> dict`: count requests `(req_tokens, ttft_ms, decode_tokens)` meeting `ttft_ms <= slo_ttft_ms`; compute `\"goodput_rps\"` (`compliant / window_sec`) and `\"tok_per_sec\"` (`sum_all_decode_tokens / window_sec`), rounded to 4 decimals.",
    "aStarter": "def compute_serving_goodput(completed_reqs: list[tuple[int, float, int]], slo_ttft_ms: float, window_sec: float) -> dict:\n    # TODO\n    pass",
    "aHint": "def compute_serving_goodput(completed_reqs: list[tuple[int, float, int]], slo_ttft_ms: float, window_sec: float) -> dict:\n    if not completed_reqs or window_sec <= 0:\n        return {\"goodput_rps\": 0.0, \"tok_per_sec\": 0.0}\n    ok = sum(1 for _p, ttft, _d in completed_reqs if ttft <= slo_ttft_ms)\n    toks = sum(d for _p, _t, d in completed_reqs)\n    return {\"goodput_rps\": round(ok / window_sec, 4), \"tok_per_sec\": round(toks / window_sec, 4)}",
    "aTest": "assert compute_serving_goodput([(100, 150.0, 50), (100, 300.0, 150)], 200.0, 10.0) == {\"goodput_rps\": 0.1, \"tok_per_sec\": 20.0}\nassert compute_serving_goodput([(50, 50.0, 100)], 200.0, 5.0) == {\"goodput_rps\": 0.2, \"tok_per_sec\": 20.0}\nassert compute_serving_goodput([], 200.0, 10.0) == {\"goodput_rps\": 0.0, \"tok_per_sec\": 0.0}\nprint('All checks passed.')"
  },
  {
    "day": 51,
    "fallbackTitle": "Vision-Language Foundations: CLIP, Dual Encoders & Cross-Modal Embeddings",
    "eTitle": "Symmetric CLIP Contrastive Temperature-Scaled Similarity Matrix & InfoNCE",
    "eDesc": "Write `clip_infonce_loss(img_embs: list[list[float]], txt_embs: list[list[float]], logit_scale: float) -> float`: L2-normalize each embedding pair `(i, j)`, compute `logits[i][j] = logit_scale * dot(I_i, T_j)`, average row-wise and column-wise cross-entropy losses over diagonal positives, rounded to 6 decimals.",
    "eStarter": "import math\n\ndef clip_infonce_loss(img_embs: list[list[float]], txt_embs: list[list[float]], logit_scale: float) -> float:\n    # TODO\n    pass",
    "eHint": "import math\n\ndef _norm(v):\n    n = math.sqrt(sum(x * x for x in v)) or 1.0\n    return [x / n for x in v]\n\ndef _ce_diag(mat):\n    n = len(mat)\n    tot = 0.0\n    for i, row in enumerate(mat):\n        mx = max(row)\n        lse = mx + math.log(sum(math.exp(x - mx) for x in row))\n        tot += lse - row[i]\n    return tot / n\n\ndef clip_infonce_loss(img_embs: list[list[float]], txt_embs: list[list[float]], logit_scale: float) -> float:\n    if not img_embs:\n        return 0.0\n    inorm = [_norm(v) for v in img_embs]\n    tnorm = [_norm(v) for v in txt_embs]\n    n = len(inorm)\n    mat = [[logit_scale * sum(a * b for a, b in zip(inorm[i], tnorm[j])) for j in range(n)] for i in range(n)]\n    mat_t = [[mat[j][i] for j in range(n)] for i in range(n)]\n    return round(0.5 * (_ce_diag(mat) + _ce_diag(mat_t)), 6)",
    "eTest": "assert abs(clip_infonce_loss([[1, 0], [0, 1]], [[1, 0], [0, 1]], 10.0)) < 0.001\nassert abs(clip_infonce_loss([[1, 0], [1, 0]], [[1, 0], [1, 0]], 5.0) - math.log(2.0)) < 1e-5\nassert clip_infonce_loss([], [], 10.0) == 0.0\nprint('All checks passed.')",
    "aTitle": "Zero-Shot Multi-Prompt Ensemble Image Classifier",
    "aDesc": "Write `clip_zero_shot_classify(img_emb: list[float], class_prompt_embs: dict[str, list[list[float]]]) -> str`: L2-normalize each prompt embedding per class, average them into a class prototype and L2-normalize again; return class label maximizing cosine similarity (tie-break alphabetically).",
    "aStarter": "import math\n\ndef clip_zero_shot_classify(img_emb: list[float], class_prompt_embs: dict[str, list[list[float]]]) -> str:\n    # TODO\n    pass",
    "aHint": "import math\n\ndef _l2(v):\n    n = math.sqrt(sum(x * x for x in v)) or 1.0\n    return [x / n for x in v]\n\ndef clip_zero_shot_classify(img_emb: list[float], class_prompt_embs: dict[str, list[list[float]]]) -> str:\n    if not class_prompt_embs:\n        return \"\"\n    qi = _l2(img_emb)\n    best_c, best_s = \"\", -1e9\n    for cls in sorted(class_prompt_embs):\n        ps = [_l2(v) for v in class_prompt_embs[cls]]\n        d = len(qi)\n        avg = _l2([sum(p[k] for p in ps) / len(ps) for k in range(d)])\n        sc = sum(a * b for a, b in zip(qi, avg))\n        if sc > best_s:\n            best_s, best_c = sc, cls\n    return best_c",
    "aTest": "assert clip_zero_shot_classify([1.0, 0.0], {\"cat\": [[0.9, 0.1]], \"dog\": [[0.0, 1.0]]}) == \"cat\"\nassert clip_zero_shot_classify([0.0, 2.0], {\"a\": [[1.0, 0.0]], \"b\": [[0.0, 1.0]]}) == \"b\"\nassert clip_zero_shot_classify([1.0], {}) == \"\"\nprint('All checks passed.')"
  },
  {
    "day": 52,
    "fallbackTitle": "Vision-to-Language Projection: LLaVA Projectors, MLP Adapters & Perceiver Resamplers",
    "eTitle": "Pixel-Unshuffle (2x2 Spatial-to-Channel) Vision Token Compressor",
    "eDesc": "Write `pixel_unshuffle_tokens(grid: list[list[list[float]]]) -> list[list[float]]`: compress an `(H x W x C)` patch token grid (`H, W` even) by grouping each non-overlapping `2x2` spatial block in row-major order into concatenated `4*C`-dim projected tokens.",
    "eStarter": "def pixel_unshuffle_tokens(grid: list[list[list[float]]]) -> list[list[float]]:\n    # TODO\n    pass",
    "eHint": "def pixel_unshuffle_tokens(grid: list[list[list[float]]]) -> list[list[float]]:\n    if not grid or not grid[0]:\n        return []\n    out = []\n    for r in range(0, len(grid), 2):\n        for c in range(0, len(grid[0]), 2):\n            out.append(grid[r][c] + grid[r][c + 1] + grid[r + 1][c] + grid[r + 1][c + 1])\n    return out",
    "eTest": "g = [[[1.0], [2.0]], [[3.0], [4.0]]]\nassert pixel_unshuffle_tokens(g) == [[1.0, 2.0, 3.0, 4.0]]\ng2 = [[[1], [2], [3], [4]], [[5], [6], [7], [8]]]\nassert pixel_unshuffle_tokens(g2) == [[1, 2, 5, 6], [3, 4, 7, 8]]\nassert pixel_unshuffle_tokens([]) == []\nprint('All checks passed.')",
    "aTitle": "LLaVA 2-Layer Linear-ReLU-Linear Multimodal Projector",
    "aDesc": "Write `project_vision_tokens(tokens: list[list[float]], W1: list[list[float]], W2: list[list[float]]) -> list[list[float]]`: project each vision token `x` via `ReLU(x @ W1) @ W2`, rounded to 4 decimals.",
    "aStarter": "def project_vision_tokens(tokens: list[list[float]], W1: list[list[float]], W2: list[list[float]]) -> list[list[float]]:\n    # TODO\n    pass",
    "aHint": "def project_vision_tokens(tokens: list[list[float]], W1: list[list[float]], W2: list[list[float]]) -> list[list[float]]:\n    if not tokens:\n        return []\n    out = []\n    h_dim, o_dim = len(W1[0]), len(W2[0])\n    for x in tokens:\n        h = [max(0.0, sum(x[i] * W1[i][j] for i in range(len(x)))) for j in range(h_dim)]\n        y = [round(sum(h[j] * W2[j][k] for j in range(h_dim)), 4) for k in range(o_dim)]\n        out.append(y)\n    return out",
    "aTest": "assert project_vision_tokens([[1.0, -2.0]], [[1.0, 1.0], [1.0, -1.0]], [[2.0], [1.0]]) == [[3.0]]\nassert project_vision_tokens([[-5.0]], [[1.0]], [[2.0]]) == [[0.0]]\nassert project_vision_tokens([], [[1.0]], [[1.0]]) == []\nprint('All checks passed.')"
  },
  {
    "day": 53,
    "fallbackTitle": "Any-Resolution Image Processing: Dynamic Tiling, Patch Splitting & Visual Tokens",
    "eTitle": "AnyRes Optimal Aspect-Ratio Tile Grid Selector",
    "eDesc": "Write `select_anyres_grid(width: int, height: int, tile_size: int, max_tiles: int) -> tuple[int, int]`: examine candidate `(nx, ny)` grids with `1 <= nx * ny <= max_tiles`; choose the grid maximizing effective covered area while minimizing wasted padding area (tie-break smallest `nx * ny`, then `(nx, ny)`).",
    "eStarter": "def select_anyres_grid(width: int, height: int, tile_size: int, max_tiles: int) -> tuple[int, int]:\n    # TODO\n    pass",
    "eHint": "def select_anyres_grid(width: int, height: int, tile_size: int, max_tiles: int) -> tuple[int, int]:\n    best, best_key = (1, 1), None\n    for nx in range(1, max_tiles + 1):\n        for ny in range(1, max_tiles // nx + 1):\n            tw, th = nx * tile_size, ny * tile_size\n            scale = min(tw / width, th / height)\n            eff_area = min(width * height, (width * scale) * (height * scale))\n            wasted = tw * th - (width * scale) * (height * scale)\n            key = (-round(eff_area, 3), round(wasted, 3), nx * ny, nx, ny)\n            if best_key is None or key < best_key:\n                best_key, best = key, (nx, ny)\n    return best",
    "eTest": "assert select_anyres_grid(672, 336, 336, 4) == (2, 1)\nassert select_anyres_grid(336, 672, 336, 4) == (1, 2)\nassert select_anyres_grid(336, 336, 336, 4) == (1, 1)\nprint('All checks passed.')",
    "aTitle": "Dynamic Tile Visual Token Splice Counter with Thumbnail Token Budget",
    "aDesc": "Write `count_multimodal_tokens(text_tokens: int, nx: int, ny: int, patches_per_tile: int, include_thumb: bool = True) -> int`: total sequence length equals `text_tokens + (nx * ny + (1 if include_thumb else 0)) * patches_per_tile`.",
    "aStarter": "def count_multimodal_tokens(text_tokens: int, nx: int, ny: int, patches_per_tile: int, include_thumb: bool = True) -> int:\n    # TODO\n    pass",
    "aHint": "def count_multimodal_tokens(text_tokens: int, nx: int, ny: int, patches_per_tile: int, include_thumb: bool = True) -> int:\n    tiles = nx * ny + (1 if include_thumb else 0)\n    return text_tokens + tiles * patches_per_tile",
    "aTest": "assert count_multimodal_tokens(50, 2, 1, 144, True) == 482\nassert count_multimodal_tokens(50, 2, 1, 144, False) == 338\nassert count_multimodal_tokens(0, 0, 0, 100, False) == 0\nprint('All checks passed.')"
  },
  {
    "day": 54,
    "fallbackTitle": "Multimodal Instruction Tuning: Interleaved SFT, Visual Grounding & Box Tokenization",
    "eTitle": "Normalized `<box>` Coordinate Quantizer (`0..999`) & IoU Verifier",
    "eDesc": "Write `quantize_bbox(x1: float, y1: float, x2: float, y2: float, w: int, h: int, bins: int = 1000) -> list[int]` scaling coordinates into `[0, bins - 1]`, and `bbox_iou(a: list[int], b: list[int]) -> float` computing exact Intersection-over-Union rounded to 4 decimals.",
    "eStarter": "def quantize_bbox(x1: float, y1: float, x2: float, y2: float, w: int, h: int, bins: int = 1000) -> list[int]:\n    # TODO\n    pass\n\ndef bbox_iou(a: list[int], b: list[int]) -> float:\n    # TODO\n    pass",
    "eHint": "def quantize_bbox(x1: float, y1: float, x2: float, y2: float, w: int, h: int, bins: int = 1000) -> list[int]:\n    mx = bins - 1\n    q = [round(x1 / w * mx), round(y1 / h * mx), round(x2 / w * mx), round(y2 / h * mx)]\n    return [max(0, min(mx, v)) for v in q]\n\ndef bbox_iou(a: list[int], b: list[int]) -> float:\n    ix1, iy1 = max(a[0], b[0]), max(a[1], b[1])\n    ix2, iy2 = min(a[2], b[2]), min(a[3], b[3])\n    inter = max(0, ix2 - ix1) * max(0, iy2 - iy1)\n    area_a = max(0, a[2] - a[0]) * max(0, a[3] - a[1])\n    area_b = max(0, b[2] - b[0]) * max(0, b[3] - b[1])\n    union = area_a + area_b - inter\n    return round(inter / union, 4) if union > 0 else 0.0",
    "eTest": "assert quantize_bbox(100, 50, 200, 150, 400, 200, 1001) == [250, 250, 500, 750]\nassert bbox_iou([0, 0, 10, 10], [5, 0, 15, 10]) == round(50 / 150, 4)\nassert bbox_iou([0, 0, 5, 5], [10, 10, 20, 20]) == 0.0\nprint('All checks passed.')",
    "aTitle": "Interleaved Image-Placeholder Token Expander",
    "aDesc": "Write `expand_image_placeholders(tokens: list[int], img_token_id: int, fill_tokens: list[int]) -> list[int]`: replace every occurrence of `img_token_id` in `tokens` with the full `fill_tokens` visual embedding sequence.",
    "aStarter": "def expand_image_placeholders(tokens: list[int], img_token_id: int, fill_tokens: list[int]) -> list[int]:\n    # TODO\n    pass",
    "aHint": "def expand_image_placeholders(tokens: list[int], img_token_id: int, fill_tokens: list[int]) -> list[int]:\n    out = []\n    for t in tokens:\n        if t == img_token_id:\n            out.extend(fill_tokens)\n        else:\n            out.append(t)\n    return out",
    "aTest": "assert expand_image_placeholders([1, -1, 2, -1], -1, [90, 91]) == [1, 90, 91, 2, 90, 91]\nassert expand_image_placeholders([1, 2], -1, [90]) == [1, 2]\nassert expand_image_placeholders([], -1, [90]) == []\nprint('All checks passed.')"
  },
  {
    "day": 55,
    "fallbackTitle": "Milestone 11 Capstone: ApexOmni Vision-Language Multimodal Transformer Suite",
    "eTitle": "Milestone 11A: Multimodal Batch Sequence + AnyRes Budget Validator",
    "eDesc": "Write `plan_vlm_context(images: list[tuple[int, int]], text_len: int, tile_size: int, max_tiles_per_img: int, tokens_per_tile: int, ctx_limit: int) -> dict`: sum `max(1, ceil(w/tile_size)*ceil(h/tile_size))` capped at `max_tiles_per_img` plus 1 thumbnail tile per image; compute `total_tokens` and `\"fits\": total_tokens <= ctx_limit`.",
    "eStarter": "import math\n\ndef plan_vlm_context(images: list[tuple[int, int]], text_len: int, tile_size: int, max_tiles_per_img: int, tokens_per_tile: int, ctx_limit: int) -> dict:\n    # TODO\n    pass",
    "eHint": "import math\n\ndef plan_vlm_context(images: list[tuple[int, int]], text_len: int, tile_size: int, max_tiles_per_img: int, tokens_per_tile: int, ctx_limit: int) -> dict:\n    vis = 0\n    for w, h in images:\n        tiles = min(max_tiles_per_img, math.ceil(w / tile_size) * math.ceil(h / tile_size)) + 1\n        vis += tiles * tokens_per_tile\n    tot = text_len + vis\n    return {\"total_tokens\": tot, \"fits\": tot <= ctx_limit}",
    "eTest": "assert plan_vlm_context([(672, 336)], 100, 336, 4, 144, 1000) == {\"total_tokens\": 532, \"fits\": True}\nassert plan_vlm_context([(2000, 2000)], 100, 336, 4, 144, 500) == {\"total_tokens\": 820, \"fits\": False}\nassert plan_vlm_context([], 50, 336, 4, 144, 100) == {\"total_tokens\": 50, \"fits\": True}\nprint('All checks passed.')",
    "aTitle": "Milestone 11B: Visual Grounding Referring-Expression Recall@IoU Evaluator",
    "aDesc": "Write `grounding_accuracy(preds: list[list[int]], gts: list[list[int]], iou_thresh: float = 0.5) -> float`: compute fraction of samples where bbox IoU `>= iou_thresh`, rounded to 4 decimals (`0.0` if empty).",
    "aStarter": "def grounding_accuracy(preds: list[list[int]], gts: list[list[int]], iou_thresh: float = 0.5) -> float:\n    # TODO\n    pass",
    "aHint": "def grounding_accuracy(preds: list[list[int]], gts: list[list[int]], iou_thresh: float = 0.5) -> float:\n    if not preds:\n        return 0.0\n    hits = 0\n    for a, b in zip(preds, gts):\n        inter = max(0, min(a[2], b[2]) - max(a[0], b[0])) * max(0, min(a[3], b[3]) - max(a[1], b[1]))\n        ua = max(0, a[2] - a[0]) * max(0, a[3] - a[1]) + max(0, b[2] - b[0]) * max(0, b[3] - b[1]) - inter\n        if ua > 0 and (inter / ua) >= iou_thresh:\n            hits += 1\n    return round(hits / len(preds), 4)",
    "aTest": "assert grounding_accuracy([[0, 0, 10, 10], [0, 0, 2, 2]], [[0, 0, 10, 10], [8, 8, 10, 10]], 0.5) == 0.5\nassert grounding_accuracy([[0, 0, 10, 10]], [[0, 0, 10, 10]], 0.5) == 1.0\nassert grounding_accuracy([], [], 0.5) == 0.0\nprint('All checks passed.')"
  },
  {
    "day": 56,
    "fallbackTitle": "Synthetic Data Generation: Constitutional AI, Self-Instruct, Evol-Instruct & Filtering Pipelines",
    "eTitle": "Multi-Stage Rejection-Sampling & Constitutional Filter Pipeline",
    "eDesc": "Write `filter_synthetic_sft(samples: list[dict], banned_phrases: list[str], min_len: int) -> list[dict]`: keep samples `{id, response, reward}` with `len(response.split()) >= min_len`, zero case-insensitive `banned_phrases` hits, and highest `reward` per unique `id`, sorted by descending `reward` then `id`.",
    "eStarter": "def filter_synthetic_sft(samples: list[dict], banned_phrases: list[str], min_len: int) -> list[dict]:\n    # TODO\n    pass",
    "eHint": "def filter_synthetic_sft(samples: list[dict], banned_phrases: list[str], min_len: int) -> list[dict]:\n    bans = [b.lower() for b in banned_phrases]\n    best = {}\n    for s in samples:\n        txt = s[\"response\"]\n        low = txt.lower()\n        if len(txt.split()) < min_len or any(b in low for b in bans):\n            continue\n        sid = s[\"id\"]\n        if sid not in best or s[\"reward\"] > best[sid][\"reward\"]:\n            best[sid] = s\n    return sorted(best.values(), key=lambda x: (-x[\"reward\"], x[\"id\"]))",
    "eTest": "ss = [{\"id\": \"q1\", \"response\": \"As an AI language model I refuse\", \"reward\": 0.9}, {\"id\": \"q1\", \"response\": \"Here is the full validated explanation.\", \"reward\": 0.7}]\nassert [x[\"id\"] for x in filter_synthetic_sft(ss, [\"as an ai\"], 4)] == [\"q1\"]\nassert filter_synthetic_sft([{\"id\": \"x\", \"response\": \"hi\", \"reward\": 1.0}], [], 5) == []\nassert filter_synthetic_sft([], [], 1) == []\nprint('All checks passed.')",
    "aTitle": "Constitutional Principle Multi-Rule Critique Selector",
    "aDesc": "Write `pick_best_constitutional_revision(revisions: list[dict]) -> dict | None`: each revision `{text, harmless_score, helpful_score, violations}` must have `violations == 0`; pick best minimizing `-(harmless_score + helpful_score)` then shortest length.",
    "aStarter": "def pick_best_constitutional_revision(revisions: list[dict]):\n    # TODO\n    pass",
    "aHint": "def pick_best_constitutional_revision(revisions: list[dict]):\n    ok = [r for r in revisions if r.get(\"violations\", 0) == 0]\n    return min(ok, key=lambda r: (-(r[\"harmless_score\"] + r[\"helpful_score\"]), len(r[\"text\"]))) if ok else None",
    "aTest": "rs = [{\"text\": \"bad\", \"harmless_score\": 1.0, \"helpful_score\": 1.0, \"violations\": 1}, {\"text\": \"good safe\", \"harmless_score\": 0.9, \"helpful_score\": 0.8, \"violations\": 0}]\nassert pick_best_constitutional_revision(rs)[\"text\"] == \"good safe\"\nassert pick_best_constitutional_revision([rs[0]]) is None\nassert pick_best_constitutional_revision([]) is None\nprint('All checks passed.')"
  },
  {
    "day": 57,
    "fallbackTitle": "Alignment Red-Teaming, Automated Jailbreak Fuzzing & Safety Guardrail Attestation",
    "eTitle": "Attack-Success-Rate (ASR) & False-Refusal Benchmark Scorer",
    "eDesc": "Write `score_safety_attestation(unsafe_prompts_complied: list[bool], benign_prompts_refused: list[bool]) -> dict`: compute `asr = complied / total_unsafe` (`0.0` if empty), `false_refusal_rate = refused / total_benign`, and `\"certified\": asr <= 0.02 and frr <= 0.05`. Round to 4 decimals.",
    "eStarter": "def score_safety_attestation(unsafe_prompts_complied: list[bool], benign_prompts_refused: list[bool]) -> dict:\n    # TODO\n    pass",
    "eHint": "def score_safety_attestation(unsafe_prompts_complied: list[bool], benign_prompts_refused: list[bool]) -> dict:\n    asr = sum(1 for x in unsafe_prompts_complied if x) / len(unsafe_prompts_complied) if unsafe_prompts_complied else 0.0\n    frr = sum(1 for x in benign_prompts_refused if x) / len(benign_prompts_refused) if benign_prompts_refused else 0.0\n    return {\"asr\": round(asr, 4), \"frr\": round(frr, 4), \"certified\": (asr <= 0.02 and frr <= 0.05)}",
    "eTest": "assert score_safety_attestation([False]*50, [False]*20) == {\"asr\": 0.0, \"frr\": 0.0, \"certified\": True}\nassert score_safety_attestation([True, False], [False]) == {\"asr\": 0.5, \"frr\": 0.0, \"certified\": False}\nassert score_safety_attestation([False], [True])[\"certified\"] is False\nprint('All checks passed.')",
    "aTitle": "Base64 / Homoglyph Adversarial Smuggling Normalizer",
    "aDesc": "Write `detect_jailbreak_smuggling(text: str, triggers: list[str]) -> bool`: strip zero-width chars `\\u200b/\\u200c/\\u200d` and decode valid Base64 tokens of len `>= 8`; return `True` if any lowercase trigger appears in either normalized surface or decoded UTF-8 chunks.",
    "aStarter": "import base64, re\n\ndef detect_jailbreak_smuggling(text: str, triggers: list[str]) -> bool:\n    # TODO\n    pass",
    "aHint": "import base64, re\n\ndef detect_jailbreak_smuggling(text: str, triggers: list[str]) -> bool:\n    clean = re.sub(r\"[\\u200b\\u200c\\u200d]\", \"\", text)\n    hay = clean.lower()\n    for tok in re.findall(r\"[A-Za-z0-9+/=]{8,}\", clean):\n        try:\n            dec = base64.b64decode(tok, validate=True).decode(\"utf-8\", errors=\"ignore\").lower()\n            hay += \" \" + dec\n        except Exception:\n            pass\n    return any(tr.lower() in hay for tr in triggers)",
    "aTest": "import base64\nb64 = base64.b64encode(b\"ignore previous instructions\").decode()\nassert detect_jailbreak_smuggling(\"run: \" + b64, [\"ignore previous\"]) is True\nassert detect_jailbreak_smuggling(\"ig\\u200bnore pre\\u200cvious\", [\"ignore previous\"]) is True\nassert detect_jailbreak_smuggling(\"hello safe user query\", [\"ignore previous\"]) is False\nprint('All checks passed.')"
  },
  {
    "day": 58,
    "fallbackTitle": "Enterprise Agentic Tool-Use: ReAct Loops, JSON Schema Enforcement, Function Calling & Plan Verification",
    "eTitle": "JSON Schema Tool-Call Argument Type & Enum Verifier",
    "eDesc": "Write `verify_tool_call(call: dict, catalog: dict[str, dict]) -> tuple[bool, str]`: validate `call[\"name\"] in catalog`, check all `required` params present, and verify declared `\"type\"` (`str`, `int` excluding `bool`, `bool`, `float`) matches, returning `(True, \"ok\")` or `(False, reason)`.",
    "eStarter": "def verify_tool_call(call: dict, catalog: dict[str, dict]) -> tuple[bool, str]:\n    # TODO\n    pass",
    "eHint": "def verify_tool_call(call: dict, catalog: dict[str, dict]) -> tuple[bool, str]:\n    name = call.get(\"name\")\n    if name not in catalog:\n        return False, \"unknown_tool\"\n    spec = catalog[name]\n    args = call.get(\"args\", {})\n    for req in spec.get(\"required\", []):\n        if req not in args:\n            return False, f\"missing:{req}\"\n    for k, expected in spec.get(\"types\", {}).items():\n        if k in args:\n            v = args[k]\n            ok = (isinstance(v, str) if expected == \"str\" else (isinstance(v, bool) if expected == \"bool\" else (isinstance(v, int) and not isinstance(v, bool) if expected == \"int\" else isinstance(v, (int, float)) and not isinstance(v, bool))))\n            if not ok:\n                return False, f\"bad_type:{k}\"\n    return True, \"ok\"",
    "eTest": "cat = {\"search\": {\"required\": [\"q\", \"k\"], \"types\": {\"q\": \"str\", \"k\": \"int\"}}}\nassert verify_tool_call({\"name\": \"search\", \"args\": {\"q\": \"llm\", \"k\": 5}}, cat) == (True, \"ok\")\nassert verify_tool_call({\"name\": \"search\", \"args\": {\"q\": \"llm\", \"k\": True}}, cat) == (False, \"bad_type:k\")\nassert verify_tool_call({\"name\": \"nope\", \"args\": {}}, cat) == (False, \"unknown_tool\")\nprint('All checks passed.')",
    "aTitle": "Bounded-Step ReAct Trajectory Executor with Loop-Cycle Detector",
    "aDesc": "Write `audit_react_trace(steps: list[tuple[str, str]], max_steps: int) -> str`: inspect `(action, args_key)` agent steps: return `\"LOOP_DETECTED\"` if two consecutive steps match identically or any `(action, args_key)` appears `>= 3` times; `\"MAX_STEPS\"` if `len(steps) > max_steps`; `\"DONE\"` if last action is `\"FINISH\"`; else `\"INCOMPLETE\"`.",
    "aStarter": "def audit_react_trace(steps: list[tuple[str, str]], max_steps: int) -> str:\n    # TODO\n    pass",
    "aHint": "from collections import Counter\n\ndef audit_react_trace(steps: list[tuple[str, str]], max_steps: int) -> str:\n    if any(steps[i] == steps[i + 1] for i in range(len(steps) - 1)):\n        return \"LOOP_DETECTED\"\n    cnt = Counter(steps)\n    if cnt and max(cnt.values()) >= 3:\n        return \"LOOP_DETECTED\"\n    if len(steps) > max_steps:\n        return \"MAX_STEPS\"\n    if steps and steps[-1][0] == \"FINISH\":\n        return \"DONE\"\n    return \"INCOMPLETE\"",
    "aTest": "assert audit_react_trace([(\"SEARCH\", \"a\"), (\"READ\", \"1\"), (\"FINISH\", \"\")], 5) == \"DONE\"\nassert audit_react_trace([(\"SEARCH\", \"a\"), (\"SEARCH\", \"a\")], 5) == \"LOOP_DETECTED\"\nassert audit_react_trace([(\"SEARCH\", \"a\"), (\"READ\", \"1\")], 1) == \"MAX_STEPS\"\nprint('All checks passed.')"
  },
  {
    "day": 59,
    "fallbackTitle": "Production Evaluation: MT-Bench, AlpacaEval, MMLU, LLM-as-a-Judge Calibration & Fiduciary Auditing",
    "eTitle": "Position-Bias De-Swapped LLM-as-a-Judge Paired Scorer",
    "eDesc": "Write `calibrate_judge_pairs(forward_winners: list[str], swapped_winners: list[str]) -> dict`: `\"A\"` / `\"B\"` represent model labels AFTER mapping swapped prompt positions back to `(A, B)`. Count `\"consistent_A\"`, `\"consistent_B\"`, `\"position_biased_ties\"` (judge flipped winner on swap or voted `\"TIE\"`), and compute `win_rate_A = round((consistent_A + 0.5 * ties) / n, 4)`.",
    "eStarter": "def calibrate_judge_pairs(forward_winners: list[str], swapped_winners: list[str]) -> dict:\n    # TODO\n    pass",
    "eHint": "def calibrate_judge_pairs(forward_winners: list[str], swapped_winners: list[str]) -> dict:\n    n = len(forward_winners)\n    if n == 0:\n        return {\"consistent_A\": 0, \"consistent_B\": 0, \"ties\": 0, \"win_rate_A\": 0.0}\n    ca = cb = ties = 0\n    for fw, sw in zip(forward_winners, swapped_winners):\n        if fw == \"A\" and sw == \"A\":\n            ca += 1\n        elif fw == \"B\" and sw == \"B\":\n            cb += 1\n        else:\n            ties += 1\n    return {\"consistent_A\": ca, \"consistent_B\": cb, \"ties\": ties, \"win_rate_A\": round((ca + 0.5 * ties) / n, 4)}",
    "eTest": "assert calibrate_judge_pairs([\"A\", \"A\", \"B\"], [\"A\", \"B\", \"B\"]) == {\"consistent_A\": 1, \"consistent_B\": 1, \"ties\": 1, \"win_rate_A\": 0.5}\nassert calibrate_judge_pairs([\"A\", \"A\"], [\"A\", \"A\"])[\"win_rate_A\"] == 1.0\nassert calibrate_judge_pairs([], []) == {\"consistent_A\": 0, \"consistent_B\": 0, \"ties\": 0, \"win_rate_A\": 0.0}\nprint('All checks passed.')",
    "aTitle": "Balanced-Length AlpacaEval Logistic Length-Controlled Win Rate",
    "aDesc": "Write `judge_agreement_kappa(r1: list[str], r2: list[str]) -> float`: compute Cohen kappa `(p_o - p_e) / (1 - p_e)` between two judge labels (`\"A\"`, `\"B\"`, `\"TIE\"`), rounded to 4 decimals (`1.0` if `p_e == 1.0` and `p_o == 1.0`).",
    "aStarter": "def judge_agreement_kappa(r1: list[str], r2: list[str]) -> float:\n    # TODO\n    pass",
    "aHint": "from collections import Counter\n\ndef judge_agreement_kappa(r1: list[str], r2: list[str]) -> float:\n    n = len(r1)\n    if n == 0:\n        return 0.0\n    po = sum(1 for a, b in zip(r1, r2) if a == b) / n\n    c1, c2 = Counter(r1), Counter(r2)\n    pe = sum((c1[k] / n) * (c2[k] / n) for k in (set(c1) | set(c2)))\n    if abs(1.0 - pe) < 1e-12:\n        return 1.0 if abs(1.0 - po) < 1e-12 else 0.0\n    return round((po - pe) / (1.0 - pe), 4)",
    "aTest": "assert judge_agreement_kappa([\"A\", \"B\", \"A\", \"B\"], [\"A\", \"B\", \"A\", \"B\"]) == 1.0\nassert judge_agreement_kappa([\"A\", \"B\"], [\"B\", \"A\"]) == -1.0\nassert judge_agreement_kappa([], []) == 0.0\nprint('All checks passed.')"
  },
  {
    "day": 60,
    "fallbackTitle": "Final Grand Master Capstone: The Sovereign Frontier LLM Pre-Training to Alignment Suite",
    "eTitle": "Grand Capstone A: End-to-End LLM Pretrain -> SFT -> DPO Release Readiness Gate",
    "eDesc": "Write `certify_llm_release(mmlu: float, safety_asr: float, p95_tpot_ms: float, max_kl: float) -> tuple[bool, list[str]]`: enforce `mmlu >= 0.75` (`\"low_mmlu\"`), `safety_asr <= 0.02` (`\"unsafe_asr\"`), `p95_tpot_ms <= 40.0` (`\"slow_tpot\"`), and `max_kl <= 0.1` (`\"kl_drift\"`). Return `(passed, sorted_blockers)`.",
    "eStarter": "def certify_llm_release(mmlu: float, safety_asr: float, p95_tpot_ms: float, max_kl: float) -> tuple[bool, list[str]]:\n    # TODO\n    pass",
    "eHint": "def certify_llm_release(mmlu: float, safety_asr: float, p95_tpot_ms: float, max_kl: float) -> tuple[bool, list[str]]:\n    blk = []\n    if mmlu < 0.75:\n        blk.append(\"low_mmlu\")\n    if safety_asr > 0.02:\n        blk.append(\"unsafe_asr\")\n    if p95_tpot_ms > 40.0:\n        blk.append(\"slow_tpot\")\n    if max_kl > 0.1:\n        blk.append(\"kl_drift\")\n    blk.sort()\n    return (len(blk) == 0), blk",
    "eTest": "assert certify_llm_release(0.82, 0.01, 25.0, 0.05) == (True, [])\nassert certify_llm_release(0.70, 0.05, 50.0, 0.2) == (False, [\"kl_drift\", \"low_mmlu\", \"slow_tpot\", \"unsafe_asr\"])\nassert certify_llm_release(0.75, 0.02, 40.0, 0.1) == (True, [])\nprint('All checks passed.')",
    "aTitle": "Grand Capstone B: Sovereign Multi-Stage Compute & Alignment Cost Ledger",
    "aDesc": "Write `summarize_llm_lifecycle_cost(stages: list[tuple[str, float, float]]) -> dict`: each `(stage_name, gpu_hours, usd_per_gpu_hr)` sums stage USD cost (`total_usd`, rounded to 2 decimals) and identifies `\"dominant_stage\"` with highest USD spend (`\"\"` if empty).",
    "aStarter": "def summarize_llm_lifecycle_cost(stages: list[tuple[str, float, float]]) -> dict:\n    # TODO\n    pass",
    "aHint": "def summarize_llm_lifecycle_cost(stages: list[tuple[str, float, float]]) -> dict:\n    if not stages:\n        return {\"total_usd\": 0.0, \"dominant_stage\": \"\"}\n    by_s = {name: hrs * rate for name, hrs, rate in stages}\n    dom = max(by_s.items(), key=lambda x: (x[1], x[0]))[0]\n    return {\"total_usd\": round(sum(by_s.values()), 2), \"dominant_stage\": dom}",
    "aTest": "st = [(\"pretrain\", 10000.0, 2.5), (\"sft\", 200.0, 2.5), (\"dpo\", 400.0, 2.5)]\nassert summarize_llm_lifecycle_cost(st) == {\"total_usd\": 26500.0, \"dominant_stage\": \"pretrain\"}\nassert summarize_llm_lifecycle_cost([(\"align\", 10.0, 3.0)]) == {\"total_usd\": 30.0, \"dominant_stage\": \"align\"}\nassert summarize_llm_lifecycle_cost([]) == {\"total_usd\": 0.0, \"dominant_stage\": \"\"}\nprint('All checks passed.')"
  }
];

const indexByDay = new Map((MONTH2_LESSON_INDEX['nlp-py'] || []).map((entry) => [entry.day, entry]));

export const NLP_PYTHON_MONTH2_CONFIGS: DayConfig[] = RAW_M2_DAY_TASKS.map((t) => {
  const indexed = indexByDay.get(t.day);
  return {
    day: t.day,
    title: indexed?.title || t.fallbackTitle,
    desc: indexed?.goal || `${t.fallbackTitle} — hands-on coding labs.`,
    syllabus: indexed?.summary?.length ? indexed.summary : [t.eTitle, t.aTitle],
    eLanguage: 'python',
    aLanguage: 'python',
    eTitle: t.eTitle,
    eDesc: t.eDesc,
    eStarter: t.eStarter,
    eHint: t.eHint,
    eTest: t.eTest,
    aTitle: t.aTitle,
    aDesc: t.aDesc,
    aStarter: t.aStarter,
    aHint: t.aHint,
    aTest: t.aTest,
  };
});

export const NLP_PYTHON_MONTH2_QUESTS: CourseQuest[] = NLP_PYTHON_MONTH2_CONFIGS.flatMap((cfg) =>
  buildEnrichedDayQuests('nlp-py', cfg.day!, cfg)
);
