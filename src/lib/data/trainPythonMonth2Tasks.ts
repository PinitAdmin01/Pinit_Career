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
    "fallbackTitle": "Transformer Parameter & Activation Memory Accounting (Weights, Gradients, Adam States)",
    "eTitle": "Mixed-Precision AdamW Model State Byte Budget Estimator",
    "eDesc": "Write `adamw_state_gb(params_b: float, fp16_grads: bool = True) -> dict`: given `P = params_b * 1e9`, compute GiB (`1024**3`) for fp16 weights (`2*P`), gradients (`2*P if fp16_grads else 4*P`), and fp32 master weights + momentum + variance (`12*P`). Return rounded to 2 decimals for `{\"weights_gb\", \"grads_gb\", \"opt_gb\", \"total_gb\"}`.",
    "eStarter": "def adamw_state_gb(params_b: float, fp16_grads: bool = True) -> dict:\n    # TODO\n    pass",
    "eHint": "def adamw_state_gb(params_b: float, fp16_grads: bool = True) -> dict:\n    p = params_b * 1e9\n    gb = 1024 ** 3\n    w = (2.0 * p) / gb\n    g = ((2.0 if fp16_grads else 4.0) * p) / gb\n    o = (12.0 * p) / gb\n    return {\"weights_gb\": round(w, 2), \"grads_gb\": round(g, 2), \"opt_gb\": round(o, 2), \"total_gb\": round(w + g + o, 2)}",
    "eTest": "r = adamw_state_gb(7.0, True)\nassert abs(r[\"weights_gb\"] - 13.04) < 0.05\nassert abs(r[\"opt_gb\"] - 78.23) < 0.05\nassert abs(r[\"total_gb\"] - 104.31) < 0.05\nassert adamw_state_gb(7.0, False)[\"grads_gb\"] > r[\"grads_gb\"]\nprint('All checks passed.')",
    "aTitle": "Transformer Block Activation Memory Estimator (Per-Layer Korthikanti Formula)",
    "aDesc": "Write `transformer_activation_mb(batch: int, seq: int, hidden: int, heads: int, layers: int) -> float`: compute `layers * seq * batch * hidden * (34 + 5 * heads * seq / hidden)` bytes converted to MiB (`/ (1024 ** 2)`), rounded to 2 decimals.",
    "aStarter": "def transformer_activation_mb(batch: int, seq: int, hidden: int, heads: int, layers: int) -> float:\n    # TODO\n    pass",
    "aHint": "def transformer_activation_mb(batch: int, seq: int, hidden: int, heads: int, layers: int) -> float:\n    per_layer = seq * batch * hidden * (34.0 + (5.0 * heads * seq) / hidden)\n    return round((layers * per_layer) / (1024 ** 2), 2)",
    "aTest": "mb1 = transformer_activation_mb(1, 2048, 4096, 32, 32)\nmb2 = transformer_activation_mb(2, 2048, 4096, 32, 32)\nassert mb1 > 0.0\nassert abs(mb2 - 2 * mb1) < 0.05\nassert transformer_activation_mb(1, 1024, 4096, 32, 16) < mb1\nprint('All checks passed.')"
  },
  {
    "day": 32,
    "fallbackTitle": "Chinchilla Compute-Optimal Scaling Laws: Token-to-Parameter Frontier",
    "eTitle": "Chinchilla Optimal `(N*, D*)` Iso-FLOP Allocator",
    "eDesc": "Write `chinchilla_optimal(flops: float) -> dict`: using `C = 6 * N * D` and Chinchilla 20-tokens-per-param ratio (`D = 20 * N`), solve `N* = sqrt(flops / 120)` and `D* = 20 * N*`, returning `{\"params\": int(round(N)), \"tokens\": int(round(D)), \"ratio\": 20}`.",
    "eStarter": "import math\n\ndef chinchilla_optimal(flops: float) -> dict:\n    # TODO\n    pass",
    "eHint": "import math\n\ndef chinchilla_optimal(flops: float) -> dict:\n    n = math.sqrt(flops / 120.0)\n    d = 20.0 * n\n    return {\"params\": int(round(n)), \"tokens\": int(round(d)), \"ratio\": 20}",
    "eTest": "r = chinchilla_optimal(1.2e24)\nassert r[\"ratio\"] == 20\nassert abs(r[\"params\"] - 10 ** 11) < 1000\nassert abs(r[\"tokens\"] - 20 * (10 ** 11)) < 20000\nprint('All checks passed.')",
    "aTitle": "Chinchilla Hoffmann Parametric Loss Predictor `L(N, D)`",
    "aDesc": "Write `hoffmann_loss(n_params: float, d_tokens: float) -> float`: compute Chinchilla empirical loss `L(N, D) = 1.69 + 406.4 / (N ** 0.34) + 410.7 / (D ** 0.28)` rounded to 4 decimals.",
    "aStarter": "def hoffmann_loss(n_params: float, d_tokens: float) -> float:\n    # TODO\n    pass",
    "aHint": "def hoffmann_loss(n_params: float, d_tokens: float) -> float:\n    return round(1.69 + 406.4 / (n_params ** 0.34) + 410.7 / (d_tokens ** 0.28), 4)",
    "aTest": "l_small = hoffmann_loss(1e8, 2e9)\nl_big = hoffmann_loss(7e10, 1.4e12)\nassert l_big < l_small\nassert 1.7 < l_big < 2.1\nassert hoffmann_loss(1e10, 1e11) < l_small\nprint('All checks passed.')"
  },
  {
    "day": 33,
    "fallbackTitle": "Ring All-Reduce Bandwidth Math: Scatter-Reduce & All-Gather Step Latency",
    "eTitle": "Ring All-Reduce Data Transfer Volume & Latency Model",
    "eDesc": "Write `ring_allreduce_ms(tensor_mb: float, ranks: int, link_gbps: float, alpha_us: float) -> float`: model `2 * (N - 1)` ring steps with `S / N` payload per step (`N = ranks`), per-step latency `alpha_us` us plus transmission `(tensor_bytes / N) / (link_gbps * 1e9 / 8)`, returning total milliseconds rounded to 4 decimals (`0.0` if `ranks <= 1`).",
    "eStarter": "def ring_allreduce_ms(tensor_mb: float, ranks: int, link_gbps: float, alpha_us: float) -> float:\n    # TODO\n    pass",
    "eHint": "def ring_allreduce_ms(tensor_mb: float, ranks: int, link_gbps: float, alpha_us: float) -> float:\n    if ranks <= 1:\n        return 0.0\n    steps = 2 * (ranks - 1)\n    chunk_bytes = (tensor_mb * 1024 * 1024) / ranks\n    bw_bytes_sec = (link_gbps * 1e9) / 8.0\n    sec = steps * ((alpha_us * 1e-6) + chunk_bytes / bw_bytes_sec)\n    return round(sec * 1000.0, 4)",
    "eTest": "ms8 = ring_allreduce_ms(100.0, 8, 100.0, 5.0)\nassert ms8 > 14.0\nassert ring_allreduce_ms(100.0, 1, 100.0, 5.0) == 0.0\nassert ring_allreduce_ms(200.0, 8, 100.0, 5.0) > ms8\nprint('All checks passed.')",
    "aTitle": "Ring All-Reduce Scatter-Reduce + All-Gather Numeric Emulator",
    "aDesc": "Write `simulate_ring_allreduce(rank_vecs: list[list[float]]) -> list[list[float]]`: split each rank vector (equal length divisible by `N`) into `N` chunks, execute `N-1` scatter-reduce steps adding chunk `(r - step) % N` from left neighbor `(r - 1) % N`, then `N-1` all-gather steps propagating the reduced chunks around the ring.",
    "aStarter": "def simulate_ring_allreduce(rank_vecs: list[list[float]]) -> list[list[float]]:\n    # TODO\n    pass",
    "aHint": "def simulate_ring_allreduce(rank_vecs: list[list[float]]) -> list[list[float]]:\n    n = len(rank_vecs)\n    if n <= 1:\n        return [list(v) for v in rank_vecs]\n    c = len(rank_vecs[0]) // n\n    chunks = [[v[i * c:(i + 1) * c] for i in range(n)] for v in rank_vecs]\n    for step in range(n - 1):\n        updates = {}\n        for r in range(n):\n            src = (r - 1) % n\n            idx = (src - step) % n\n            updates[(r, idx)] = [a + b for a, b in zip(chunks[r][idx], chunks[src][idx])]\n        for (r, idx), val in updates.items():\n            chunks[r][idx] = val\n    for step in range(n - 1):\n        copies = {}\n        for r in range(n):\n            src = (r - 1) % n\n            idx = (src + 1 - step) % n\n            copies[(r, idx)] = list(chunks[src][idx])\n        for (r, idx), val in copies.items():\n            chunks[r][idx] = val\n    return [[x for ch in rank for x in ch] for rank in chunks]",
    "aTest": "out = simulate_ring_allreduce([[1.0, 2.0, 3.0], [4.0, 5.0, 6.0], [7.0, 8.0, 9.0]])\nassert len(out) == 3\nassert all(v == [12.0, 15.0, 18.0] for v in out)\nassert simulate_ring_allreduce([[5.0, 6.0]]) == [[5.0, 6.0]]\nprint('All checks passed.')"
  },
  {
    "day": 34,
    "fallbackTitle": "Tree All-Reduce vs Ring All-Reduce: Latency vs Bandwidth Crossover across Nodes",
    "eTitle": "Binary-Tree vs Ring All-Reduce Latency Crossover Analyzer",
    "eDesc": "Write `choose_allreduce_algo(tensor_mb: float, ranks: int, link_gbps: float, alpha_us: float) -> str`: compare Ring `2*(N-1)*(alpha + (M/N)/BW)` vs Tree `2*ceil(log2(N))*(alpha + M/BW)` and return `\"ring\"` if Ring time <= Tree time else `\"tree\"`.",
    "eStarter": "import math\n\ndef choose_allreduce_algo(tensor_mb: float, ranks: int, link_gbps: float, alpha_us: float) -> str:\n    # TODO\n    pass",
    "eHint": "import math\n\ndef choose_allreduce_algo(tensor_mb: float, ranks: int, link_gbps: float, alpha_us: float) -> str:\n    if ranks <= 1:\n        return \"ring\"\n    m_bytes = tensor_mb * 1024 * 1024\n    bw = (link_gbps * 1e9) / 8.0\n    alpha = alpha_us * 1e-6\n    t_ring = 2 * (ranks - 1) * (alpha + (m_bytes / ranks) / bw)\n    t_tree = 2 * math.ceil(math.log2(ranks)) * (alpha + m_bytes / bw)\n    return \"ring\" if t_ring <= t_tree else \"tree\"",
    "eTest": "assert choose_allreduce_algo(0.01, 256, 100.0, 10.0) == \"tree\"\nassert choose_allreduce_algo(500.0, 256, 100.0, 10.0) == \"ring\"\nassert choose_allreduce_algo(10.0, 1, 100.0, 5.0) == \"ring\"\nprint('All checks passed.')",
    "aTitle": "Communication-to-Computation Overlap Efficiency Calculator",
    "aDesc": "Write `step_overlap_efficiency(compute_ms: float, comm_ms: float, exposed_frac: float) -> dict`: compute `hidden = min(compute_ms, (1.0 - exposed_frac) * comm_ms)`, `total_ms = compute_ms + (comm_ms - hidden)`, and `compute_ratio = compute_ms / total_ms`. Round both to 4 decimals.",
    "aStarter": "def step_overlap_efficiency(compute_ms: float, comm_ms: float, exposed_frac: float) -> dict:\n    # TODO\n    pass",
    "aHint": "def step_overlap_efficiency(compute_ms: float, comm_ms: float, exposed_frac: float) -> dict:\n    hidden = min(compute_ms, (1.0 - exposed_frac) * comm_ms)\n    total = compute_ms + (comm_ms - hidden)\n    return {\"total_ms\": round(total, 4), \"compute_ratio\": round(compute_ms / total, 4) if total > 0 else 0.0}",
    "aTest": "r = step_overlap_efficiency(100.0, 40.0, 0.25)\nassert r[\"total_ms\"] == 110.0\nassert abs(r[\"compute_ratio\"] - 0.9091) < 0.001\nassert step_overlap_efficiency(10.0, 50.0, 0.0)[\"total_ms\"] == 50.0\nprint('All checks passed.')"
  },
  {
    "day": 35,
    "fallbackTitle": "Milestone 7: Distributed Cluster Memory & Collective Communication Planner",
    "eTitle": "Milestone 7A: Minimum GPU Replica Count & VRAM Feasibility Solver",
    "eDesc": "Write `min_gpus_for_model(params_b: float, vram_gb_per_gpu: float, act_gb_per_gpu: float, zero_stage: int) -> int`: using bf16 weights (`2*P`), bf16 grads (`2*P`), fp32 opt (`12*P`) converted to GiB (`1024**3`): Stage 0 replicates all `16*P` per GPU; Stage 1 shards `12*P`; Stage 2 shards `14*P`; Stage 3 shards all `16*P`. Return minimum `N >= 1` where `(replicated_gb + sharded_gb / N + act_gb_per_gpu) <= vram_gb_per_gpu` (`-1` if impossible).",
    "eStarter": "import math\n\ndef min_gpus_for_model(params_b: float, vram_gb_per_gpu: float, act_gb_per_gpu: float, zero_stage: int) -> int:\n    # TODO\n    pass",
    "eHint": "import math\n\ndef min_gpus_for_model(params_b: float, vram_gb_per_gpu: float, act_gb_per_gpu: float, zero_stage: int) -> int:\n    p_gb = (params_b * 1e9) / (1024 ** 3)\n    sharded_mult = {0: 0.0, 1: 12.0, 2: 14.0, 3: 16.0}[zero_stage]\n    rep = (16.0 - sharded_mult) * p_gb + act_gb_per_gpu\n    if rep > vram_gb_per_gpu:\n        return -1\n    if sharded_mult == 0.0:\n        return 1\n    avail = vram_gb_per_gpu - rep\n    if avail <= 1e-9:\n        return -1\n    return max(1, math.ceil((sharded_mult * p_gb) / avail))",
    "eTest": "assert min_gpus_for_model(7.0, 80.0, 10.0, 0) == -1\nassert min_gpus_for_model(7.0, 80.0, 10.0, 1) == 2\nassert min_gpus_for_model(7.0, 80.0, 10.0, 3) == 2\nassert min_gpus_for_model(1.0, 80.0, 10.0, 0) == 1\nprint('All checks passed.')",
    "aTitle": "Milestone 7B: Global Batch Size & Gradient Accumulation Schedule Planner",
    "aDesc": "Write `plan_grad_accum(target_global_tokens: int, dp_ranks: int, micro_batch: int, seq_len: int) -> dict`: compute tokens per micro-step `dp_ranks * micro_batch * seq_len`, minimum `grad_accum_steps = ceil(target / per_step)`, `achieved_tokens`, and `waste_pct` rounded to 2 decimals.",
    "aStarter": "import math\n\ndef plan_grad_accum(target_global_tokens: int, dp_ranks: int, micro_batch: int, seq_len: int) -> dict:\n    # TODO\n    pass",
    "aHint": "import math\n\ndef plan_grad_accum(target_global_tokens: int, dp_ranks: int, micro_batch: int, seq_len: int) -> dict:\n    step = dp_ranks * micro_batch * seq_len\n    accum = max(1, math.ceil(target_global_tokens / step))\n    ach = accum * step\n    waste = round(((ach - target_global_tokens) / ach) * 100.0, 2)\n    return {\"grad_accum_steps\": accum, \"achieved_tokens\": ach, \"waste_pct\": waste}",
    "aTest": "r = plan_grad_accum(1000000, 8, 2, 4096)\nassert r[\"grad_accum_steps\"] == 16\nassert r[\"achieved_tokens\"] == 1048576\nassert r[\"waste_pct\"] == 4.63\nprint('All checks passed.')"
  },
  {
    "day": 36,
    "fallbackTitle": "ZeRO Stage 1, Stage 2 & Stage 3 Memory Sharding & Communication Overhead",
    "eTitle": "ZeRO-1/2/3 Exact Communication Multiplier Calculator",
    "eDesc": "Write `zero_comm_volume_gb(params_b: float, stage: int) -> float`: in fp16/bf16 (`2 * params_b * 1e9 / 1024**3` GiB = `W`), Stages 0/1/2 transfer `2 * W` per optimizer step while Stage 3 transfers `3 * W`. Return GiB rounded to 2 decimals.",
    "eStarter": "def zero_comm_volume_gb(params_b: float, stage: int) -> float:\n    # TODO\n    pass",
    "eHint": "def zero_comm_volume_gb(params_b: float, stage: int) -> float:\n    w_gb = (2.0 * params_b * 1e9) / (1024 ** 3)\n    mult = 3.0 if stage == 3 else 2.0\n    return round(mult * w_gb, 2)",
    "eTest": "v2 = zero_comm_volume_gb(7.0, 2)\nv3 = zero_comm_volume_gb(7.0, 3)\nassert abs(v2 - 26.08) < 0.05\nassert abs(v3 - 39.12) < 0.05\nassert zero_comm_volume_gb(7.0, 1) == v2\nprint('All checks passed.')",
    "aTitle": "ZeRO-2 Gradient Bucket Flattener & Shard Reducer",
    "aDesc": "Write `zero2_reduce_scatter_buckets(rank_grads: list[list[float]], bucket_size: int) -> dict[int, list[float]]`: split parameters into contiguous buckets of size `bucket_size`; rank `b_idx % len(rank_grads)` owns reduced sum of bucket `b_idx`. Return `{rank: concatenated_owned_grad_floats}`.",
    "aStarter": "def zero2_reduce_scatter_buckets(rank_grads: list[list[float]], bucket_size: int) -> dict[int, list[float]]:\n    # TODO\n    pass",
    "aHint": "def zero2_reduce_scatter_buckets(rank_grads: list[list[float]], bucket_size: int) -> dict[int, list[float]]:\n    n_ranks = len(rank_grads)\n    out = {r: [] for r in range(n_ranks)}\n    m = len(rank_grads[0])\n    for b_idx, start in enumerate(range(0, m, bucket_size)):\n        end = min(m, start + bucket_size)\n        owner = b_idx % n_ranks\n        summed = [sum(rank_grads[r][i] for r in range(n_ranks)) for i in range(start, end)]\n        out[owner].extend(summed)\n    return out",
    "aTest": "res = zero2_reduce_scatter_buckets([[1, 2, 3, 4], [10, 20, 30, 40]], 2)\nassert res[0] == [11, 22]\nassert res[1] == [33, 44]\nassert zero2_reduce_scatter_buckets([[1, 2], [3, 4]], 1) == {0: [4], 1: [6]}\nprint('All checks passed.')"
  },
  {
    "day": 37,
    "fallbackTitle": "FSDP (Fully Sharded Data Parallel) All-Gather Prefetching & Hybrid Sharding",
    "eTitle": "FSDP Double-Buffered Prefetch Memory & Latency Overlap Planner",
    "eDesc": "Write `fsdp_unit_peak_mb(layer_params_m: float, prefetch_next: bool) -> float`: each FSDP unit materializes fp16 params (`2 bytes/param` in MiB); with `prefetch_next=True`, 2 unsharded layer buffers sit simultaneously in VRAM (`2 * layer_mb` vs `1 * layer_mb`). Return MiB rounded to 2 decimals.",
    "eStarter": "def fsdp_unit_peak_mb(layer_params_m: float, prefetch_next: bool) -> float:\n    # TODO\n    pass",
    "eHint": "def fsdp_unit_peak_mb(layer_params_m: float, prefetch_next: bool) -> float:\n    one = (layer_params_m * 1e6 * 2.0) / (1024 ** 2)\n    return round((2.0 if prefetch_next else 1.0) * one, 2)",
    "eTest": "m1 = fsdp_unit_peak_mb(200.0, False)\nm2 = fsdp_unit_peak_mb(200.0, True)\nassert abs(m1 - 381.47) < 0.05\nassert abs(m2 - 2 * m1) < 0.05\nassert fsdp_unit_peak_mb(100.0, False) < m1\nprint('All checks passed.')",
    "aTitle": "FSDP Hybrid Shard Process-Group Grid Partitioner (`HSDP`)",
    "aDesc": "Write `hsdp_groups(world_size: int, gpus_per_node: int) -> dict`: build `shard_groups` (chunks of size `gpus_per_node` for ZeRO-3 sharding over NVLink) and `replica_groups` (ranks sharing same local index across nodes for DP gradient AllReduce).",
    "aStarter": "def hsdp_groups(world_size: int, gpus_per_node: int) -> dict:\n    # TODO\n    pass",
    "aHint": "def hsdp_groups(world_size: int, gpus_per_node: int) -> dict:\n    shard = [list(range(i, i + gpus_per_node)) for i in range(0, world_size, gpus_per_node)]\n    rep = [[n * gpus_per_node + local for n in range(world_size // gpus_per_node)] for local in range(gpus_per_node)]\n    return {\"shard_groups\": shard, \"replica_groups\": rep}",
    "aTest": "g = hsdp_groups(8, 4)\nassert g[\"shard_groups\"] == [[0, 1, 2, 3], [4, 5, 6, 7]]\nassert g[\"replica_groups\"] == [[0, 4], [1, 5], [2, 6], [3, 7]]\nassert hsdp_groups(4, 4)[\"replica_groups\"] == [[0], [1], [2], [3]]\nprint('All checks passed.')"
  },
  {
    "day": 38,
    "fallbackTitle": "Megatron-LM Tensor Parallelism: Column-Parallel & Row-Parallel MLP Sharding",
    "eTitle": "Megatron Column-Parallel + Row-Parallel Sharded MLP Exact Verifier",
    "eDesc": "Write `megatron_mlp_tp(x: list[float], w1: list[list[float]], w2: list[list[float]], tp: int) -> list[float]`: given input `x` (`H`), `w1` (`H x F`, F divisible by `tp`), and `w2` (`F x H`), shard `w1` column-wise and `w2` row-wise across `tp` ranks, apply ReLU `max(0, v)` locally on each rank, then AllReduce-sum the `tp` rank partial outputs (`H`).",
    "eStarter": "def megatron_mlp_tp(x: list[float], w1: list[list[float]], w2: list[list[float]], tp: int) -> list[float]:\n    # TODO\n    pass",
    "eHint": "def megatron_mlp_tp(x: list[float], w1: list[list[float]], w2: list[list[float]], tp: int) -> list[float]:\n    h = len(x)\n    f = len(w1[0])\n    c = f // tp\n    partials = []\n    for r in range(tp):\n        lo, hi = r * c, (r + 1) * c\n        hid = [max(0.0, sum(x[i] * w1[i][j] for i in range(h))) for j in range(lo, hi)]\n        out_r = [sum(hid[k] * w2[lo + k][j] for k in range(c)) for j in range(h)]\n        partials.append(out_r)\n    return [round(sum(partials[r][j] for r in range(tp)), 6) for j in range(h)]",
    "eTest": "x = [1.0, -1.0]\nw1 = [[1.0, 2.0, 0.0, -1.0], [0.5, 1.0, 1.0, 1.0]]\nw2 = [[1.0, 0.0], [0.0, 1.0], [1.0, 1.0], [0.5, 0.5]]\nr1 = megatron_mlp_tp(x, w1, w2, 1)\nr2 = megatron_mlp_tp(x, w1, w2, 2)\nassert r1 == r2\nassert r2 == [0.5, 1.0]\nassert megatron_mlp_tp([0.0, 0.0], w1, w2, 2) == [0.0, 0.0]\nprint('All checks passed.')",
    "aTitle": "Tensor-Parallel Attention Head & KV-Cache Rank Allocator",
    "aDesc": "Write `tp_kv_layout(n_q_heads: int, n_kv_heads: int, head_dim: int, tp: int) -> dict`: validate `n_q_heads % tp == 0`. If `n_kv_heads >= tp`, each rank gets `n_kv_heads // tp` KV heads (`kv_replicated: False`); when `n_kv_heads < tp`, replicate 1 KV head per rank (`kv_per_rank = 1, kv_replicated = True`).",
    "aStarter": "def tp_kv_layout(n_q_heads: int, n_kv_heads: int, head_dim: int, tp: int) -> dict:\n    # TODO\n    pass",
    "aHint": "def tp_kv_layout(n_q_heads: int, n_kv_heads: int, head_dim: int, tp: int) -> dict:\n    if n_q_heads % tp != 0:\n        raise ValueError(\"q heads not divisible by tp\")\n    rep = n_kv_heads < tp\n    kv_pr = 1 if rep else (n_kv_heads // tp)\n    return {\"q_per_rank\": n_q_heads // tp, \"kv_per_rank\": kv_pr, \"kv_replicated\": rep}",
    "aTest": "assert tp_kv_layout(32, 8, 128, 8) == {\"q_per_rank\": 4, \"kv_per_rank\": 1, \"kv_replicated\": False}\nassert tp_kv_layout(32, 4, 128, 8) == {\"q_per_rank\": 4, \"kv_per_rank\": 1, \"kv_replicated\": True}\nassert tp_kv_layout(64, 16, 128, 4) == {\"q_per_rank\": 16, \"kv_per_rank\": 4, \"kv_replicated\": False}\nprint('All checks passed.')"
  },
  {
    "day": 39,
    "fallbackTitle": "Sequence Parallelism: Sharding LayerNorm & Dropout Activations Along Context",
    "eTitle": "Sequence-Parallel Activation Footprint Reduction Calculator",
    "eDesc": "Write `seq_parallel_act_mb(batch: int, seq: int, hidden: int, heads: int, layers: int, tp: int) -> float`: Korthikanti Sequence Parallelism divides transformer activation memory `(layers * seq * batch * hidden * (34 + 5 * heads * seq / hidden))` cleanly by `tp`, returning MiB rounded to 2 decimals.",
    "eStarter": "def seq_parallel_act_mb(batch: int, seq: int, hidden: int, heads: int, layers: int, tp: int) -> float:\n    # TODO\n    pass",
    "eHint": "def seq_parallel_act_mb(batch: int, seq: int, hidden: int, heads: int, layers: int, tp: int) -> float:\n    full = layers * seq * batch * hidden * (34.0 + (5.0 * heads * seq) / hidden)\n    return round((full / tp) / (1024 ** 2), 2)",
    "eTest": "tp1 = seq_parallel_act_mb(1, 2048, 4096, 32, 32, 1)\ntp8 = seq_parallel_act_mb(1, 2048, 4096, 32, 32, 8)\nassert abs(tp8 - tp1 / 8.0) < 0.05\nassert tp8 > 0.0\nassert seq_parallel_act_mb(1, 2048, 4096, 32, 32, 4) > tp8\nprint('All checks passed.')",
    "aTitle": "Sequence-Parallel All-Gather / Reduce-Scatter Token Sharder",
    "aDesc": "Write `sp_layer_norm_roundtrip(tokens_by_rank: list[list[list[float]]]) -> list[list[list[float]]]`: apply local LayerNorm (`(x - mu) / sqrt(var + 1e-5)`) per token vector on each rank independently, then All-Gather all rank sequences across every rank (rounded to 4 decimals).",
    "aStarter": "import math\n\ndef sp_layer_norm_roundtrip(tokens_by_rank: list[list[list[float]]]) -> list[list[list[float]]]:\n    # TODO\n    pass",
    "aHint": "import math\n\ndef sp_layer_norm_roundtrip(tokens_by_rank: list[list[list[float]]]) -> list[list[list[float]]]:\n    normed_shards = []\n    for shard in tokens_by_rank:\n        ns = []\n        for tok in shard:\n            mu = sum(tok) / len(tok)\n            var = sum((v - mu) ** 2 for v in tok) / len(tok)\n            sd = math.sqrt(var + 1e-5)\n            ns.append([round((v - mu) / sd, 4) for v in tok])\n        normed_shards.append(ns)\n    gathered = [tok for ns in normed_shards for tok in ns]\n    return [[list(t) for t in gathered] for _ in tokens_by_rank]",
    "aTest": "out = sp_layer_norm_roundtrip([[[0.0, 2.0]], [[10.0, 12.0]]])\nassert len(out) == 2 and len(out[0]) == 2\nassert out[0] == out[1]\nassert abs(out[0][0][0] + 1.0) < 0.01 and abs(out[0][1][1] - 1.0) < 0.01\nprint('All checks passed.')"
  },
  {
    "day": 40,
    "fallbackTitle": "Milestone 8: 3D Parallelism (DP + TP + SP) Sharding Configuration Engine",
    "eTitle": "Milestone 8A: 3D Process-Grid Coordinator (DP x PP x TP) Rank Mapper",
    "eDesc": "Write `rank_to_3d_coords(rank: int, tp: int, pp: int, dp: int) -> dict`: using fastest-varying-TP order `rank = ((dp_idx * pp + pp_idx) * tp) + tp_idx`, decode `(dp_idx, pp_idx, tp_idx)` and return `\"tp_peers\"` and `\"dp_peers\"`.",
    "eStarter": "def rank_to_3d_coords(rank: int, tp: int, pp: int, dp: int) -> dict:\n    # TODO\n    pass",
    "eHint": "def rank_to_3d_coords(rank: int, tp: int, pp: int, dp: int) -> dict:\n    tp_idx = rank % tp\n    pp_idx = (rank // tp) % pp\n    dp_idx = rank // (tp * pp)\n    tp_peers = [((dp_idx * pp + pp_idx) * tp) + t for t in range(tp)]\n    dp_peers = [((d * pp + pp_idx) * tp) + tp_idx for d in range(dp)]\n    return {\"coords\": (dp_idx, pp_idx, tp_idx), \"tp_peers\": tp_peers, \"dp_peers\": dp_peers}",
    "eTest": "r = rank_to_3d_coords(5, tp=2, pp=2, dp=2)\nassert r[\"coords\"] == (1, 0, 1)\nassert r[\"tp_peers\"] == [4, 5]\nassert r[\"dp_peers\"] == [1, 5]\nprint('All checks passed.')",
    "aTitle": "Milestone 8B: 3D Sharding Configuration Feasibility & Per-GPU Memory Auditor",
    "aDesc": "Write `audit_3d_config(params_b: float, gpus_per_node: int, total_gpus: int, tp: int, pp: int, zero_dp: bool) -> dict`: compute `dp = total_gpus // (pp * tp)`, flag `\"tp_cross_node\": tp > gpus_per_node`, and compute per-GPU state GiB `(16 * params_b * 1e9 / 1024**3) / (tp * pp * (dp if zero_dp else 1))` rounded to 2 decimals.",
    "aStarter": "def audit_3d_config(params_b: float, gpus_per_node: int, total_gpus: int, tp: int, pp: int, zero_dp: bool) -> dict:\n    # TODO\n    pass",
    "aHint": "def audit_3d_config(params_b: float, gpus_per_node: int, total_gpus: int, tp: int, pp: int, zero_dp: bool) -> dict:\n    dp = total_gpus // (pp * tp)\n    denom = tp * pp * (dp if zero_dp else 1)\n    state = (16.0 * params_b * 1e9) / (1024 ** 3) / denom\n    return {\"dp\": dp, \"tp_cross_node\": tp > gpus_per_node, \"state_gb\": round(state, 2)}",
    "aTest": "ok = audit_3d_config(70.0, 8, 64, 8, 4, True)\nbad = audit_3d_config(70.0, 8, 64, 16, 2, False)\nassert ok[\"dp\"] == 2 and ok[\"tp_cross_node\"] is False\nassert ok[\"state_gb\"] < 20.0\nassert bad[\"tp_cross_node\"] is True and bad[\"state_gb\"] > 30.0\nprint('All checks passed.')"
  },
  {
    "day": 41,
    "fallbackTitle": "Pipeline Parallelism: GPipe vs 1F1B (One-Forward-One-Backward) Bubble Ratio Math",
    "eTitle": "GPipe vs 1F1B Bubble Fraction & Peak In-Flight Microbatch Comparator",
    "eDesc": "Write `pipeline_metrics(p_stages: int, m_microbatches: int, mode: str) -> dict`: compute bubble percentage `((p - 1) / (p - 1 + m)) * 100` rounded to 2 decimals and peak stage-0 in-flight microbatches (`m` for `\"gpipe\"`, `min(p, m)` for `\"1f1b\"`).",
    "eStarter": "def pipeline_metrics(p_stages: int, m_microbatches: int, mode: str) -> dict:\n    # TODO\n    pass",
    "eHint": "def pipeline_metrics(p_stages: int, m_microbatches: int, mode: str) -> dict:\n    bubble = ((p_stages - 1) / (p_stages - 1 + m_microbatches)) * 100.0\n    peak = m_microbatches if mode == \"gpipe\" else min(p_stages, m_microbatches)\n    return {\"bubble_pct\": round(bubble, 2), \"stage0_peak_microbatches\": peak}",
    "eTest": "gp = pipeline_metrics(4, 16, \"gpipe\")\nf1 = pipeline_metrics(4, 16, \"1f1b\")\nassert abs(gp[\"bubble_pct\"] - 15.79) < 0.05\nassert gp[\"stage0_peak_microbatches\"] == 16\nassert f1[\"stage0_peak_microbatches\"] == 4\nprint('All checks passed.')",
    "aTitle": "Non-Interleaved 1F1B Schedule Emitter (Per-Stage Step Sequence)",
    "aDesc": "Write `emit_1f1b_schedule(stage: int, p_stages: int, m_microbatches: int) -> list[str]`: emit ordered `\"F<i>\"` and `\"B<i>\"` operations on `stage` (`0 <= stage < p_stages`): `warmup = min(m, p - stage - 1)` forwards, steady 1F1B pairs `(\"F<i>\", \"B<i - warmup>\")`, and final `warmup` cooldown backwards.",
    "aStarter": "def emit_1f1b_schedule(stage: int, p_stages: int, m_microbatches: int) -> list[str]:\n    # TODO\n    pass",
    "aHint": "def emit_1f1b_schedule(stage: int, p_stages: int, m_microbatches: int) -> list[str]:\n    warmup = min(m_microbatches, p_stages - stage - 1)\n    ops = [f\"F{i}\" for i in range(warmup)]\n    for i in range(warmup, m_microbatches):\n        ops.append(f\"F{i}\")\n        ops.append(f\"B{i - warmup}\")\n    for i in range(m_microbatches - warmup, m_microbatches):\n        ops.append(f\"B{i}\")\n    return ops",
    "aTest": "s0 = emit_1f1b_schedule(0, 4, 6)\ns3 = emit_1f1b_schedule(3, 4, 6)\nassert s0[:4] == [\"F0\", \"F1\", \"F2\", \"F3\"] and s0[4] == \"B0\"\nassert s3[:4] == [\"F0\", \"B0\", \"F1\", \"B1\"]\nassert len(s0) == 12 and len(s3) == 12\nprint('All checks passed.')"
  },
  {
    "day": 42,
    "fallbackTitle": "Interleaved 1F1B Virtual Pipeline Stages & Microbatch Schedule Optimization",
    "eTitle": "Interleaved 1F1B Virtual Stage Bubble Reduction Calculator",
    "eDesc": "Write `interleaved_bubble_pct(p_stages: int, m_microbatches: int, v_chunks: int) -> dict`: Megatron Interleaved 1F1B achieves `bubble_pct = ((p - 1) / (p - 1 + v * m)) * 100` rounded to 2 decimals with `comm_mult = v_chunks`.",
    "eStarter": "def interleaved_bubble_pct(p_stages: int, m_microbatches: int, v_chunks: int) -> dict:\n    # TODO\n    pass",
    "eHint": "def interleaved_bubble_pct(p_stages: int, m_microbatches: int, v_chunks: int) -> dict:\n    ratio = (p_stages - 1) / ((p_stages - 1) + v_chunks * m_microbatches)\n    return {\"bubble_pct\": round(ratio * 100.0, 2), \"comm_mult\": v_chunks}",
    "eTest": "b1 = interleaved_bubble_pct(8, 16, 1)\nb4 = interleaved_bubble_pct(8, 16, 4)\nassert b4[\"bubble_pct\"] < b1[\"bubble_pct\"] / 2\nassert b4[\"comm_mult\"] == 4\nassert abs(b4[\"bubble_pct\"] - 9.86) < 0.05\nprint('All checks passed.')",
    "aTitle": "Virtual-Stage Model Chunk Assigner (Interleaved Layer Mapping)",
    "aDesc": "Write `assign_virtual_chunks(num_layers: int, p_stages: int, v_chunks: int) -> list[dict]`: assign `num_layers` evenly across `p_stages * v_chunks` chunks in interleaved stride `rank = chunk_idx % p_stages`, returning ordered `[{\"chunk\": c, \"rank\": r, \"layers\": [lo..hi]}]`.",
    "aStarter": "def assign_virtual_chunks(num_layers: int, p_stages: int, v_chunks: int) -> list[dict]:\n    # TODO\n    pass",
    "aHint": "def assign_virtual_chunks(num_layers: int, p_stages: int, v_chunks: int) -> list[dict]:\n    total_chunks = p_stages * v_chunks\n    step = num_layers // total_chunks\n    out = []\n    for c in range(total_chunks):\n        lo = c * step\n        out.append({\"chunk\": c, \"rank\": c % p_stages, \"layers\": list(range(lo, lo + step))})\n    return out",
    "aTest": "cs = assign_virtual_chunks(16, 4, 2)\nassert len(cs) == 8\nassert cs[0][\"rank\"] == 0 and cs[4][\"rank\"] == 0\nassert cs[1][\"layers\"] == [2, 3]\nprint('All checks passed.')"
  },
  {
    "day": 43,
    "fallbackTitle": "Context Parallelism (Ring Attention) for Million-Token Sequence Training",
    "eTitle": "Ring Attention Online-Softmax Blockwise Exact Kernel",
    "eDesc": "Write `ring_attention_query_block(q: list[float], kv_blocks: list[tuple[list[list[float]], list[list[float]]]]) -> list[float]`: stream a query token vector `q` over ring KV blocks using online softmax rescaling without materializing full score matrices. Return output vector rounded to 6 decimals.",
    "eStarter": "import math\n\ndef ring_attention_query_block(q: list[float], kv_blocks: list[tuple[list[list[float]], list[list[float]]]]) -> list[float]:\n    # TODO\n    pass",
    "eHint": "import math\n\ndef ring_attention_query_block(q: list[float], kv_blocks: list[tuple[list[list[float]], list[list[float]]]]) -> list[float]:\n    d = len(q)\n    scale = 1.0 / math.sqrt(d)\n    m = float(\"-inf\")\n    l = 0.0\n    acc = [0.0] * d\n    for ks, vs in kv_blocks:\n        scores = [sum(q[j] * k[j] for j in range(d)) * scale for k in ks]\n        bm = max(scores)\n        nm = max(m, bm)\n        alpha = 0.0 if m == float(\"-inf\") else math.exp(m - nm)\n        exps = [math.exp(s - nm) for s in scores]\n        nl = l * alpha + sum(exps)\n        for j in range(d):\n            acc[j] = acc[j] * alpha + sum(exps[t] * vs[t][j] for t in range(len(vs)))\n        m, l = nm, nl\n    return [round(acc[j] / l, 6) for j in range(d)]",
    "eTest": "q = [1.0, 0.0]\nk1, v1 = [[1.0, 0.0], [0.0, 1.0]], [[10.0, 0.0], [0.0, 10.0]]\nk2, v2 = [[2.0, 0.0]], [[20.0, 20.0]]\nr_stream = ring_attention_query_block(q, [(k1, v1), (k2, v2)])\nr_full = ring_attention_query_block(q, [(k1 + k2, v1 + v2)])\nassert r_stream == r_full\nassert r_stream[0] > 14.0 and r_stream[1] > 10.0\nassert ring_attention_query_block(q, [([[0.0, 0.0]], [[3.0, 4.0]])]) == [3.0, 4.0]\nprint('All checks passed.')",
    "aTitle": "Zig-Zag Causal Load-Balanced Ring Attention Sequence Partitioner",
    "aDesc": "Write `zigzag_causal_chunks(seq_len: int, cp_ranks: int) -> dict[int, list[int]]`: divide `[0..seq_len)` into `2 * cp_ranks` contiguous blocks; assign rank `r` block `r` plus mirror block `2*cp_ranks - 1 - r` so every rank computes balanced causal attention pairs.",
    "aStarter": "def zigzag_causal_chunks(seq_len: int, cp_ranks: int) -> dict[int, list[int]]:\n    # TODO\n    pass",
    "aHint": "def zigzag_causal_chunks(seq_len: int, cp_ranks: int) -> dict[int, list[int]]:\n    chunks = 2 * cp_ranks\n    bsz = seq_len // chunks\n    out = {}\n    for r in range(cp_ranks):\n        c1 = list(range(r * bsz, (r + 1) * bsz))\n        m = chunks - 1 - r\n        c2 = list(range(m * bsz, (m + 1) * bsz))\n        out[r] = c1 + c2\n    return out",
    "aTest": "zz = zigzag_causal_chunks(16, 4)\nassert zz[0] == [0, 1, 14, 15]\nassert zz[3] == [6, 7, 8, 9]\nassert len(set(i for v in zz.values() for i in v)) == 16\nprint('All checks passed.')"
  },
  {
    "day": 44,
    "fallbackTitle": "Selective Activation Checkpointing: Recomputation FLOPs vs VRAM Saved",
    "eTitle": "Selective vs Full Activation Checkpointing Pareto Optimizer",
    "eDesc": "Write `checkpoint_tradeoff(seq: int, hidden: int, heads: int, mode: str) -> dict`: model per-layer activation factor `\"none\": 34 + 5*heads*seq/hidden`, `\"selective\": 34`, `\"full\": 2`, with compute multipliers `\"none\": 1.0`, `\"selective\": 1.04`, `\"full\": 1.33`. Return `{\"act_factor\": float, \"compute_mult\": float}`.",
    "eStarter": "def checkpoint_tradeoff(seq: int, hidden: int, heads: int, mode: str) -> dict:\n    # TODO\n    pass",
    "eHint": "def checkpoint_tradeoff(seq: int, hidden: int, heads: int, mode: str) -> dict:\n    attn_part = (5.0 * heads * seq) / hidden\n    if mode == \"none\":\n        return {\"act_factor\": round(34.0 + attn_part, 2), \"compute_mult\": 1.0}\n    if mode == \"selective\":\n        return {\"act_factor\": 34.0, \"compute_mult\": 1.04}\n    return {\"act_factor\": 2.0, \"compute_mult\": 1.33}",
    "eTest": "n = checkpoint_tradeoff(4096, 4096, 32, \"none\")\ns = checkpoint_tradeoff(4096, 4096, 32, \"selective\")\nf = checkpoint_tradeoff(4096, 4096, 32, \"full\")\nassert n[\"act_factor\"] == 194.0 and s[\"act_factor\"] == 34.0\nassert s[\"compute_mult\"] == 1.04 and f[\"compute_mult\"] == 1.33\nassert f[\"act_factor\"] < s[\"act_factor\"] < n[\"act_factor\"]\nprint('All checks passed.')",
    "aTitle": "Minimum-Memory Recursive Tree Segment Activation Checkpointing Planner",
    "aDesc": "Write `sqrt_checkpoint_schedule(n_layers: int) -> dict`: uniform `sqrt(N)` checkpointing stores every `k = ceil(sqrt(n_layers))` boundary layer (starting at 0). Return `{\"stride\": k, \"stored_indices\": list[int], \"peak_segment_len\": int}`.",
    "aStarter": "import math\n\ndef sqrt_checkpoint_schedule(n_layers: int) -> dict:\n    # TODO\n    pass",
    "aHint": "import math\n\ndef sqrt_checkpoint_schedule(n_layers: int) -> dict:\n    k = math.ceil(math.sqrt(n_layers))\n    stored = list(range(0, n_layers, k))\n    seg_lens = [((stored[i + 1] if i + 1 < len(stored) else n_layers) - stored[i]) for i in range(len(stored))]\n    return {\"stride\": k, \"stored_indices\": stored, \"peak_segment_len\": max(seg_lens) if seg_lens else 0}",
    "aTest": "r = sqrt_checkpoint_schedule(32)\nassert r[\"stride\"] == 6\nassert r[\"stored_indices\"] == [0, 6, 12, 18, 24, 30]\nassert r[\"peak_segment_len\"] == 6\nprint('All checks passed.')"
  },
  {
    "day": 45,
    "fallbackTitle": "Milestone 9: Pipeline Schedule Simulator & Activation Recomputation Optimizer",
    "eTitle": "Milestone 9A: Pipeline + Recomputation Combined Peak VRAM Estimator",
    "eDesc": "Write `stage0_vram_gb(p_stages: int, m_microbatches: int, per_micro_act_gb: float, shard_state_gb: float, mode: str) -> float`: stage 0 holds `m` in-flight activations under `\"gpipe\"` or `min(p_stages, m_microbatches)` under `\"1f1b\"` plus `shard_state_gb`. Return GiB rounded to 2 decimals.",
    "eStarter": "def stage0_vram_gb(p_stages: int, m_microbatches: int, per_micro_act_gb: float, shard_state_gb: float, mode: str) -> float:\n    # TODO\n    pass",
    "eHint": "def stage0_vram_gb(p_stages: int, m_microbatches: int, per_micro_act_gb: float, shard_state_gb: float, mode: str) -> float:\n    inflight = m_microbatches if mode == \"gpipe\" else min(p_stages, m_microbatches)\n    return round(shard_state_gb + inflight * per_micro_act_gb, 2)",
    "eTest": "assert stage0_vram_gb(8, 32, 1.5, 20.0, \"gpipe\") == 68.0\nassert stage0_vram_gb(8, 32, 1.5, 20.0, \"1f1b\") == 32.0\nassert stage0_vram_gb(8, 4, 1.5, 20.0, \"1f1b\") == 26.0\nprint('All checks passed.')",
    "aTitle": "Milestone 9B: Interleaved 1F1B Step-Time Optimizer Across Microbatch Counts",
    "aDesc": "Write `best_microbatch_for_budget(p_stages: int, v_chunks: int, micro_step_ms: float, max_bubble_pct: float) -> int`: find smallest `m >= p_stages` where interleaved bubble `((p - 1) / (p - 1 + v * m)) * 100 <= max_bubble_pct` (`1` min if `p <= 1`).",
    "aStarter": "def best_microbatch_for_budget(p_stages: int, v_chunks: int, micro_step_ms: float, max_bubble_pct: float) -> int:\n    # TODO\n    pass",
    "aHint": "def best_microbatch_for_budget(p_stages: int, v_chunks: int, micro_step_ms: float, max_bubble_pct: float) -> int:\n    if p_stages <= 1:\n        return 1\n    m = p_stages\n    while ((p_stages - 1) / ((p_stages - 1) + v_chunks * m)) * 100.0 > max_bubble_pct:\n        m += 1\n    return m",
    "aTest": "assert best_microbatch_for_budget(8, 1, 10.0, 10.0) == 63\nassert best_microbatch_for_budget(8, 4, 10.0, 10.0) == 16\nassert best_microbatch_for_budget(1, 1, 10.0, 5.0) == 1\nprint('All checks passed.')"
  },
  {
    "day": 46,
    "fallbackTitle": "BF16 vs FP16 Mixed Precision: Dynamic Loss Scaling & Underflow/Overflow Guards",
    "eTitle": "Dynamic FP16 Loss Scaler with Growth Interval & Backoff",
    "eDesc": "Implement `GradScaler(init_scale: float = 65536.0, backoff: float = 0.5, growth_interval: int = 3)`: `step(has_inf_or_nan: bool) -> dict` skips optimizer on overflow (`applied=False`), scales `scale = max(1.0, scale * backoff)`, and resets clean streak; otherwise applies and doubles `scale` after `growth_interval` clean steps.",
    "eStarter": "class GradScaler:\n    def __init__(self, init_scale: float = 65536.0, backoff: float = 0.5, growth_interval: int = 3):\n        # TODO\n        pass\n\n    def step(self, has_inf_or_nan: bool) -> dict:\n        # TODO\n        pass",
    "eHint": "class GradScaler:\n    def __init__(self, init_scale: float = 65536.0, backoff: float = 0.5, growth_interval: int = 3):\n        self.scale = float(init_scale)\n        self.backoff = backoff\n        self.growth_interval = growth_interval\n        self.clean = 0\n\n    def step(self, has_inf_or_nan: bool) -> dict:\n        if has_inf_or_nan:\n            self.scale = max(1.0, self.scale * self.backoff)\n            self.clean = 0\n            return {\"applied\": False, \"scale\": self.scale}\n        self.clean += 1\n        if self.clean >= self.growth_interval:\n            self.scale *= 2.0\n            self.clean = 0\n        return {\"applied\": True, \"scale\": self.scale}",
    "eTest": "gs = GradScaler(1024.0, 0.5, 2)\nassert gs.step(True) == {\"applied\": False, \"scale\": 512.0}\nassert gs.step(False) == {\"applied\": True, \"scale\": 512.0}\nassert gs.step(False) == {\"applied\": True, \"scale\": 1024.0}\nprint('All checks passed.')",
    "aTitle": "FP16 vs BF16 Representable Range & Subnormal Underflow Simulator",
    "aDesc": "Write `check_fp_precision_fit(grad_abs: float) -> dict`: classify gradient magnitude against FP16 subnormal floor (`5.96e-8`), FP16 normal floor (`6.10e-5`), FP16 max (`65504.0`), and BF16 normal range (`1.175e-38 <= x <= 3.39e38`).",
    "aStarter": "def check_fp_precision_fit(grad_abs: float) -> dict:\n    # TODO\n    pass",
    "aHint": "def check_fp_precision_fit(grad_abs: float) -> dict:\n    if grad_abs == 0.0:\n        return {\"fp16_status\": \"ok\", \"bf16_status\": \"ok\"}\n    if grad_abs > 65504.0:\n        f16 = \"overflow\"\n    elif grad_abs < 5.96e-8:\n        f16 = \"underflow\"\n    elif grad_abs < 6.10e-5:\n        f16 = \"subnormal\"\n    else:\n        f16 = \"ok\"\n    b16 = \"overflow\" if grad_abs > 3.39e38 else (\"underflow\" if grad_abs < 1.175e-38 else \"ok\")\n    return {\"fp16_status\": f16, \"bf16_status\": b16}",
    "aTest": "assert check_fp_precision_fit(1e-6) == {\"fp16_status\": \"subnormal\", \"bf16_status\": \"ok\"}\nassert check_fp_precision_fit(1e-9) == {\"fp16_status\": \"underflow\", \"bf16_status\": \"ok\"}\nassert check_fp_precision_fit(100000.0) == {\"fp16_status\": \"overflow\", \"bf16_status\": \"ok\"}\nprint('All checks passed.')"
  },
  {
    "day": 47,
    "fallbackTitle": "FP8 Training: Delayed Scaling History Buffers & Per-Tensor E4M3/E5M2 Formats",
    "eTitle": "FP8 E4M3 / E5M2 Dynamic Amax-History Quantization Scaler",
    "eDesc": "Implement `FP8DelayedScaler(history_len: int = 4, fp8_max: float = 448.0)`: maintain sliding `deque` of `amax` measurements; `next_scale(cur_amax: float) -> float` appends `cur_amax` and returns `round(fp8_max / max(max(history), 1e-12), 4)`.",
    "eStarter": "class FP8DelayedScaler:\n    def __init__(self, history_len: int = 4, fp8_max: float = 448.0):\n        # TODO\n        pass\n\n    def next_scale(self, cur_amax: float) -> float:\n        # TODO\n        pass",
    "eHint": "from collections import deque\n\nclass FP8DelayedScaler:\n    def __init__(self, history_len: int = 4, fp8_max: float = 448.0):\n        self.hist = deque(maxlen=history_len)\n        self.fp8_max = float(fp8_max)\n\n    def next_scale(self, cur_amax: float) -> float:\n        self.hist.append(abs(cur_amax))\n        amax = max(self.hist)\n        return round(self.fp8_max / max(amax, 1e-12), 4)",
    "eTest": "sc = FP8DelayedScaler(3, 448.0)\nassert sc.next_scale(2.0) == 224.0\nassert sc.next_scale(8.0) == 56.0\nassert sc.next_scale(1.0) == 56.0\nassert sc.next_scale(4.0) == 56.0\nassert sc.next_scale(4.0) == 112.0\nprint('All checks passed.')",
    "aTitle": "Per-Tensor E4M3 Quantize-Dequantize Rounding Error Estimator",
    "aDesc": "Write `fp8_e4m3_quant_mse(vals: list[float], amax: float) -> float`: scale by `448.0 / amax`, clip to `[-448, 448]`, round onto 3-bit mantissa grid (`step = 2**(floor(log2(|x|)) - 3)` for `|x| >= 2**-6` else `0`), dequantize, and return MSE rounded to 8 decimals.",
    "aStarter": "import math\n\ndef fp8_e4m3_quant_mse(vals: list[float], amax: float) -> float:\n    # TODO\n    pass",
    "aHint": "import math\n\ndef fp8_e4m3_quant_mse(vals: list[float], amax: float) -> float:\n    if not vals or amax <= 0:\n        return 0.0\n    scale = 448.0 / amax\n    err = 0.0\n    for v in vals:\n        sv = max(-448.0, min(448.0, v * scale))\n        if abs(sv) < 2.0 ** -6:\n            qv = 0.0\n        else:\n            step = 2.0 ** (math.floor(math.log2(abs(sv))) - 3)\n            qv = round(sv / step) * step\n        dq = qv / scale\n        err += (v - dq) ** 2\n    return round(err / len(vals), 8)",
    "aTest": "mse1 = fp8_e4m3_quant_mse([2.0, -4.0, 8.0, 448.0], 448.0)\nmse_noisy = fp8_e4m3_quant_mse([0.123456, -1.987654, 0.7777], 2.0)\nassert mse1 == 0.0\nassert 0.0 < mse_noisy < 0.01\nassert fp8_e4m3_quant_mse([], 1.0) == 0.0\nprint('All checks passed.')"
  },
  {
    "day": 48,
    "fallbackTitle": "FlashAttention IO-Awareness: Online Softmax Tiling & HBM Read/Write Reduction",
    "eTitle": "FlashAttention vs Standard Attention HBM Traffic Calculator",
    "eDesc": "Write `hbm_io_reduction(seq: int, d_head: int, sram_floats: int) -> dict`: in fp16 (2 bytes/float), Standard Attention moves `(4 * N * d + 2 * N^2) * 2 / 1024^2` MiB while FlashAttention moves `(4 * N * d + 2 * N^2 * d / sram_floats) * 2 / 1024^2` MiB. Return `{\"std_mb\", \"flash_mb\", \"speedup\"}` rounded to 2 decimals.",
    "eStarter": "def hbm_io_reduction(seq: int, d_head: int, sram_floats: int) -> dict:\n    # TODO\n    pass",
    "eHint": "def hbm_io_reduction(seq: int, d_head: int, sram_floats: int) -> dict:\n    mib = 1024 ** 2\n    std_mb = ((4.0 * seq * d_head + 2.0 * seq * seq) * 2.0) / mib\n    flash_mb = ((4.0 * seq * d_head + (2.0 * seq * seq * d_head) / sram_floats) * 2.0) / mib\n    return {\"std_mb\": round(std_mb, 2), \"flash_mb\": round(flash_mb, 2), \"speedup\": round(std_mb / flash_mb, 2)}",
    "eTest": "r = hbm_io_reduction(4096, 64, 65536)\nassert r[\"std_mb\"] > 60.0\nassert r[\"flash_mb\"] < r[\"std_mb\"] / 3\nassert r[\"speedup\"] > 3.0\nprint('All checks passed.')",
    "aTitle": "Tiled FlashAttention-2 Forward Kernel (Exact Equivalence to Full Softmax)",
    "aDesc": "Write `flash_attn_tiled(q: list[list[float]], k: list[list[float]], v: list[list[float]], b_r: int, b_c: int) -> list[list[float]]`: split `Q` into `b_r` row blocks and `K,V` into `b_c` column blocks, accumulate exact attention output using `1/sqrt(d)` scaling and FlashAttention-2 online rescaling, rounded to 6 decimals.",
    "aStarter": "import math\n\ndef flash_attn_tiled(q: list[list[float]], k: list[list[float]], v: list[list[float]], b_r: int, b_c: int) -> list[list[float]]:\n    # TODO\n    pass",
    "aHint": "import math\n\ndef flash_attn_tiled(q: list[list[float]], k: list[list[float]], v: list[list[float]], b_r: int, b_c: int) -> list[list[float]]:\n    n, d = len(q), len(q[0])\n    scale = 1.0 / math.sqrt(d)\n    out = [[0.0] * d for _ in range(n)]\n    for rs in range(0, n, b_r):\n        re = min(n, rs + b_r)\n        for qi in range(rs, re):\n            m = float(\"-inf\")\n            l = 0.0\n            acc = [0.0] * d\n            for cs in range(0, len(k), b_c):\n                ce = min(len(k), cs + b_c)\n                sc = [sum(q[qi][j] * k[ki][j] for j in range(d)) * scale for ki in range(cs, ce)]\n                nm = max(m, max(sc))\n                alpha = 0.0 if m == float(\"-inf\") else math.exp(m - nm)\n                ex = [math.exp(s - nm) for s in sc]\n                l = l * alpha + sum(ex)\n                for j in range(d):\n                    acc[j] = acc[j] * alpha + sum(ex[t] * v[cs + t][j] for t in range(len(ex)))\n                m = nm\n            out[qi] = [round(acc[j] / l, 6) for j in range(d)]\n    return out",
    "aTest": "q = [[1.0, 0.0], [0.0, 1.0], [1.0, 1.0]]\nk = [[1.0, 0.0], [0.0, 2.0], [-1.0, 0.0]]\nv = [[2.0, 1.0], [0.0, 5.0], [-2.0, 0.0]]\nt1 = flash_attn_tiled(q, k, v, 1, 1)\nt3 = flash_attn_tiled(q, k, v, 3, 3)\nassert t1 == t3\nassert len(t1) == 3 and t1[1][1] > t1[0][1]\nassert t1[0][0] > 0.5\nprint('All checks passed.')"
  },
  {
    "day": 49,
    "fallbackTitle": "Fused AdamW Optimizer, Global Gradient Norm Clipping & Cosine Warmup Schedules",
    "eTitle": "Global L2 Gradient Norm Clipper + Cosine-With-Warmup LR Schedule",
    "eDesc": "Write `clip_grads_l2(grads: list[float], max_norm: float) -> tuple[list[float], float]`: clip gradients by `max_norm / (g_norm + 1e-6)` when `g_norm > max_norm` and return `(clipped_rounded_6, round(g_norm, 6))`. Also implement `warmup_cosine_lr(step, warmup, total, max_lr, min_lr) -> float`.",
    "eStarter": "import math\n\ndef clip_grads_l2(grads: list[float], max_norm: float) -> tuple[list[float], float]:\n    # TODO\n    pass\n\ndef warmup_cosine_lr(step: int, warmup: int, total: int, max_lr: float, min_lr: float) -> float:\n    # TODO\n    pass",
    "eHint": "import math\n\ndef clip_grads_l2(grads: list[float], max_norm: float) -> tuple[list[float], float]:\n    gn = math.sqrt(sum(g * g for g in grads))\n    if gn > max_norm:\n        coef = max_norm / (gn + 1e-6)\n        return [round(g * coef, 6) for g in grads], round(gn, 6)\n    return [round(g, 6) for g in grads], round(gn, 6)\n\ndef warmup_cosine_lr(step: int, warmup: int, total: int, max_lr: float, min_lr: float) -> float:\n    if step < warmup:\n        return round(max_lr * (step / max(1, warmup)), 8)\n    if step >= total:\n        return float(min_lr)\n    prog = (step - warmup) / max(1, total - warmup)\n    return round(min_lr + 0.5 * (max_lr - min_lr) * (1.0 + math.cos(math.pi * prog)), 8)",
    "eTest": "cg, gn = clip_grads_l2([3.0, 4.0], 1.0)\nassert gn == 5.0 and abs(cg[0] - 0.6) < 1e-4 and abs(cg[1] - 0.8) < 1e-4\nassert warmup_cosine_lr(5, 10, 100, 1e-3, 1e-4) == 0.0005\nassert warmup_cosine_lr(10, 10, 100, 1e-3, 1e-4) == 0.001\nassert warmup_cosine_lr(100, 10, 100, 1e-3, 1e-4) == 0.0001\nprint('All checks passed.')",
    "aTitle": "Single-Step Decoupled AdamW Optimizer Update Kernel",
    "aDesc": "Write `adamw_step(w: float, g: float, m: float, v: float, step: int, lr: float = 1e-3, wd: float = 0.1, b1: float = 0.9, b2: float = 0.999, eps: float = 1e-8) -> tuple[float, float, float]`: apply decoupled weight decay `w *= (1 - lr * wd)`, update moments `m, v`, and apply bias-corrected step returning `(round(w, 6), round(m, 6), round(v, 6))`.",
    "aStarter": "import math\n\ndef adamw_step(w: float, g: float, m: float, v: float, step: int, lr: float = 1e-3, wd: float = 0.1, b1: float = 0.9, b2: float = 0.999, eps: float = 1e-8) -> tuple[float, float, float]:\n    # TODO\n    pass",
    "aHint": "import math\n\ndef adamw_step(w: float, g: float, m: float, v: float, step: int, lr: float = 1e-3, wd: float = 0.1, b1: float = 0.9, b2: float = 0.999, eps: float = 1e-8) -> tuple[float, float, float]:\n    w = w * (1.0 - lr * wd)\n    m = b1 * m + (1.0 - b1) * g\n    v = b2 * v + (1.0 - b2) * (g * g)\n    mh = m / (1.0 - b1 ** step)\n    vh = v / (1.0 - b2 ** step)\n    w = w - lr * mh / (math.sqrt(vh) + eps)\n    return round(w, 6), round(m, 6), round(v, 6)",
    "aTest": "w1, m1, v1 = adamw_step(1.0, 2.0, 0.0, 0.0, 1, lr=0.01, wd=0.1)\nassert abs(w1 - 0.989) < 1e-4\nassert m1 == 0.2 and v1 == 0.004\nw0, m0, v0 = adamw_step(1.0, 0.0, 0.0, 0.0, 1, lr=0.01, wd=0.1)\nassert w0 == 0.999\nprint('All checks passed.')"
  },
  {
    "day": 50,
    "fallbackTitle": "Milestone 10: Numerics Stability Monitor & Flash Online-Softmax Kernel",
    "eTitle": "Milestone 10A: Training Loss Spike & Grad-Norm Anomaly Detector",
    "eDesc": "Write `detect_numerics_anomaly(grad_norm: float, loss: float, rolling_loss_mean: float) -> str`: return `\"nan_inf\"` if non-finite, `\"loss_spike\"` if `loss > 2.5 * rolling_loss_mean`, `\"grad_explosion\"` if `grad_norm > 10.0`, else `\"healthy\"`.",
    "eStarter": "import math\n\ndef detect_numerics_anomaly(grad_norm: float, loss: float, rolling_loss_mean: float) -> str:\n    # TODO\n    pass",
    "eHint": "import math\n\ndef detect_numerics_anomaly(grad_norm: float, loss: float, rolling_loss_mean: float) -> str:\n    if not (math.isfinite(grad_norm) and math.isfinite(loss)):\n        return \"nan_inf\"\n    if loss > 2.5 * rolling_loss_mean:\n        return \"loss_spike\"\n    if grad_norm > 10.0:\n        return \"grad_explosion\"\n    return \"healthy\"",
    "eTest": "assert detect_numerics_anomaly(float(\"nan\"), 1.5, 1.5) == \"nan_inf\"\nassert detect_numerics_anomaly(1.2, 5.0, 1.8) == \"loss_spike\"\nassert detect_numerics_anomaly(15.0, 2.0, 1.8) == \"grad_explosion\"\nassert detect_numerics_anomaly(1.5, 2.0, 1.8) == \"healthy\"\nprint('All checks passed.')",
    "aTitle": "Milestone 10B: Online Softmax Log-Sum-Exp & Weighted Reduction Kernel",
    "aDesc": "Write `online_softmax_stats(tiles: list[list[float]]) -> tuple[float, list[float]]`: compute streaming global `logsumexp` (rounded 6) and normalized probabilities across tiles (rounded 6).",
    "aStarter": "import math\n\ndef online_softmax_stats(tiles: list[list[float]]) -> tuple[float, list[float]]:\n    # TODO\n    pass",
    "aHint": "import math\n\ndef online_softmax_stats(tiles: list[list[float]]) -> tuple[float, list[float]]:\n    m = float(\"-inf\")\n    l = 0.0\n    for t in tiles:\n        if not t:\n            continue\n        tm = max(t)\n        nm = max(m, tm)\n        l = (0.0 if m == float(\"-inf\") else l * math.exp(m - nm)) + sum(math.exp(x - nm) for x in t)\n        m = nm\n    lse = round(m + math.log(l), 6)\n    probs = [round(math.exp(x - m) / l, 6) for t in tiles for x in t]\n    return lse, probs",
    "aTest": "lse1, p1 = online_softmax_stats([[1.0, 2.0], [3.0]])\nlse2, p2 = online_softmax_stats([[1.0, 2.0, 3.0]])\nassert lse1 == lse2 and p1 == p2\nassert abs(sum(p1) - 1.0) < 1e-4\nassert p1[2] > p1[1] > p1[0]\nprint('All checks passed.')"
  },
  {
    "day": 51,
    "fallbackTitle": "Mixture-of-Experts (MoE): Top-K Gating, Capacity Factor & Token Drop Rates",
    "eTitle": "Sparse Top-K MoE Gating Softmax & Capacity-Dropped Dispatch",
    "eDesc": "Write `moe_topk_dispatch(router_logits: list[list[float]], k: int, expert_cap: int) -> dict`: select Top-K experts per token via softmax (tie-break smaller index), route into FIFO `expert_cap` slots per expert, and return `{\"routed\": int, \"dropped\": int, \"expert_loads\": list[int]}`.",
    "eStarter": "import math\n\ndef moe_topk_dispatch(router_logits: list[list[float]], k: int, expert_cap: int) -> dict:\n    # TODO\n    pass",
    "eHint": "import math\n\ndef moe_topk_dispatch(router_logits: list[list[float]], k: int, expert_cap: int) -> dict:\n    n_exp = len(router_logits[0])\n    loads = [0] * n_exp\n    routed = dropped = 0\n    for logits in router_logits:\n        mx = max(logits)\n        ex = [math.exp(v - mx) for v in logits]\n        s = sum(ex)\n        probs = [v / s for v in ex]\n        top_idxs = sorted(range(n_exp), key=lambda i: (-probs[i], i))[:k]\n        for e in top_idxs:\n            if loads[e] < expert_cap:\n                loads[e] += 1\n                routed += 1\n            else:\n                dropped += 1\n    return {\"routed\": routed, \"dropped\": dropped, \"expert_loads\": loads}",
    "eTest": "lg = [[5.0, 1.0, 0.0], [5.0, 1.0, 0.0], [5.0, 1.0, 0.0], [0.0, 0.0, 5.0]]\nr = moe_topk_dispatch(lg, k=1, expert_cap=2)\nassert r[\"routed\"] == 3 and r[\"dropped\"] == 1\nassert r[\"expert_loads\"] == [2, 0, 1]\nassert moe_topk_dispatch(lg, k=1, expert_cap=5)[\"dropped\"] == 0\nprint('All checks passed.')",
    "aTitle": "MoE Token-Dropless Capacity Factor Planner (`capacity = ceil(CF * B*S * k / E)`)",
    "aDesc": "Write `compute_expert_capacity(tokens: int, top_k: int, num_experts: int, capacity_factor: float) -> int`: return `max(1, math.ceil((tokens * top_k / num_experts) * capacity_factor))`.",
    "aStarter": "import math\n\ndef compute_expert_capacity(tokens: int, top_k: int, num_experts: int, capacity_factor: float) -> int:\n    # TODO\n    pass",
    "aHint": "import math\n\ndef compute_expert_capacity(tokens: int, top_k: int, num_experts: int, capacity_factor: float) -> int:\n    return max(1, math.ceil((tokens * top_k / num_experts) * capacity_factor))",
    "aTest": "assert compute_expert_capacity(1024, 2, 8, 1.25) == 320\nassert compute_expert_capacity(100, 1, 8, 1.0) == 13\nassert compute_expert_capacity(1, 1, 8, 1.0) == 1\nprint('All checks passed.')"
  },
  {
    "day": 52,
    "fallbackTitle": "MoE Load-Balancing Auxiliary Loss & All-to-All Expert Dispatch Routing",
    "eTitle": "Switch/Mixtral Auxiliary Load-Balancing Loss Calculator",
    "eDesc": "Write `moe_aux_load_loss(router_probs: list[list[float]], chosen_expert: list[int], alpha: float = 0.01) -> float`: compute `f_i = count(chosen == i) / T` and `P_i = mean_t(router_probs[t][i])`, returning Switch Loss `alpha * E * sum_i(f_i * P_i)` rounded to 6 decimals.",
    "eStarter": "def moe_aux_load_loss(router_probs: list[list[float]], chosen_expert: list[int], alpha: float = 0.01) -> float:\n    # TODO\n    pass",
    "eHint": "def moe_aux_load_loss(router_probs: list[list[float]], chosen_expert: list[int], alpha: float = 0.01) -> float:\n    t = len(router_probs)\n    e = len(router_probs[0])\n    f = [sum(1 for c in chosen_expert if c == i) / t for i in range(e)]\n    p = [sum(router_probs[r][i] for r in range(t)) / t for i in range(e)]\n    return round(alpha * e * sum(f[i] * p[i] for i in range(e)), 6)",
    "eTest": "uniform = moe_aux_load_loss([[0.5, 0.5], [0.5, 0.5]], [0, 1], alpha=0.01)\ncollapsed = moe_aux_load_loss([[0.9, 0.1], [0.9, 0.1]], [0, 0], alpha=0.01)\nassert uniform == 0.01\nassert collapsed == 0.018\nassert collapsed > uniform\nprint('All checks passed.')",
    "aTitle": "Expert-Parallel All-to-All Token Dispatch & Combine Permutation",
    "aDesc": "Write `all_to_all_dispatch(local_tokens: list[list[tuple[str, int]]]) -> list[list[tuple[str, int, int]]]`: route `(tok_id, target_expert_rank)` from `src_rank` to `target_expert_rank` keeping `(tok_id, src_rank, dst_rank)` sorted by `(src_rank, tok_id)`.",
    "aStarter": "def all_to_all_dispatch(local_tokens: list[list[tuple[str, int]]]) -> list[list[tuple[str, int, int]]]:\n    # TODO\n    pass",
    "aHint": "def all_to_all_dispatch(local_tokens: list[list[tuple[str, int]]]) -> list[list[tuple[str, int, int]]]:\n    n = len(local_tokens)\n    recv = [[] for _ in range(n)]\n    for src, toks in enumerate(local_tokens):\n        for tid, dst in toks:\n            recv[dst].append((tid, src, dst))\n    return [sorted(bucket, key=lambda x: (x[1], x[0])) for bucket in recv]",
    "aTest": "out = all_to_all_dispatch([[(\"t1\", 1), (\"t2\", 0)], [(\"t3\", 0)]])\nassert out[0] == [(\"t2\", 0, 0), (\"t3\", 1, 0)]\nassert out[1] == [(\"t1\", 0, 1)]\nassert all_to_all_dispatch([[], []]) == [[], []]\nprint('All checks passed.')"
  },
  {
    "day": 53,
    "fallbackTitle": "LoRA, QLoRA (NF4 Double Quantization) & DoRA Weight-Decomposed Low-Rank Adaptation",
    "eTitle": "LoRA Forward Merge + DoRA Magnitude-Direction Weight Decomposer",
    "eDesc": "Write `lora_and_dora_merge(w0: list[list[float]], b_mat: list[list[float]], a_mat: list[list[float]], alpha: float, rank: int, dora_m: list[float] | None = None) -> list[list[float]]`: compute `W = W0 + (alpha/rank)*(B @ A)`; if `dora_m` is given, normalize each row `i` by its L2 norm and multiply by `dora_m[i]`. Round to 6 decimals.",
    "eStarter": "import math\n\ndef lora_and_dora_merge(w0: list[list[float]], b_mat: list[list[float]], a_mat: list[list[float]], alpha: float, rank: int, dora_m: list[float] | None = None) -> list[list[float]]:\n    # TODO\n    pass",
    "eHint": "import math\n\ndef lora_and_dora_merge(w0: list[list[float]], b_mat: list[list[float]], a_mat: list[list[float]], alpha: float, rank: int, dora_m: list[float] | None = None) -> list[list[float]]:\n    rows, cols = len(w0), len(w0[0])\n    s = alpha / rank\n    w = []\n    for i in range(rows):\n        row = []\n        for j in range(cols):\n            ba = sum(b_mat[i][k] * a_mat[k][j] for k in range(rank))\n            row.append(w0[i][j] + s * ba)\n        if dora_m is not None:\n            norm = math.sqrt(sum(v * v for v in row)) or 1.0\n            row = [v / norm * dora_m[i] for v in row]\n        w.append([round(v, 6) for v in row])\n    return w",
    "eTest": "w0 = [[3.0, 4.0], [0.0, 1.0]]\nb = [[0.0], [1.0]]\na = [[0.0, 2.0]]\nassert lora_and_dora_merge(w0, b, a, 2.0, 1) == [[3.0, 4.0], [0.0, 5.0]]\ndm = lora_and_dora_merge(w0, b, a, 2.0, 1, dora_m=[10.0, 2.0])\nassert dm == [[6.0, 8.0], [0.0, 2.0]]\nassert lora_and_dora_merge([[1.0]], [[0.0]], [[0.0]], 1.0, 1) == [[1.0]]\nprint('All checks passed.')",
    "aTitle": "QLoRA NF4 Block Quantization + Double-Quantized Bits-Per-Parameter Calculator",
    "aDesc": "Write `qlora_effective_bpp(block_size: int = 64, group2_size: int = 256) -> float`: compute `4.0 + (8.0 / block_size) + (32.0 / (block_size * group2_size))` rounded to 4 decimals.",
    "aStarter": "def qlora_effective_bpp(block_size: int = 64, group2_size: int = 256) -> float:\n    # TODO\n    pass",
    "aHint": "def qlora_effective_bpp(block_size: int = 64, group2_size: int = 256) -> float:\n    bpp = 4.0 + (8.0 / block_size) + (32.0 / (block_size * group2_size))\n    return round(bpp, 4)",
    "aTest": "assert abs(qlora_effective_bpp(64, 256) - 4.127) < 0.001\nassert qlora_effective_bpp(32, 256) > qlora_effective_bpp(64, 256)\nassert qlora_effective_bpp(128, 256) < 4.1\nprint('All checks passed.')"
  },
  {
    "day": 54,
    "fallbackTitle": "Knowledge Distillation: Temperature-Scaled KL Divergence & Logit Matching",
    "eTitle": "Temperature-Scaled Forward KL Distillation Loss (`T^2 * KL(P_T || P_S)`)",
    "eDesc": "Write `distillation_kl_loss(teacher_logits: list[float], student_logits: list[float], temp: float = 2.0) -> float`: compute `P = softmax(teacher / T)`, `Q = softmax(student / T)`, and `(T ** 2) * sum_i P_i * log(P_i / max(Q_i, 1e-12))` rounded to 6 decimals.",
    "eStarter": "import math\n\ndef distillation_kl_loss(teacher_logits: list[float], student_logits: list[float], temp: float = 2.0) -> float:\n    # TODO\n    pass",
    "eHint": "import math\n\ndef distillation_kl_loss(teacher_logits: list[float], student_logits: list[float], temp: float = 2.0) -> float:\n    def sm(ls):\n        sc = [v / temp for v in ls]\n        mx = max(sc)\n        ex = [math.exp(v - mx) for v in sc]\n        s = sum(ex)\n        return [v / s for v in ex]\n    p, q = sm(teacher_logits), sm(student_logits)\n    kl = sum(pi * math.log(max(pi, 1e-12) / max(qi, 1e-12)) for pi, qi in zip(p, q))\n    return round((temp ** 2) * kl, 6)",
    "eTest": "assert distillation_kl_loss([2.0, 1.0, 0.0], [2.0, 1.0, 0.0], 2.0) == 0.0\nd = distillation_kl_loss([4.0, 0.0, 0.0], [1.0, 1.0, 0.0], 2.0)\nassert d > 0.5\nassert distillation_kl_loss([4.0, 1.0], [3.5, 1.0], 2.0) < d\nprint('All checks passed.')",
    "aTitle": "Mixed Hard-CE + Soft-KD Loss & Top-K Teacher Sparse Logit Compression",
    "aDesc": "Write `top_k_teacher_compress(logits: list[float], k: int) -> list[tuple[int, float]]`: softmax-normalize logits, keep Top-K `(vocab_id, prob)` sorted descending, and renormalize kept probs to sum to 1.0 rounded to 6 decimals.",
    "aStarter": "import math\n\ndef top_k_teacher_compress(logits: list[float], k: int) -> list[tuple[int, float]]:\n    # TODO\n    pass",
    "aHint": "import math\n\ndef top_k_teacher_compress(logits: list[float], k: int) -> list[tuple[int, float]]:\n    mx = max(logits)\n    ex = [math.exp(v - mx) for v in logits]\n    s = sum(ex)\n    probs = [v / s for v in ex]\n    top = sorted(range(len(probs)), key=lambda i: (-probs[i], i))[:k]\n    tot = sum(probs[i] for i in top)\n    return [(i, round(probs[i] / tot, 6)) for i in top]",
    "aTest": "res = top_k_teacher_compress([1.0, 5.0, 2.0, 0.0], 2)\nassert [idx for idx, _ in res] == [1, 2]\nassert abs(sum(p for _, p in res) - 1.0) < 1e-4\nassert res[0][1] > 0.9\nprint('All checks passed.')"
  },
  {
    "day": 55,
    "fallbackTitle": "Milestone 11: Sparse MoE Router & Parameter-Efficient Fine-Tuning Suite",
    "eTitle": "Milestone 11A: LoRA vs Full Fine-Tuning Trainable Parameter Ratio Auditor",
    "eDesc": "Write `lora_trainable_summary(in_dim: int, out_dim: int, rank: int, num_adapted_layers: int) -> dict`: return `{\"base_params\", \"lora_params\", \"trainable_pct\"}` (`rounded 4`).",
    "eStarter": "def lora_trainable_summary(in_dim: int, out_dim: int, rank: int, num_adapted_layers: int) -> dict:\n    # TODO\n    pass",
    "eHint": "def lora_trainable_summary(in_dim: int, out_dim: int, rank: int, num_adapted_layers: int) -> dict:\n    base = in_dim * out_dim * num_adapted_layers\n    lora = (in_dim * rank + rank * out_dim) * num_adapted_layers\n    return {\"base_params\": base, \"lora_params\": lora, \"trainable_pct\": round((lora / base) * 100.0, 4)}",
    "eTest": "r = lora_trainable_summary(4096, 4096, 16, 32)\nassert r[\"lora_params\"] == 4194304\nassert abs(r[\"trainable_pct\"] - 0.7812) < 0.001\nassert lora_trainable_summary(1024, 1024, 8, 1)[\"lora_params\"] == 16384\nprint('All checks passed.')",
    "aTitle": "Milestone 11B: Sparse MoE Active-Param vs Total-Param FLOPs Calculator",
    "aDesc": "Write `moe_active_flops_ratio(dense_non_ffn_params: int, ffn_expert_params: int, num_experts: int, top_k: int) -> dict`: compute `total_params`, `active_params`, and `active_pct` (`rounded 2`).",
    "aStarter": "def moe_active_flops_ratio(dense_non_ffn_params: int, ffn_expert_params: int, num_experts: int, top_k: int) -> dict:\n    # TODO\n    pass",
    "aHint": "def moe_active_flops_ratio(dense_non_ffn_params: int, ffn_expert_params: int, num_experts: int, top_k: int) -> dict:\n    tot = dense_non_ffn_params + num_experts * ffn_expert_params\n    act = dense_non_ffn_params + top_k * ffn_expert_params\n    return {\"total_params\": tot, \"active_params\": act, \"active_pct\": round((act / tot) * 100.0, 2)}",
    "aTest": "r = moe_active_flops_ratio(2000, 1000, 8, 2)\nassert r[\"total_params\"] == 10000 and r[\"active_params\"] == 4000\nassert r[\"active_pct\"] == 40.0\nassert moe_active_flops_ratio(0, 100, 8, 2)[\"active_pct\"] == 25.0\nprint('All checks passed.')"
  },
  {
    "day": 56,
    "fallbackTitle": "Asynchronous Distributed Checkpointing, Elastic Node Recovery & Straggler Detection",
    "eTitle": "Goodput Efficiency Analyzer with Mean-Time-Between-Failures & Async Save",
    "eDesc": "Write `cluster_goodput_pct(step_sec: float, ckpt_interval: int, save_sync_sec: float, async_ckpt: bool, mtbf_sec: float, restart_sec: float) -> float`: combine save stall fraction `(0.0 if async_ckpt else save_sync_sec) / (ckpt_interval * step_sec)` and recovery overhead `(restart_sec + 0.5 * ckpt_interval * step_sec) / mtbf_sec`, returning `round(max(0, 100 * (1 - overhead)), 2)`.",
    "eStarter": "def cluster_goodput_pct(step_sec: float, ckpt_interval: int, save_sync_sec: float, async_ckpt: bool, mtbf_sec: float, restart_sec: float) -> float:\n    # TODO\n    pass",
    "eHint": "def cluster_goodput_pct(step_sec: float, ckpt_interval: int, save_sync_sec: float, async_ckpt: bool, mtbf_sec: float, restart_sec: float) -> float:\n    period = ckpt_interval * step_sec\n    save_oh = 0.0 if async_ckpt else (save_sync_sec / period)\n    fail_oh = (restart_sec + 0.5 * period) / mtbf_sec\n    return round(max(0.0, 100.0 * (1.0 - save_oh - fail_oh)), 2)",
    "eTest": "sync_gp = cluster_goodput_pct(1.0, 100, 20.0, False, 10000.0, 100.0)\nasync_gp = cluster_goodput_pct(1.0, 100, 20.0, True, 10000.0, 100.0)\nassert async_gp > sync_gp\nassert abs(async_gp - 98.5) < 0.05\nassert abs(sync_gp - 78.5) < 0.05\nprint('All checks passed.')",
    "aTitle": "Straggler Node Rank Detector via Robust Median/MAD Barrier Wait Outliers",
    "aDesc": "Write `find_stragglers(step_ms_by_rank: list[float], sigma_mult: float = 3.0) -> list[int]`: flag any rank exceeding `med + max(1.0, 1.4826 * sigma_mult * mad)` sorted by rank index.",
    "aStarter": "import statistics\n\ndef find_stragglers(step_ms_by_rank: list[float], sigma_mult: float = 3.0) -> list[int]:\n    # TODO\n    pass",
    "aHint": "import statistics\n\ndef find_stragglers(step_ms_by_rank: list[float], sigma_mult: float = 3.0) -> list[int]:\n    if not step_ms_by_rank:\n        return []\n    med = statistics.median(step_ms_by_rank)\n    mad = statistics.median([abs(x - med) for x in step_ms_by_rank])\n    thresh = med + max(1.0, 1.4826 * sigma_mult * mad)\n    return [i for i, v in enumerate(step_ms_by_rank) if v > thresh]",
    "aTest": "assert find_stragglers([100.0, 101.0, 99.5, 180.0, 100.5]) == [3]\nassert find_stragglers([100.0, 100.5, 100.2, 99.8]) == []\nassert find_stragglers([]) == []\nprint('All checks passed.')"
  },
  {
    "day": 57,
    "fallbackTitle": "Model FLOPs Utilization (MFU) & Hardware FLOPs Utilization (HFU) Benchmarking",
    "eTitle": "Transformer MFU (Model FLOPs Utilization) Benchmark Calculator",
    "eDesc": "Write `compute_mfu(params_b: float, tokens_per_sec_per_gpu: float, gpu_peak_tflops: float, act_ckpt: bool = False) -> dict`: compute useful `6 * P * tok/s` (`8 * ...` for HFU with activation checkpointing), returning `{\"mfu_pct\", \"hfu_pct\"}` rounded to 2 decimals.",
    "eStarter": "def compute_mfu(params_b: float, tokens_per_sec_per_gpu: float, gpu_peak_tflops: float, act_ckpt: bool = False) -> dict:\n    # TODO\n    pass",
    "eHint": "def compute_mfu(params_b: float, tokens_per_sec_per_gpu: float, gpu_peak_tflops: float, act_ckpt: bool = False) -> dict:\n    m_tf = (6.0 * params_b * 1e9 * tokens_per_sec_per_gpu) / 1e12\n    h_tf = ((8.0 if act_ckpt else 6.0) * params_b * 1e9 * tokens_per_sec_per_gpu) / 1e12\n    return {\"mfu_pct\": round((m_tf / gpu_peak_tflops) * 100.0, 2), \"hfu_pct\": round((h_tf / gpu_peak_tflops) * 100.0, 2)}",
    "eTest": "r_no = compute_mfu(70.0, 1000.0, 989.0, False)\nr_ck = compute_mfu(70.0, 1000.0, 989.0, True)\nassert abs(r_no[\"mfu_pct\"] - 42.47) < 0.05\nassert r_no[\"hfu_pct\"] == r_no[\"mfu_pct\"]\nassert r_ck[\"hfu_pct\"] > r_ck[\"mfu_pct\"]\nprint('All checks passed.')",
    "aTitle": "Arithmetic Intensity & Roofline Bound Classifier (Compute vs Memory Bound)",
    "aDesc": "Write `roofline_regime(flops: float, bytes_moved: float, peak_tflops: float, hbm_gb_s: float) -> dict`: compute `ridge = (peak_tflops * 1e12) / (hbm_gb_s * 1e9)` and `ai = flops / bytes_moved`; classify `\"compute_bound\"` if `ai >= ridge` else `\"memory_bound\"`.",
    "aStarter": "def roofline_regime(flops: float, bytes_moved: float, peak_tflops: float, hbm_gb_s: float) -> dict:\n    # TODO\n    pass",
    "aHint": "def roofline_regime(flops: float, bytes_moved: float, peak_tflops: float, hbm_gb_s: float) -> dict:\n    ridge = (peak_tflops * 1e12) / (hbm_gb_s * 1e9)\n    ai = flops / bytes_moved\n    return {\"ai\": round(ai, 2), \"ridge\": round(ridge, 2), \"regime\": \"compute_bound\" if ai >= ridge else \"memory_bound\"}",
    "aTest": "gemm = roofline_regime(1e12, 1e9, 989.0, 3350.0)\nmem = roofline_regime(1e9, 1e9, 989.0, 3350.0)\nassert gemm[\"regime\"] == \"compute_bound\" and mem[\"regime\"] == \"memory_bound\"\nassert abs(gemm[\"ridge\"] - 295.22) < 0.1\nassert mem[\"ai\"] == 1.0\nprint('All checks passed.')"
  },
  {
    "day": 58,
    "fallbackTitle": "Data Mixing Curricula, MinHash Deduplication & Packing Sequences without Padding",
    "eTitle": "Deterministic MinHash Jaccard Near-Duplicate Document Filter",
    "eDesc": "Write `dedup_minhash_docs(docs: list[str], num_hashes: int = 16, thresh: float = 0.7) -> list[int]`: tokenize into word 2-shingles, compute `num_hashes` salted SHA-256 min-hashes, and drop any later doc whose MinHash agreement with any previously kept doc is `>= thresh`.",
    "eStarter": "import hashlib\n\ndef dedup_minhash_docs(docs: list[str], num_hashes: int = 16, thresh: float = 0.7) -> list[int]:\n    # TODO\n    pass",
    "eHint": "import hashlib\n\ndef dedup_minhash_docs(docs: list[str], num_hashes: int = 16, thresh: float = 0.7) -> list[int]:\n    def sig(txt):\n        ws = txt.lower().split()\n        sh = {\" \".join(ws[i:i + 2]) for i in range(max(1, len(ws) - 1))} or {\"\"}\n        out = []\n        for h in range(num_hashes):\n            out.append(min(hashlib.sha256(f\"{h}:{s}\".encode()).hexdigest()[:12] for s in sh))\n        return out\n    kept_idxs, kept_sigs = [], []\n    for idx, d in enumerate(docs):\n        s = sig(d)\n        dup = any(sum(a == b for a, b in zip(s, ks)) / num_hashes >= thresh for ks in kept_sigs)\n        if not dup:\n            kept_idxs.append(idx)\n            kept_sigs.append(s)\n    return kept_idxs",
    "eTest": "docs = [\"the quick brown fox jumps\", \"the quick brown fox jumps\", \"completely different machine learning systems text\"]\nassert dedup_minhash_docs(docs) == [0, 2]\nassert dedup_minhash_docs([\"alpha beta gamma delta epsilon\", \"alpha beta gamma delta zeta\"], 16, 0.5) == [0]\nassert dedup_minhash_docs([]) == []\nprint('All checks passed.')",
    "aTitle": "Zero-Padding Best-Fit Decreasing Sequence Packer + Cross-Doc Mask Boundary Map",
    "aDesc": "Write `pack_sequences_bfd(lengths: list[int], ctx_len: int) -> tuple[list[list[int]], float]`: pack document lengths into `ctx_len` bins via Best-Fit Decreasing, returning `(bins, packing_efficiency_pct)` rounded to 2 decimals.",
    "aStarter": "def pack_sequences_bfd(lengths: list[int], ctx_len: int) -> tuple[list[list[int]], float]:\n    # TODO\n    pass",
    "aHint": "def pack_sequences_bfd(lengths: list[int], ctx_len: int) -> tuple[list[list[int]], float]:\n    bins = []\n    rem = []\n    for l in sorted(lengths, reverse=True):\n        best = -1\n        best_r = ctx_len + 1\n        for i, r in enumerate(rem):\n            if l <= r < best_r:\n                best, best_r = i, r\n        if best >= 0:\n            bins[best].append(l)\n            rem[best] -= l\n        else:\n            bins.append([l])\n            rem.append(ctx_len - l)\n    eff = round((sum(lengths) / (len(bins) * ctx_len)) * 100.0, 2) if bins else 0.0\n    return bins, eff",
    "aTest": "bins, eff = pack_sequences_bfd([6, 4, 5, 5], 10)\nassert len(bins) == 2 and eff == 100.0\nb2, e2 = pack_sequences_bfd([7, 6, 3], 10)\nassert len(b2) == 2 and e2 == 80.0\nassert pack_sequences_bfd([], 10) == ([], 0.0)\nprint('All checks passed.')"
  },
  {
    "day": 59,
    "fallbackTitle": "RLHF PPO vs DPO vs GRPO (Group Relative Policy Optimization) Reward Advantage Math",
    "eTitle": "Direct Preference Optimization (DPO) Loss & Reward Margin Grader",
    "eDesc": "Write `dpo_loss(pi_w_logp: float, pi_l_logp: float, ref_w_logp: float, ref_l_logp: float, beta: float = 0.1) -> dict`: compute `margin = beta * ((pi_w - ref_w) - (pi_l - ref_l))` and DPO loss `-log(sigmoid(margin))`, rounded to 6 decimals.",
    "eStarter": "import math\n\ndef dpo_loss(pi_w_logp: float, pi_l_logp: float, ref_w_logp: float, ref_l_logp: float, beta: float = 0.1) -> dict:\n    # TODO\n    pass",
    "eHint": "import math\n\ndef dpo_loss(pi_w_logp: float, pi_l_logp: float, ref_w_logp: float, ref_l_logp: float, beta: float = 0.1) -> dict:\n    margin = beta * ((pi_w_logp - ref_w_logp) - (pi_l_logp - ref_l_logp))\n    loss = math.log1p(math.exp(-margin)) if margin >= -30 else -margin\n    return {\"margin\": round(margin, 6), \"loss\": round(loss, 6)}",
    "eTest": "neutral = dpo_loss(-1.0, -1.0, -1.0, -1.0, 0.1)\ngood = dpo_loss(-0.5, -3.0, -1.0, -1.0, 0.1)\nassert abs(neutral[\"loss\"] - 0.693147) < 1e-4\nassert good[\"margin\"] == 0.25\nassert good[\"loss\"] < neutral[\"loss\"]\nprint('All checks passed.')",
    "aTitle": "GRPO (Group Relative Policy Optimization) Group-Normalized Advantage & Clipped Surrogate",
    "aDesc": "Write `grpo_advantages_and_clip(rewards: list[float], ratios: list[float], eps: float = 0.2) -> dict`: compute `A_i = (r_i - mean(r)) / (std(r) + 1e-8)` (population std) and clipped surrogate mean, rounded to 4 decimals.",
    "aStarter": "import math\n\ndef grpo_advantages_and_clip(rewards: list[float], ratios: list[float], eps: float = 0.2) -> dict:\n    # TODO\n    pass",
    "aHint": "import math\n\ndef grpo_advantages_and_clip(rewards: list[float], ratios: list[float], eps: float = 0.2) -> dict:\n    mu = sum(rewards) / len(rewards)\n    sd = math.sqrt(sum((r - mu) ** 2 for r in rewards) / len(rewards))\n    adv = [(r - mu) / (sd + 1e-8) for r in rewards]\n    surr = [min(rt * a, max(1.0 - eps, min(1.0 + eps, rt)) * a) for rt, a in zip(ratios, adv)]\n    return {\"advantages\": [round(a, 4) for a in adv], \"mean_surrogate\": round(sum(surr) / len(surr), 4)}",
    "aTest": "r = grpo_advantages_and_clip([1.0, 3.0], [1.0, 1.5], eps=0.2)\nassert r[\"advantages\"] == [-1.0, 1.0]\nassert r[\"mean_surrogate\"] == 0.1\nassert grpo_advantages_and_clip([2.0, 2.0], [1.0, 1.0])[\"mean_surrogate\"] == 0.0\nprint('All checks passed.')"
  },
  {
    "day": 60,
    "fallbackTitle": "Milestone 12 Capstone: End-to-End Frontier Model Training & Alignment Orchestrator",
    "eTitle": "Milestone 12A: End-to-End 70B Cluster Feasibility & Cost/Duration Planner",
    "eDesc": "Write `plan_frontier_run(params_b: float, tokens_t: float, num_gpus: int, peak_tflops: float, mfu: float, gpu_hr_usd: float) -> dict`: compute `hours` and `cost_usd` rounded to 2 decimals from `6 * P * D` FLOPs.",
    "eStarter": "def plan_frontier_run(params_b: float, tokens_t: float, num_gpus: int, peak_tflops: float, mfu: float, gpu_hr_usd: float) -> dict:\n    # TODO\n    pass",
    "eHint": "def plan_frontier_run(params_b: float, tokens_t: float, num_gpus: int, peak_tflops: float, mfu: float, gpu_hr_usd: float) -> dict:\n    flops = 6.0 * (params_b * 1e9) * (tokens_t * 1e12)\n    eff_flops_sec = num_gpus * (peak_tflops * 1e12) * mfu\n    hours = (flops / eff_flops_sec) / 3600.0\n    cost = hours * num_gpus * gpu_hr_usd\n    return {\"hours\": round(hours, 2), \"cost_usd\": round(cost, 2)}",
    "eTest": "r = plan_frontier_run(70.0, 2.0, 1024, 989.0, 0.45, 2.5)\nassert abs(r[\"hours\"] - 512.01) < 0.2\nassert r[\"cost_usd\"] > 1000000.0\nr_fast = plan_frontier_run(70.0, 2.0, 2048, 989.0, 0.45, 2.5)\nassert abs(r_fast[\"hours\"] - r[\"hours\"] / 2) < 0.2\nprint('All checks passed.')",
    "aTitle": "Milestone 12B: Unified Alignment Loss Step Combiner (SFT + DPO + Aux MoE)",
    "aDesc": "Write `combine_alignment_losses(ce_loss: float, dpo_l: float, moe_aux: float, w_ce: float, w_dpo: float, grad_norm: float, max_norm: float) -> dict`: compute weighted loss and `should_step = finite(tot) and finite(grad_norm) and grad_norm <= max_norm * 5`.",
    "aStarter": "import math\n\ndef combine_alignment_losses(ce_loss: float, dpo_l: float, moe_aux: float, w_ce: float, w_dpo: float, grad_norm: float, max_norm: float) -> dict:\n    # TODO\n    pass",
    "aHint": "import math\n\ndef combine_alignment_losses(ce_loss: float, dpo_l: float, moe_aux: float, w_ce: float, w_dpo: float, grad_norm: float, max_norm: float) -> dict:\n    tot = w_ce * ce_loss + w_dpo * dpo_l + moe_aux\n    ok = math.isfinite(tot) and math.isfinite(grad_norm) and grad_norm <= max_norm * 5.0\n    return {\"total_loss\": round(tot, 6) if math.isfinite(tot) else None, \"should_step\": ok}",
    "aTest": "ok = combine_alignment_losses(1.2, 0.5, 0.02, 0.5, 1.0, 2.0, 1.0)\nbad = combine_alignment_losses(float(\"nan\"), 0.5, 0.02, 0.5, 1.0, 2.0, 1.0)\nassert ok == {\"total_loss\": 1.12, \"should_step\": True}\nassert bad == {\"total_loss\": None, \"should_step\": False}\nassert combine_alignment_losses(1.0, 0.5, 0.0, 1.0, 1.0, 10.0, 1.0)[\"should_step\"] is False\nprint('All checks passed.')"
  }
];

const indexByDay = new Map((MONTH2_LESSON_INDEX['train-py'] || []).map((entry) => [entry.day, entry]));

export const TRAIN_PYTHON_MONTH2_CONFIGS: DayConfig[] = RAW_M2_DAY_TASKS.map((t) => {
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

export const TRAIN_PYTHON_MONTH2_QUESTS: CourseQuest[] = TRAIN_PYTHON_MONTH2_CONFIGS.flatMap((cfg) =>
  buildEnrichedDayQuests('train-py', cfg.day!, cfg)
);
