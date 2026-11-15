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
    "fallbackTitle": "Matryoshka Representation Learning (MRL): Multi-Granular Prefix Embeddings & L2 Renormalization",
    "eTitle": "Matryoshka Prefix Slicer & L2-Renormalized Two-Stage Retriever",
    "eDesc": "Write `mrl_slice_and_norm(vec: list[float], dim: int) -> list[float]`: slice `vec[:dim]` and L2-normalize to unit norm (rounded to 6 decimals; zeros if norm is 0).",
    "eStarter": "import math\n\ndef mrl_slice_and_norm(vec: list[float], dim: int) -> list[float]:\n    # TODO\n    pass",
    "eHint": "import math\n\ndef mrl_slice_and_norm(vec: list[float], dim: int) -> list[float]:\n    sub = vec[:dim]\n    n = math.sqrt(sum(x * x for x in sub))\n    if n == 0:\n        return [0.0 for _ in sub]\n    return [round(x / n, 6) for x in sub]",
    "eTest": "assert mrl_slice_and_norm([3.0, 4.0, 12.0, 1.0], 2) == [0.6, 0.8]\nassert mrl_slice_and_norm([0.0, 0.0, 5.0], 2) == [0.0, 0.0]\nassert mrl_slice_and_norm([1.0, 0.0, 0.0], 1) == [1.0]\nprint('All checks passed.')",
    "aTitle": "Coarse-MRL Funnel Shortlister + Full-Dim Rescorer",
    "aDesc": "Write `mrl_funnel_search(q: list[float], docs: dict[str, list[float]], coarse_dim: int, shortlist_n: int, top_k: int) -> list[tuple[str, float]]`: rank all normalized `coarse_dim` prefixes by cosine similarity, take top `shortlist_n` IDs, rescore those candidates using full normalized vectors, and return top `top_k` `(doc_id, round(score, 6))` sorted desc by score then ID.",
    "aStarter": "import math\n\ndef mrl_funnel_search(q: list[float], docs: dict[str, list[float]], coarse_dim: int, shortlist_n: int, top_k: int) -> list[tuple[str, float]]:\n    # TODO\n    pass",
    "aHint": "import math\n\ndef mrl_funnel_search(q: list[float], docs: dict[str, list[float]], coarse_dim: int, shortlist_n: int, top_k: int) -> list[tuple[str, float]]:\n    def cos(a, b):\n        na = math.sqrt(sum(x * x for x in a))\n        nb = math.sqrt(sum(x * x for x in b))\n        return sum(x * y for x, y in zip(a, b)) / (na * nb) if na > 0 and nb > 0 else 0.0\n    coarse = sorted([(did, cos(q[:coarse_dim], v[:coarse_dim])) for did, v in docs.items()], key=lambda x: (-x[1], x[0]))[:shortlist_n]\n    fine = [(did, round(cos(q, docs[did]), 6)) for did, _ in coarse]\n    return sorted(fine, key=lambda x: (-x[1], x[0]))[:top_k]",
    "aTest": "q = [1.0, 0.0, 1.0, 0.0]\ndocs = {\"d1\": [1.0, 0.0, 1.0, 0.0], \"d2\": [1.0, 0.1, 0.0, 1.0], \"d3\": [0.0, 1.0, 0.0, 1.0]}\nres = mrl_funnel_search(q, docs, 2, 2, 2)\nassert res[0] == (\"d1\", 1.0)\nassert len(res) == 2 and res[1][0] == \"d2\"\nassert mrl_funnel_search(q, {}, 2, 2, 2) == []\nprint('All checks passed.')"
  },
  {
    "day": 32,
    "fallbackTitle": "Sparse-Dense Hybrid Scoring: Convex Combination vs Reciprocal Rank Fusion (RRF)",
    "eTitle": "Reciprocal Rank Fusion (RRF) Multi-List Retriever Combiner",
    "eDesc": "Write `reciprocal_rank_fusion(ranked_lists: list[list[str]], k: int = 60, top_k: int = 5) -> list[tuple[str, float]]`: accumulate `1 / (k + rank_1based)` across all ranked ID lists, returning top `top_k` `(doc_id, round(score, 6))` sorted by `(-score, doc_id)`.",
    "eStarter": "def reciprocal_rank_fusion(ranked_lists: list[list[str]], k: int = 60, top_k: int = 5) -> list[tuple[str, float]]:\n    # TODO\n    pass",
    "eHint": "from collections import defaultdict\n\ndef reciprocal_rank_fusion(ranked_lists: list[list[str]], k: int = 60, top_k: int = 5) -> list[tuple[str, float]]:\n    scores = defaultdict(float)\n    for lst in ranked_lists:\n        for r, did in enumerate(lst, start=1):\n            scores[did] += 1.0 / (k + r)\n    out = [(did, round(sc, 6)) for did, sc in scores.items()]\n    return sorted(out, key=lambda x: (-x[1], x[0]))[:top_k]",
    "eTest": "res = reciprocal_rank_fusion([[\"d1\", \"d2\"], [\"d2\", \"d3\"]], k=60, top_k=3)\nassert res[0][0] == \"d2\"\nassert abs(res[0][1] - (1/62 + 1/61)) < 1e-5\nassert len(res) == 3 and reciprocal_rank_fusion([], 60, 3) == []\nprint('All checks passed.')",
    "aTitle": "Min-Max Normalized Convex Hybrid Score Blender (`alpha * dense + (1-alpha) * sparse`)",
    "aDesc": "Write `convex_hybrid_blend(dense: dict[str, float], sparse: dict[str, float], alpha: float) -> list[tuple[str, float]]`: independently min-max normalize dense scores (`(v - mn)/(mx - mn)` if `mx > mn` else `1.0 if present else 0.0`) and sparse scores, blend over union of doc IDs, return `[(id, round(score, 6))]` sorted desc by score then ID.",
    "aStarter": "def convex_hybrid_blend(dense: dict[str, float], sparse: dict[str, float], alpha: float) -> list[tuple[str, float]]:\n    # TODO\n    pass",
    "aHint": "def convex_hybrid_blend(dense: dict[str, float], sparse: dict[str, float], alpha: float) -> list[tuple[str, float]]:\n    def norm(d):\n        if not d:\n            return {}\n        mn, mx = min(d.values()), max(d.values())\n        if mx == mn:\n            return {k: 1.0 for k in d}\n        return {k: (v - mn) / (mx - mn) for k, v in d.items()}\n    dn, sn = norm(dense), norm(sparse)\n    ids = set(dense) | set(sparse)\n    out = [(did, round(alpha * dn.get(did, 0.0) + (1.0 - alpha) * sn.get(did, 0.0), 6)) for did in ids]\n    return sorted(out, key=lambda x: (-x[1], x[0]))",
    "aTest": "res = convex_hybrid_blend({\"a\": 0.9, \"b\": 0.5}, {\"a\": 2.0, \"b\": 10.0, \"c\": 6.0}, 0.5)\nassert res[0] == (\"a\", 0.5) and res[1] == (\"b\", 0.5)\nassert res[2] == (\"c\", 0.25)\nassert convex_hybrid_blend({}, {}, 0.5) == []\nprint('All checks passed.')"
  },
  {
    "day": 33,
    "fallbackTitle": "SPLADE & Learned Sparse Representations: Term Expansion & Inverted Index Posting Lists",
    "eTitle": "Sparse Learned Weight Dot-Product & WAND Posting-List Matcher",
    "eDesc": "Implement `SparseInvertedIndex`: `add(doc_id: str, weights: dict[str, float])` inserts positive weights into per-term posting lists, and `search(query: dict[str, float], top_k: int) -> list[tuple[str, float]]` accumulates exact sparse dot products sorted desc by `(score, -doc_id)` -> tie-break ascending `doc_id`.",
    "eStarter": "class SparseInvertedIndex:\n    def __init__(self):\n        # TODO\n        pass\n\n    def add(self, doc_id: str, weights: dict[str, float]):\n        # TODO\n        pass\n\n    def search(self, query: dict[str, float], top_k: int) -> list[tuple[str, float]]:\n        # TODO\n        pass",
    "eHint": "from collections import defaultdict\n\nclass SparseInvertedIndex:\n    def __init__(self):\n        self.postings = defaultdict(list)\n\n    def add(self, doc_id: str, weights: dict[str, float]):\n        for term, w in weights.items():\n            if w > 0:\n                self.postings[term].append((doc_id, w))\n\n    def search(self, query: dict[str, float], top_k: int) -> list[tuple[str, float]]:\n        scores = defaultdict(float)\n        for term, qw in query.items():\n            if qw <= 0:\n                continue\n            for did, dw in self.postings.get(term, []):\n                scores[did] += qw * dw\n        out = [(did, round(s, 6)) for did, s in scores.items()]\n        return sorted(out, key=lambda x: (-x[1], x[0]))[:top_k]",
    "eTest": "idx = SparseInvertedIndex()\nidx.add(\"d1\", {\"vec\": 2.0, \"hnsw\": 1.5})\nidx.add(\"d2\", {\"vec\": 1.0, \"bm25\": 3.0})\nassert idx.search({\"vec\": 1.0, \"hnsw\": 2.0}, 2) == [(\"d1\", 5.0), (\"d2\", 1.0)]\nassert idx.search({\"none\": 1.0}, 2) == []\nassert idx.search({\"bm25\": 2.0}, 1) == [(\"d2\", 6.0)]\nprint('All checks passed.')",
    "aTitle": "SPLADE Log-Saturated ReLU Sparse Pooling Activation & Top-M Pruner",
    "aDesc": "Write `splade_log1p_relu(token_logits: list[list[float]], prune_below: float = 0.01) -> dict[int, float]`: for each vocab dimension `v` across tokens, compute `w_v = max_t log(1 + max(0, logits[t][v]))`; keep `{v: round(w_v, 6)}` strictly above `prune_below`.",
    "aStarter": "import math\n\ndef splade_log1p_relu(token_logits: list[list[float]], prune_below: float = 0.01) -> dict[int, float]:\n    # TODO\n    pass",
    "aHint": "import math\n\ndef splade_log1p_relu(token_logits: list[list[float]], prune_below: float = 0.01) -> dict[int, float]:\n    if not token_logits:\n        return {}\n    vocab = len(token_logits[0])\n    out = {}\n    for v in range(vocab):\n        mx = max(math.log1p(max(0.0, row[v])) for row in token_logits)\n        if mx > prune_below:\n            out[v] = round(mx, 6)\n    return out",
    "aTest": "r = splade_log1p_relu([[-1.0, 2.0, 0.0], [1.0, 0.5, -3.0]], 0.01)\nassert r[0] == round(math.log1p(1.0), 6) if \"math\" in dir() else abs(r[0] - 0.693147) < 1e-4\nassert 1 in r and 2 not in r\nassert splade_log1p_relu([], 0.01) == {}\nprint('All checks passed.')"
  },
  {
    "day": 34,
    "fallbackTitle": "ColBERT Late Interaction: MaxSim Token-Level Multi-Vector Scoring",
    "eTitle": "ColBERT Token-Level MaxSim Multi-Vector Scorer",
    "eDesc": "Write `colbert_maxsim(q_toks: list[list[float]], d_toks: list[list[float]]) -> float`: for each normalized query token `q_i`, compute maximum cosine similarity across all document tokens `d_j`, and return the sum across query tokens rounded to 6 decimals.",
    "eStarter": "import math\n\ndef colbert_maxsim(q_toks: list[list[float]], d_toks: list[list[float]]) -> float:\n    # TODO\n    pass",
    "eHint": "import math\n\ndef colbert_maxsim(q_toks: list[list[float]], d_toks: list[list[float]]) -> float:\n    if not q_toks or not d_toks:\n        return 0.0\n    def cos(a, b):\n        na, nb = math.sqrt(sum(x * x for x in a)), math.sqrt(sum(x * x for x in b))\n        return sum(x * y for x, y in zip(a, b)) / (na * nb) if na > 0 and nb > 0 else 0.0\n    tot = sum(max(cos(q, d) for d in d_toks) for q in q_toks)\n    return round(tot, 6)",
    "eTest": "assert colbert_maxsim([[1.0, 0.0], [0.0, 1.0]], [[1.0, 0.0], [0.0, 1.0]]) == 2.0\nassert colbert_maxsim([[1.0, 0.0], [1.0, 0.0]], [[1.0, 0.0], [0.0, 1.0]]) == 2.0\nassert colbert_maxsim([], [[1.0, 0.0]]) == 0.0\nprint('All checks passed.')",
    "aTitle": "PLAID Centroid-Pruned Multi-Vector Candidate Generator",
    "aDesc": "Write `plaid_candidate_docs(q_toks: list[list[float]], centroids: list[list[float]], centroid_to_docs: list[set[str]], nprobe: int) -> list[str]`: for each query token, find its top `nprobe` closest centroids (cosine similarity), union all mapped document IDs, and return sorted doc ID list.",
    "aStarter": "import math\n\ndef plaid_candidate_docs(q_toks: list[list[float]], centroids: list[list[float]], centroid_to_docs: list[set[str]], nprobe: int) -> list[str]:\n    # TODO\n    pass",
    "aHint": "import math\n\ndef plaid_candidate_docs(q_toks: list[list[float]], centroids: list[list[float]], centroid_to_docs: list[set[str]], nprobe: int) -> list[str]:\n    def cos(a, b):\n        na, nb = math.sqrt(sum(x * x for x in a)), math.sqrt(sum(x * x for x in b))\n        return sum(x * y for x, y in zip(a, b)) / (na * nb) if na > 0 and nb > 0 else 0.0\n    cands = set()\n    for q in q_toks:\n        top_c = sorted(range(len(centroids)), key=lambda i: -cos(q, centroids[i]))[:nprobe]\n        for cid in top_c:\n            cands.update(centroid_to_docs[cid])\n    return sorted(cands)",
    "aTest": "cs = [[1.0, 0.0], [0.0, 1.0], [-1.0, 0.0]]\ncmap = [{\"d1\"}, {\"d2\"}, {\"d3\"}]\nassert plaid_candidate_docs([[0.9, 0.1]], cs, cmap, 1) == [\"d1\"]\nassert plaid_candidate_docs([[0.9, 0.1], [-0.9, 0.0]], cs, cmap, 1) == [\"d1\", \"d3\"]\nassert plaid_candidate_docs([[0.5, 0.5]], cs, cmap, 2) == [\"d1\", \"d2\"]\nprint('All checks passed.')"
  },
  {
    "day": 35,
    "fallbackTitle": "Milestone 7: Multi-Vector Late Interaction & Matryoshka Hybrid Search Engine",
    "eTitle": "Milestone 7A: MRL + RRF Two-Stage Hybrid Retrieval Engine",
    "eDesc": "Write `mrl_hybrid_rrf(q_dense: list[float], dense_docs: dict[str, list[float]], sparse_ranked: list[str], coarse_dim: int, k: int = 60, top_k: int = 3) -> list[tuple[str, float]]`: rank `dense_docs` by Matryoshka `coarse_dim` cosine similarity, combine that ranked ID list with `sparse_ranked` via RRF (`1/(k+rank)`), and return top `top_k` `(doc_id, round(score, 6))`.",
    "eStarter": "import math\n\ndef mrl_hybrid_rrf(q_dense: list[float], dense_docs: dict[str, list[float]], sparse_ranked: list[str], coarse_dim: int, k: int = 60, top_k: int = 3) -> list[tuple[str, float]]:\n    # TODO\n    pass",
    "eHint": "import math\nfrom collections import defaultdict\n\ndef mrl_hybrid_rrf(q_dense: list[float], dense_docs: dict[str, list[float]], sparse_ranked: list[str], coarse_dim: int, k: int = 60, top_k: int = 3) -> list[tuple[str, float]]:\n    def cos(a, b):\n        na, nb = math.sqrt(sum(x * x for x in a)), math.sqrt(sum(x * x for x in b))\n        return sum(x * y for x, y in zip(a, b)) / (na * nb) if na > 0 and nb > 0 else 0.0\n    d_rank = [did for did, _ in sorted([(d, cos(q_dense[:coarse_dim], v[:coarse_dim])) for d, v in dense_docs.items()], key=lambda x: (-x[1], x[0]))]\n    sc = defaultdict(float)\n    for lst in (d_rank, sparse_ranked):\n        for r, did in enumerate(lst, start=1):\n            sc[did] += 1.0 / (k + r)\n    return sorted([(d, round(v, 6)) for d, v in sc.items()], key=lambda x: (-x[1], x[0]))[:top_k]",
    "eTest": "res = mrl_hybrid_rrf([1.0, 0.0, 1.0], {\"a\": [1.0, 0.0, 0.0], \"b\": [0.0, 1.0, 1.0]}, [\"b\", \"a\"], 2, 60, 2)\nassert res[0][0] == \"a\" and res[1][0] == \"b\"\nassert abs(res[0][1] - res[1][1]) < 1e-6\nassert mrl_hybrid_rrf([1.0], {}, [], 1, 60, 2) == []\nprint('All checks passed.')",
    "aTitle": "Milestone 7B: End-to-End Late-Interaction Reranker Over Candidate Pool",
    "aDesc": "Write `rerank_colbert_pool(q_toks: list[list[float]], candidate_ids: list[str], doc_toks: dict[str, list[list[float]]], top_k: int) -> list[tuple[str, float]]`: compute MaxSim score for each candidate ID and return top `top_k` `(id, round(score, 6))` sorted desc by score then ID.",
    "aStarter": "import math\n\ndef rerank_colbert_pool(q_toks: list[list[float]], candidate_ids: list[str], doc_toks: dict[str, list[list[float]]], top_k: int) -> list[tuple[str, float]]:\n    # TODO\n    pass",
    "aHint": "import math\n\ndef rerank_colbert_pool(q_toks: list[list[float]], candidate_ids: list[str], doc_toks: dict[str, list[list[float]]], top_k: int) -> list[tuple[str, float]]:\n    def cos(a, b):\n        na, nb = math.sqrt(sum(x * x for x in a)), math.sqrt(sum(x * x for x in b))\n        return sum(x * y for x, y in zip(a, b)) / (na * nb) if na > 0 and nb > 0 else 0.0\n    out = []\n    for cid in candidate_ids:\n        dt = doc_toks.get(cid, [])\n        sc = sum(max(cos(q, d) for d in dt) for q in q_toks) if dt and q_toks else 0.0\n        out.append((cid, round(sc, 6)))\n    return sorted(out, key=lambda x: (-x[1], x[0]))[:top_k]",
    "aTest": "dt = {\"d1\": [[1.0, 0.0], [0.0, 1.0]], \"d2\": [[1.0, 0.0], [1.0, 0.0]]}\nres = rerank_colbert_pool([[1.0, 0.0], [0.0, 1.0]], [\"d2\", \"d1\"], dt, 2)\nassert res[0] == (\"d1\", 2.0)\nassert res[1] == (\"d2\", 1.0)\nassert rerank_colbert_pool([[1.0, 0.0]], [], dt, 2) == []\nprint('All checks passed.')"
  },
  {
    "day": 36,
    "fallbackTitle": "IVF (Inverted File Index) Coarse Centroid Training & Multi-Probe nprobe Tradeoffs",
    "eTitle": "K-Means Coarse Quantizer Trainer (`train_ivf_centroids`)",
    "eDesc": "Write `train_ivf_centroids(vecs: list[list[float]], init_centroids: list[list[float]], iters: int) -> list[list[float]]`: run exact Euclidean Lloyds K-Means for `iters` iterations (keep old centroid if bucket is empty), returning centroids rounded to 6 decimals.",
    "eStarter": "def train_ivf_centroids(vecs: list[list[float]], init_centroids: list[list[float]], iters: int) -> list[list[float]]:\n    # TODO\n    pass",
    "eHint": "def train_ivf_centroids(vecs: list[list[float]], init_centroids: list[list[float]], iters: int) -> list[list[float]]:\n    cs = [list(c) for c in init_centroids]\n    d = len(vecs[0])\n    for _ in range(iters):\n        buckets = [[] for _ in range(len(cs))]\n        for v in vecs:\n            best = min(range(len(cs)), key=lambda ci: sum((v[j] - cs[ci][j]) ** 2 for j in range(d)))\n            buckets[best].append(v)\n        for ci, b in enumerate(buckets):\n            if b:\n                cs[ci] = [round(sum(x[j] for x in b) / len(b), 6) for j in range(d)]\n    return cs",
    "eTest": "pts = [[0.0, 0.0], [0.0, 2.0], [10.0, 0.0], [10.0, 2.0]]\nres = train_ivf_centroids(pts, [[1.0, 1.0], [9.0, 1.0]], 5)\nassert res == [[0.0, 1.0], [10.0, 1.0]]\nassert len(res) == 2\nassert train_ivf_centroids([[2.0, 2.0]], [[0.0, 0.0]], 2) == [[2.0, 2.0]]\nprint('All checks passed.')",
    "aTitle": "IVF Index Partitioner & Multi-Probe Exact Euclidean L2 Searcher",
    "aDesc": "Implement `IVFIndex(centroids: list[list[float]])`: `add(doc_id: str, vec: list[float])` assigns to nearest Euclidean centroid, and `search(query: list[float], nprobe: int, top_k: int) -> list[tuple[str, float]]` visits `nprobe` nearest centroids and returns top `top_k` `(doc_id, round(l2_sq, 6))` ascending by `(dist_sq, doc_id)`.",
    "aStarter": "class IVFIndex:\n    def __init__(self, centroids: list[list[float]]):\n        # TODO\n        pass\n\n    def add(self, doc_id: str, vec: list[float]):\n        # TODO\n        pass\n\n    def search(self, query: list[float], nprobe: int, top_k: int) -> list[tuple[str, float]]:\n        # TODO\n        pass",
    "aHint": "class IVFIndex:\n    def __init__(self, centroids: list[list[float]]):\n        self.cs = centroids\n        self.lists = [[] for _ in range(len(centroids))]\n\n    def _l2(self, a, b):\n        return sum((x - y) ** 2 for x, y in zip(a, b))\n\n    def add(self, doc_id: str, vec: list[float]):\n        ci = min(range(len(self.cs)), key=lambda i: self._l2(vec, self.cs[i]))\n        self.lists[ci].append((doc_id, vec))\n\n    def search(self, query: list[float], nprobe: int, top_k: int) -> list[tuple[str, float]]:\n        probes = sorted(range(len(self.cs)), key=lambda i: self._l2(query, self.cs[i]))[:nprobe]\n        cands = [(did, round(self._l2(query, v), 6)) for ci in probes for did, v in self.lists[ci]]\n        return sorted(cands, key=lambda x: (x[1], x[0]))[:top_k]",
    "aTest": "idx = IVFIndex([[0.0, 0.0], [10.0, 0.0]])\nidx.add(\"a\", [0.1, 0.0])\nidx.add(\"b\", [5.2, 0.0])\nassert idx.search([4.9, 0.0], nprobe=1, top_k=2)[0][0] == \"a\"\nassert idx.search([4.9, 0.0], nprobe=2, top_k=2)[0][0] == \"b\"\nassert len(idx.search([0.0, 0.0], nprobe=2, top_k=2)) == 2\nprint('All checks passed.')"
  },
  {
    "day": 37,
    "fallbackTitle": "Product Quantization (PQ): Subvector Codebooks & Asymmetric Distance Computation (ADC)",
    "eTitle": "Product Quantization (PQ) Encoder (`M` Subspace Codebook Mapper)",
    "eDesc": "Write `pq_encode(vec: list[float], codebooks: list[list[list[float]]]) -> list[int]`: split `vec` into `M = len(codebooks)` equal subvectors of dimension `d_sub = len(vec) // M`, returning nearest Euclidean centroid index per subspace `m`.",
    "eStarter": "def pq_encode(vec: list[float], codebooks: list[list[list[float]]]) -> list[int]:\n    # TODO\n    pass",
    "eHint": "def pq_encode(vec: list[float], codebooks: list[list[list[float]]]) -> list[int]:\n    m = len(codebooks)\n    sub = len(vec) // m\n    codes = []\n    for i in range(m):\n        sv = vec[i * sub:(i + 1) * sub]\n        c_idx = min(range(len(codebooks[i])), key=lambda k: sum((sv[j] - codebooks[i][k][j]) ** 2 for j in range(sub)))\n        codes.append(c_idx)\n    return codes",
    "eTest": "cbs = [[[0.0, 0.0], [5.0, 5.0]], [[1.0, 1.0], [10.0, 10.0]]]\nassert pq_encode([0.1, -0.1, 9.5, 10.2], cbs) == [0, 1]\nassert pq_encode([4.9, 5.1, 0.9, 1.1], cbs) == [1, 0]\nassert pq_encode([0.0, 0.0, 0.0, 0.0], cbs) == [0, 0]\nprint('All checks passed.')",
    "aTitle": "Asymmetric Distance Computation (ADC) Lookup-Table Scorer",
    "aDesc": "Write `pq_adc_distances(query: list[float], codebooks: list[list[list[float]]], db_codes: list[list[int]]) -> list[float]`: precompute query-to-centroid squared L2 distance LUT `table[m][k]`, then score every quantized database vector by `sum_m table[m][code[m]]` rounded to 6 decimals.",
    "aStarter": "def pq_adc_distances(query: list[float], codebooks: list[list[list[float]]], db_codes: list[list[int]]) -> list[float]:\n    # TODO\n    pass",
    "aHint": "def pq_adc_distances(query: list[float], codebooks: list[list[list[float]]], db_codes: list[list[int]]) -> list[float]:\n    m = len(codebooks)\n    sub = len(query) // m\n    lut = []\n    for i in range(m):\n        q_sub = query[i * sub:(i + 1) * sub]\n        lut.append([sum((q_sub[j] - c[j]) ** 2 for j in range(sub)) for c in codebooks[i]])\n    return [round(sum(lut[i][code[i]] for i in range(m)), 6) for code in db_codes]",
    "aTest": "cbs = [[[0.0], [2.0]], [[0.0], [3.0]]]\nassert pq_adc_distances([0.0, 3.0], cbs, [[0, 1], [1, 0]]) == [0.0, 13.0]\nassert pq_adc_distances([1.0, 0.0], cbs, [[0, 0], [1, 0]]) == [1.0, 1.0]\nassert pq_adc_distances([0.0, 0.0], cbs, []) == []\nprint('All checks passed.')"
  },
  {
    "day": 38,
    "fallbackTitle": "IVF-PQ Composite Indexes & Residual Vector Quantization Error Reduction",
    "eTitle": "Residual Vector Quantizer Encoder (`x - coarse_centroid`)",
    "eDesc": "Write `ivf_pq_residual_encode(vec: list[float], coarse_centroids: list[list[float]], pq_codebooks: list[list[list[float]]]) -> tuple[int, list[int]]`: find nearest `coarse_id` (Euclidean), compute residual `r = vec - coarse_centroids[coarse_id]`, and encode `r` with `pq_codebooks` across `M` subvectors.",
    "eStarter": "def ivf_pq_residual_encode(vec: list[float], coarse_centroids: list[list[float]], pq_codebooks: list[list[list[float]]]) -> tuple[int, list[int]]:\n    # TODO\n    pass",
    "eHint": "def ivf_pq_residual_encode(vec: list[float], coarse_centroids: list[list[float]], pq_codebooks: list[list[list[float]]]) -> tuple[int, list[int]]:\n    cid = min(range(len(coarse_centroids)), key=lambda i: sum((a - b) ** 2 for a, b in zip(vec, coarse_centroids[i])))\n    res = [vec[j] - coarse_centroids[cid][j] for j in range(len(vec))]\n    m = len(pq_codebooks)\n    sub = len(vec) // m\n    codes = []\n    for i in range(m):\n        sv = res[i * sub:(i + 1) * sub]\n        codes.append(min(range(len(pq_codebooks[i])), key=lambda k: sum((sv[j] - pq_codebooks[i][k][j]) ** 2 for j in range(sub))))\n    return cid, codes",
    "eTest": "cc = [[0.0, 0.0], [10.0, 10.0]]\npq = [[[-0.5], [0.5]], [[-0.5], [0.5]]]\nassert ivf_pq_residual_encode([10.4, 9.6], cc, pq) == (1, [1, 0])\nassert ivf_pq_residual_encode([-0.4, 0.4], cc, pq) == (0, [0, 1])\nassert ivf_pq_residual_encode([0.5, 0.5], cc, pq) == (0, [1, 1])\nprint('All checks passed.')",
    "aTitle": "PQ Memory Budget & Compression Ratio Analyzer",
    "aDesc": "Write `ivfpq_ram_gb(num_vecs: int, dim: int, m_subvecs: int, nlist: int) -> dict`: compare `raw_fp32_gb = (num_vecs * dim * 4) / 1024**3` vs `ivfpq_gb = (num_vecs * (m_subvecs + 8) + nlist * dim * 4) / 1024**3` (1 byte per PQ code + 8 byte doc ID + coarse centroids), returning `{\"raw_gb\", \"ivfpq_gb\", \"compression_x\"}` rounded to 2 decimals.",
    "aStarter": "def ivfpq_ram_gb(num_vecs: int, dim: int, m_subvecs: int, nlist: int) -> dict:\n    # TODO\n    pass",
    "aHint": "def ivfpq_ram_gb(num_vecs: int, dim: int, m_subvecs: int, nlist: int) -> dict:\n    gb = 1024 ** 3\n    raw = (num_vecs * dim * 4.0) / gb\n    comp = (num_vecs * (m_subvecs + 8.0) + nlist * dim * 4.0) / gb\n    return {\"raw_gb\": round(raw, 2), \"ivfpq_gb\": round(comp, 2), \"compression_x\": round(raw / comp, 2)}",
    "aTest": "r = ivfpq_ram_gb(10000000, 1536, 96, 4096)\nassert abs(r[\"raw_gb\"] - 57.22) < 0.05\nassert r[\"ivfpq_gb\"] < 1.2\nassert r[\"compression_x\"] > 50.0\nprint('All checks passed.')"
  },
  {
    "day": 39,
    "fallbackTitle": "Scalar Quantization (SQ8/SQ4) & RaBitQ Binary Quantization with Asymmetric Oversampling",
    "eTitle": "Asymmetric Int8 Scalar Quantizer (`SQ8`) & Dot-Product Estimator",
    "eDesc": "Write `sq8_quantize_vec(vec: list[float], vmin: float, vmax: float) -> list[int]`: linearly map each coordinate into `[0..255]` (`round(255 * clip((x - vmin)/(vmax - vmin), 0, 1))`), and `sq8_dequantize(q: list[int], vmin: float, vmax: float) -> list[float]` rounded to 6 decimals.",
    "eStarter": "def sq8_quantize_vec(vec: list[float], vmin: float, vmax: float) -> list[int]:\n    # TODO\n    pass\n\ndef sq8_dequantize(q: list[int], vmin: float, vmax: float) -> list[float]:\n    # TODO\n    pass",
    "eHint": "def sq8_quantize_vec(vec: list[float], vmin: float, vmax: float) -> list[int]:\n    span = (vmax - vmin) or 1.0\n    return [int(round(255 * max(0.0, min(1.0, (x - vmin) / span)))) for x in vec]\n\ndef sq8_dequantize(q: list[int], vmin: float, vmax: float) -> list[float]:\n    span = vmax - vmin\n    return [round(vmin + (v / 255.0) * span, 6) for v in q]",
    "eTest": "q = sq8_quantize_vec([-1.0, 0.0, 1.0], -1.0, 1.0)\nassert q == [0, 128, 255]\ndq = sq8_dequantize(q, -1.0, 1.0)\nassert dq[0] == -1.0 and dq[2] == 1.0 and abs(dq[1]) < 0.01\nassert sq8_quantize_vec([-5.0, 5.0], -1.0, 1.0) == [0, 255]\nprint('All checks passed.')",
    "aTitle": "Binary Quantization (BQ) + Asymmetric Oversampling Rerank Funnel",
    "aDesc": "Write `binary_oversample_search(q: list[float], db_vecs: dict[str, list[float]], oversample_k: int, top_k: int) -> list[tuple[str, float]]`: binarize `q` and every doc vector into sign bits `(1 if x >= 0 else 0)`, shortlist top `oversample_k` candidates by smallest Hamming distance (tie-break ID), then rescore shortlisted candidates with exact dot product returning top `top_k` `(id, round(dot, 6))`.",
    "aStarter": "def binary_oversample_search(q: list[float], db_vecs: dict[str, list[float]], oversample_k: int, top_k: int) -> list[tuple[str, float]]:\n    # TODO\n    pass",
    "aHint": "def binary_oversample_search(q: list[float], db_vecs: dict[str, list[float]], oversample_k: int, top_k: int) -> list[tuple[str, float]]:\n    qb = [1 if x >= 0 else 0 for x in q]\n    hams = []\n    for did, v in db_vecs.items():\n        vb = [1 if x >= 0 else 0 for x in v]\n        hams.append((sum(a != b for a, b in zip(qb, vb)), did))\n    hams.sort()\n    short = [did for _, did in hams[:oversample_k]]\n    rescored = [(did, round(sum(a * b for a, b in zip(q, db_vecs[did])), 6)) for did in short]\n    return sorted(rescored, key=lambda x: (-x[1], x[0]))[:top_k]",
    "aTest": "db = {\"a\": [0.1, 0.1, 0.1, 0.1], \"b\": [10.0, 10.0, -0.01, 10.0], \"c\": [-1.0, -1.0, -1.0, -1.0]}\nres1 = binary_oversample_search([1.0, 1.0, 1.0, 1.0], db, 1, 1)\nres2 = binary_oversample_search([1.0, 1.0, 1.0, 1.0], db, 2, 1)\nassert res1[0][0] == \"a\"\nassert res2[0][0] == \"b\" and res2[0][1] == 29.99\nassert binary_oversample_search([1.0], {}, 2, 1) == []\nprint('All checks passed.')"
  },
  {
    "day": 40,
    "fallbackTitle": "Milestone 8: Compressed IVF-PQ & Binary Quantized Vector Index Kernel",
    "eTitle": "Milestone 8A: End-to-End Compact Binary Inverted Index with Rescoring",
    "eDesc": "Implement `BinaryIVFIndex`: partition docs across coarse centroids via nearest L2; store exact vector + packed integer sign-bitmask `(sum(bit << i))`; `search(q, nprobe, rerank_k, top_k)` probes `nprobe` centroids, filters top `rerank_k` via `bit_count` Hamming distance on integer XOR masks, and returns top `top_k` `(doc_id, round(dot, 6))`.",
    "eStarter": "class BinaryIVFIndex:\n    def __init__(self, centroids: list[list[float]]):\n        # TODO\n        pass\n\n    def add(self, doc_id: str, vec: list[float]):\n        # TODO\n        pass\n\n    def search(self, query: list[float], nprobe: int, rerank_k: int, top_k: int) -> list[tuple[str, float]]:\n        # TODO\n        pass",
    "eHint": "class BinaryIVFIndex:\n    def __init__(self, centroids: list[list[float]]):\n        self.cs = centroids\n        self.lists = [[] for _ in range(len(centroids))]\n\n    def _mask(self, v):\n        m = 0\n        for i, x in enumerate(v):\n            if x >= 0:\n                m |= (1 << i)\n        return m\n\n    def add(self, doc_id: str, vec: list[float]):\n        ci = min(range(len(self.cs)), key=lambda i: sum((a - b) ** 2 for a, b in zip(vec, self.cs[i])))\n        self.lists[ci].append((doc_id, self._mask(vec), vec))\n\n    def search(self, query: list[float], nprobe: int, rerank_k: int, top_k: int) -> list[tuple[str, float]]:\n        qm = self._mask(query)\n        probes = sorted(range(len(self.cs)), key=lambda i: sum((a - b) ** 2 for a, b in zip(query, self.cs[i])))[:nprobe]\n        hams = []\n        for ci in probes:\n            for did, m, vec in self.lists[ci]:\n                hams.append(((qm ^ m).bit_count(), did, vec))\n        hams.sort(key=lambda x: (x[0], x[1]))\n        top = [(did, round(sum(a * b for a, b in zip(query, vec)), 6)) for _, did, vec in hams[:rerank_k]]\n        return sorted(top, key=lambda x: (-x[1], x[0]))[:top_k]",
    "eTest": "ix = BinaryIVFIndex([[0.0, 0.0, 0.0], [5.0, 5.0, 5.0]])\nix.add(\"d1\", [1.0, 1.0, 1.0])\nix.add(\"d2\", [6.0, 6.0, -0.1])\nres = ix.search([5.0, 5.0, 5.0], nprobe=2, rerank_k=2, top_k=1)\nassert res == [(\"d2\", 59.5)]\nassert ix.search([0.5, 0.5, 0.5], 1, 2, 1) == [(\"d1\", 1.5)]\nassert ix.search([0.0, 0.0, 0.0], 1, 0, 1) == []\nprint('All checks passed.')",
    "aTitle": "Milestone 8B: IVF-PQ + RaBitQ Quantization Recall@K Benchmark Harness",
    "aDesc": "Write `recall_at_k(exact_ranked: list[list[str]], approx_ranked: list[list[str]], k: int) -> float`: for each query pair `(exact[:k], approx[:k])`, compute fraction `len(set(e) & set(a)) / min(k, len(e))` when `e` non-empty, returning macro-average Recall@K rounded to 4 decimals.",
    "aStarter": "def recall_at_k(exact_ranked: list[list[str]], approx_ranked: list[list[str]], k: int) -> float:\n    # TODO\n    pass",
    "aHint": "def recall_at_k(exact_ranked: list[list[str]], approx_ranked: list[list[str]], k: int) -> float:\n    if not exact_ranked:\n        return 0.0\n    tot = 0.0\n    for e, a in zip(exact_ranked, approx_ranked):\n        ek = set(e[:k])\n        ak = set(a[:k])\n        tot += (len(ek & ak) / len(ek)) if ek else 1.0\n    return round(tot / len(exact_ranked), 4)",
    "aTest": "assert recall_at_k([[\"a\", \"b\", \"c\"], [\"x\", \"y\", \"z\"]], [[\"a\", \"b\", \"d\"], [\"x\", \"y\", \"z\"]], 3) == 0.8333\nassert recall_at_k([[\"a\", \"b\"]], [[\"a\", \"b\"]], 2) == 1.0\nassert recall_at_k([], [], 2) == 0.0\nprint('All checks passed.')"
  },
  {
    "day": 41,
    "fallbackTitle": "HNSW Graph Construction: Exponential Layer Assignment & Heuristic Neighbor Pruning",
    "eTitle": "HNSW Diversity Heuristic Neighbor Selection (`Algorithm 4` Pruning)",
    "eDesc": "Write `hnsw_select_neighbors_heuristic(target: list[float], candidates: dict[str, list[float]], m: int) -> list[str]`: sort candidates by Euclidean L2 distance to `target` ascending; accept candidate `e` iff `e` is strictly closer to `target` than it is to ANY already-selected neighbor `r` (keeping up to `m` selected IDs).",
    "eStarter": "def hnsw_select_neighbors_heuristic(target: list[float], candidates: dict[str, list[float]], m: int) -> list[str]:\n    # TODO\n    pass",
    "eHint": "def hnsw_select_neighbors_heuristic(target: list[float], candidates: dict[str, list[float]], m: int) -> list[str]:\n    def d2(a, b): return sum((x - y) ** 2 for x, y in zip(a, b))\n    ordered = sorted(candidates.items(), key=lambda kv: (d2(target, kv[1]), kv[0]))\n    sel = []\n    for cid, cvec in ordered:\n        if len(sel) >= m:\n            break\n        dt = d2(target, cvec)\n        if all(dt < d2(cvec, candidates[rid]) for rid in sel):\n            sel.append(cid)\n    return sel",
    "eTest": "cands = {\"near\": [1.0, 0.0], \"collinear\": [2.0, 0.0], \"orth\": [0.0, 3.0]}\nassert hnsw_select_neighbors_heuristic([0.0, 0.0], cands, 2) == [\"near\", \"orth\"]\nassert hnsw_select_neighbors_heuristic([0.0, 0.0], cands, 1) == [\"near\"]\nassert hnsw_select_neighbors_heuristic([0.0, 0.0], {}, 2) == []\nprint('All checks passed.')",
    "aTitle": "HNSW Exponential Layer Level Generator (`floor(-ln(u) * mL)`)",
    "aDesc": "Write `hnsw_assign_level(u_uniform: float, M: int, max_cap: int = 16) -> int`: using Malkov-Yashunin multiplier `mL = 1.0 / math.log(M)` (`u` in `(0, 1]`), compute `min(max_cap, math.floor(-math.log(max(u_uniform, 1e-12)) * mL))`.",
    "aStarter": "import math\n\ndef hnsw_assign_level(u_uniform: float, M: int, max_cap: int = 16) -> int:\n    # TODO\n    pass",
    "aHint": "import math\n\ndef hnsw_assign_level(u_uniform: float, M: int, max_cap: int = 16) -> int:\n    ml = 1.0 / math.log(M)\n    return min(max_cap, math.floor(-math.log(max(u_uniform, 1e-12)) * ml))",
    "aTest": "assert hnsw_assign_level(0.9, 16) == 0\nassert hnsw_assign_level(0.05, 16) == 1\nassert hnsw_assign_level(1e-20, 16, max_cap=5) == 5\nprint('All checks passed.')"
  },
  {
    "day": 42,
    "fallbackTitle": "HNSW Search Tuning: efConstruction vs efSearch Recall-Latency Pareto Frontier",
    "eTitle": "HNSW Greedy + Beam Layer-0 `search_layer` Engine",
    "eDesc": "Write `hnsw_search_layer(query: list[float], entry_id: str, ef: int, vecs: dict[str, list[float]], adj: dict[str, list[str]]) -> list[tuple[str, float]]`: perform standard HNSW best-first search with min-heap candidate queue and bounded `ef`-size result set (L2 squared distance), returning top `ef` `(node_id, round(d2, 6))` ascending.",
    "eStarter": "import heapq\n\ndef hnsw_search_layer(query: list[float], entry_id: str, ef: int, vecs: dict[str, list[float]], adj: dict[str, list[str]]) -> list[tuple[str, float]]:\n    # TODO\n    pass",
    "eHint": "import heapq\n\ndef hnsw_search_layer(query: list[float], entry_id: str, ef: int, vecs: dict[str, list[float]], adj: dict[str, list[str]]) -> list[tuple[str, float]]:\n    def d2(a, b): return sum((x - y) ** 2 for x, y in zip(a, b))\n    d0 = d2(query, vecs[entry_id])\n    visited = {entry_id}\n    cands = [(d0, entry_id)]\n    res = {entry_id: d0}\n    while cands:\n        cd, cid = heapq.heappop(cands)\n        worst = max(res.values())\n        if len(res) >= ef and cd > worst:\n            break\n        for nb in adj.get(cid, []):\n            if nb in visited:\n                continue\n            visited.add(nb)\n            nd = d2(query, vecs[nb])\n            if len(res) < ef or nd < worst:\n                heapq.heappush(cands, (nd, nb))\n                res[nb] = nd\n                if len(res) > ef:\n                    far_id = max(res, key=lambda k: (res[k], k))\n                    del res[far_id]\n                    worst = max(res.values())\n    return sorted([(nid, round(dist, 6)) for nid, dist in res.items()], key=lambda x: (x[1], x[0]))",
    "eTest": "vecs = {\"n0\": [0.0, 0.0], \"n1\": [2.0, 0.0], \"n2\": [5.0, 0.0], \"n3\": [4.9, 0.05]}\nadj = {\"n0\": [\"n1\"], \"n1\": [\"n0\", \"n2\"], \"n2\": [\"n1\", \"n3\"], \"n3\": [\"n2\"]}\nr = hnsw_search_layer([4.9, 0.0], \"n0\", 2, vecs, adj)\nassert r[0][0] == \"n3\" and r[1][0] == \"n2\"\nassert len(hnsw_search_layer([0.0, 0.0], \"n0\", 1, vecs, adj)) == 1\nassert hnsw_search_layer([0.0, 0.0], \"n0\", 3, vecs, adj)[0] == (\"n0\", 0.0)\nprint('All checks passed.')",
    "aTitle": "Pareto Frontier Selector Over `(ef_search, latency_ms, recall)` Benchmarks",
    "aDesc": "Write `pareto_hnsw_configs(points: list[dict]) -> list[dict]`: given telemetry dicts `{\"ef\": int, \"lat_ms\": float, \"recall\": float}`, return non-dominated Pareto configs (no other point has BOTH `lat_ms <= p[\"lat_ms\"]` and `recall >= p[\"recall\"]` with at least one strict inequality), sorted ascending by `lat_ms`.",
    "aStarter": "def pareto_hnsw_configs(points: list[dict]) -> list[dict]:\n    # TODO\n    pass",
    "aHint": "def pareto_hnsw_configs(points: list[dict]) -> list[dict]:\n    out = []\n    for i, p in enumerate(points):\n        dom = any(j != i and q[\"lat_ms\"] <= p[\"lat_ms\"] and q[\"recall\"] >= p[\"recall\"] and (q[\"lat_ms\"] < p[\"lat_ms\"] or q[\"recall\"] > p[\"recall\"]) for j, q in enumerate(points))\n        if not dom:\n            out.append(p)\n    return sorted(out, key=lambda x: x[\"lat_ms\"])",
    "aTest": "pts = [{\"ef\": 16, \"lat_ms\": 2.0, \"recall\": 0.85}, {\"ef\": 32, \"lat_ms\": 4.0, \"recall\": 0.80}, {\"ef\": 64, \"lat_ms\": 5.0, \"recall\": 0.98}]\np = pareto_hnsw_configs(pts)\nassert [x[\"ef\"] for x in p] == [16, 64]\nassert pareto_hnsw_configs([]) == []\nassert len(pareto_hnsw_configs([pts[0]])) == 1\nprint('All checks passed.')"
  },
  {
    "day": 43,
    "fallbackTitle": "DiskANN & Vamana Graphs: SSD Page-Aligned Node Layout & Beam Search",
    "eTitle": "Vamana Alpha-RNG Out-Neighbor Pruning Kernel (`d(p*, n) * alpha <= d(p, n)`)",
    "eDesc": "Write `vamana_alpha_prune(target: list[float], candidates: dict[str, list[float]], r_max: int, alpha: float = 1.2) -> list[str]`: sort candidates ascending by L2 distance to `target`; select next closest `p*` (`< r_max` kept), then remove all remaining candidates `p` occluded by `p*` where `alpha * d(p*, p) <= d(target, p)` (Euclidean distance).",
    "eStarter": "import math\n\ndef vamana_alpha_prune(target: list[float], candidates: dict[str, list[float]], r_max: int, alpha: float = 1.2) -> list[str]:\n    # TODO\n    pass",
    "eHint": "import math\n\ndef vamana_alpha_prune(target: list[float], candidates: dict[str, list[float]], r_max: int, alpha: float = 1.2) -> list[str]:\n    def dist(a, b): return math.sqrt(sum((x - y) ** 2 for x, y in zip(a, b)))\n    rem = sorted(candidates.keys(), key=lambda k: (dist(target, candidates[k]), k))\n    sel = []\n    while rem and len(sel) < r_max:\n        p_star = rem.pop(0)\n        sel.append(p_star)\n        rem = [k for k in rem if alpha * dist(candidates[p_star], candidates[k]) > dist(target, candidates[k])]\n    return sel",
    "eTest": "cands = {\"a\": [1.0, 0.0], \"b\": [2.0, 0.0], \"c\": [0.0, 4.0]}\nassert vamana_alpha_prune([0.0, 0.0], cands, 3, alpha=1.2) == [\"a\", \"c\"]\nassert vamana_alpha_prune([0.0, 0.0], cands, 3, alpha=2.5) == [\"a\", \"b\", \"c\"]\nassert vamana_alpha_prune([0.0, 0.0], {}, 3, alpha=1.2) == []\nprint('All checks passed.')",
    "aTitle": "DiskANN 4KB SSD Sector Node Packer & IOPS Counter",
    "aDesc": "Write `diskann_sector_layout(dim: int, max_deg: int, num_nodes: int, sector_bytes: int = 4096) -> dict`: per-node record size is `dim * 4 + 4 + max_deg * 4` bytes (fp32 vector + neighbor count + `max_deg` uint32 IDs); compute `nodes_per_sector = max(1, sector_bytes // record_bytes)` and `total_sectors = ceil(num_nodes / nodes_per_sector)`.",
    "aStarter": "import math\n\ndef diskann_sector_layout(dim: int, max_deg: int, num_nodes: int, sector_bytes: int = 4096) -> dict:\n    # TODO\n    pass",
    "aHint": "import math\n\ndef diskann_sector_layout(dim: int, max_deg: int, num_nodes: int, sector_bytes: int = 4096) -> dict:\n    rec = dim * 4 + 4 + max_deg * 4\n    nps = max(1, sector_bytes // rec)\n    return {\"record_bytes\": rec, \"nodes_per_sector\": nps, \"total_sectors\": math.ceil(num_nodes / nps)}",
    "aTest": "r = diskann_sector_layout(128, 32, 10000, 4096)\nassert r[\"record_bytes\"] == 644\nassert r[\"nodes_per_sector\"] == 6\nassert r[\"total_sectors\"] == 1667\nprint('All checks passed.')"
  },
  {
    "day": 44,
    "fallbackTitle": "Filtered HNSW: Pre-Filtering vs Post-Filtering vs Single-Stage Predicate Traversal",
    "eTitle": "Adaptive Query Filter Strategy Selector (`pre_filter` vs `single_stage_hnsw`)",
    "eDesc": "Write `choose_filter_strategy(total_docs: int, pass_rate: float, top_k: int) -> str`: estimate surviving rows `m = total_docs * pass_rate`. Return `\"pre_filter_flat\"` if `m <= 5000` (brute force over bitset is faster), `\"single_stage_acorn\"` if `pass_rate < 0.25` (post-filtering collapses), else `\"post_filter_oversample\"`.",
    "eStarter": "def choose_filter_strategy(total_docs: int, pass_rate: float, top_k: int) -> str:\n    # TODO\n    pass",
    "eHint": "def choose_filter_strategy(total_docs: int, pass_rate: float, top_k: int) -> str:\n    if total_docs * pass_rate <= 5000:\n        return \"pre_filter_flat\"\n    if pass_rate < 0.25:\n        return \"single_stage_acorn\"\n    return \"post_filter_oversample\"",
    "eTest": "assert choose_filter_strategy(1000000, 0.001, 10) == \"pre_filter_flat\"\nassert choose_filter_strategy(1000000, 0.05, 10) == \"single_stage_acorn\"\nassert choose_filter_strategy(1000000, 0.60, 10) == \"post_filter_oversample\"\nprint('All checks passed.')",
    "aTitle": "Predicate-Aware Graph Traversal (Traverse Disallowed Nodes, Emit Only Allowed)",
    "aDesc": "Write `acorn_filtered_bfs(query: list[float], start: str, vecs: dict[str, list[float]], adj: dict[str, list[str]], allowed: set[str], max_hops: int, top_k: int) -> list[tuple[str, float]]`: explore reachable nodes up to `max_hops` edges from `start` EVEN THROUGH disallowed nodes (single-stage connectivity preserved), emit ONLY nodes in `allowed`, and return top `top_k` `(id, round(d2, 6))` ascending.",
    "aStarter": "def acorn_filtered_bfs(query: list[float], start: str, vecs: dict[str, list[float]], adj: dict[str, list[str]], allowed: set[str], max_hops: int, top_k: int) -> list[tuple[str, float]]:\n    # TODO\n    pass",
    "aHint": "from collections import deque\n\ndef acorn_filtered_bfs(query: list[float], start: str, vecs: dict[str, list[float]], adj: dict[str, list[str]], allowed: set[str], max_hops: int, top_k: int) -> list[tuple[str, float]]:\n    q = deque([(start, 0)])\n    seen = {start}\n    hits = []\n    while q:\n        nid, d = q.popleft()\n        if nid in allowed:\n            d2 = sum((a - b) ** 2 for a, b in zip(query, vecs[nid]))\n            hits.append((nid, round(d2, 6)))\n        if d < max_hops:\n            for nb in adj.get(nid, []):\n                if nb not in seen:\n                    seen.add(nb)\n                    q.append((nb, d + 1))\n    return sorted(hits, key=lambda x: (x[1], x[0]))[:top_k]",
    "aTest": "vecs = {\"n0\": [10.0], \"n1\": [5.0], \"n2\": [0.1]}\nadj = {\"n0\": [\"n1\"], \"n1\": [\"n2\"]}\nassert acorn_filtered_bfs([0.0], \"n0\", vecs, adj, {\"n2\"}, 2, 2) == [(\"n2\", 0.01)]\nassert acorn_filtered_bfs([0.0], \"n0\", vecs, adj, {\"n2\"}, 1, 2) == []\nassert acorn_filtered_bfs([0.0], \"n0\", vecs, adj, {\"n0\", \"n2\"}, 2, 1) == [(\"n2\", 0.01)]\nprint('All checks passed.')"
  },
  {
    "day": 45,
    "fallbackTitle": "Milestone 9: Predicate-Aware HNSW Graph & DiskANN Beam Search Simulator",
    "eTitle": "Milestone 9A: Beam-Search DiskANN Graph Navigator with L2 Budget",
    "eDesc": "Write `diskann_beam_search(query: list[float], entry: str, beam_w: int, top_k: int, vecs: dict[str, list[float]], adj: dict[str, list[str]]) -> tuple[list[tuple[str, float]], int]`: run bounded `L = beam_w` candidate list graph search expanding unvisited top-closest candidate node at each step (counting total SSD node reads = distinct visited nodes with neighbors expanded), returning `(top_k_sorted_hits, expanded_count)`.",
    "eStarter": "def diskann_beam_search(query: list[float], entry: str, beam_w: int, top_k: int, vecs: dict[str, list[float]], adj: dict[str, list[str]]) -> tuple[list[tuple[str, float]], int]:\n    # TODO\n    pass",
    "eHint": "def diskann_beam_search(query: list[float], entry: str, beam_w: int, top_k: int, vecs: dict[str, list[float]], adj: dict[str, list[str]]) -> tuple[list[tuple[str, float]], int]:\n    def d2(a, b): return round(sum((x - y) ** 2 for x, y in zip(a, b)), 6)\n    pool = {entry: (d2(query, vecs[entry]), False)}\n    seen = {entry}\n    exp = 0\n    while True:\n        unexp = [(val[0], nid) for nid, val in pool.items() if not val[1]]\n        if not unexp:\n            break\n        unexp.sort()\n        _, cur = unexp[0]\n        pool[cur] = (pool[cur][0], True)\n        exp += 1\n        for nb in adj.get(cur, []):\n            if nb not in seen:\n                seen.add(nb)\n                pool[nb] = (d2(query, vecs[nb]), False)\n        if len(pool) > beam_w:\n            keep = dict(sorted(pool.items(), key=lambda kv: (kv[1][0], kv[0]))[:beam_w])\n            pool = keep\n    res = sorted([(nid, val[0]) for nid, val in pool.items()], key=lambda x: (x[1], x[0]))[:top_k]\n    return res, exp",
    "eTest": "vecs = {\"a\": [0.0], \"b\": [2.0], \"c\": [4.9], \"d\": [5.0]}\nadj = {\"a\": [\"b\"], \"b\": [\"c\"], \"c\": [\"d\"]}\nhits, io_cnt = diskann_beam_search([5.0], \"a\", 2, 2, vecs, adj)\nassert hits == [(\"d\", 0.0), (\"c\", 0.01)]\nassert io_cnt == 4\nassert diskann_beam_search([0.0], \"a\", 1, 1, vecs, adj)[0] == [(\"a\", 0.0)]\nprint('All checks passed.')",
    "aTitle": "Milestone 9B: Filtered Post-Oversample Depth Estimator",
    "aDesc": "Write `required_oversample_ef(top_k: int, filter_selectivity: float, min_ef: int = 16, max_ef: int = 2000) -> int`: scale `top_k / max(filter_selectivity, 0.01)` with safety factor `2.0x`, clamped cleanly between `[min_ef, max_ef]` (ceiling int).",
    "aStarter": "import math\n\ndef required_oversample_ef(top_k: int, filter_selectivity: float, min_ef: int = 16, max_ef: int = 2000) -> int:\n    # TODO\n    pass",
    "aHint": "import math\n\ndef required_oversample_ef(top_k: int, filter_selectivity: float, min_ef: int = 16, max_ef: int = 2000) -> int:\n    raw = math.ceil((2.0 * top_k) / max(filter_selectivity, 0.01))\n    return max(min_ef, min(max_ef, raw))",
    "aTest": "assert required_oversample_ef(10, 0.1) == 200\nassert required_oversample_ef(10, 0.9, 32, 2000) == 32\nassert required_oversample_ef(50, 0.001, 16, 1500) == 1500\nprint('All checks passed.')"
  },
  {
    "day": 46,
    "fallbackTitle": "LSM-Vector Segment Architecture: Append-Only MemTables, Tombstone Bitmaps & Compaction",
    "eTitle": "Append-Only Segment + Tombstone Mask Vector Compactor",
    "eDesc": "Write `compact_vector_segments(segments: list[list[tuple[str, int, list[float] | None]]]) -> dict[str, list[float]]`: process ordered segment updates `(doc_id, seq_num, vec_or_None)`; retain ONLY live vectors whose highest `seq_num` is NOT a `None` tombstone.",
    "eStarter": "def compact_vector_segments(segments: list[list[tuple[str, int, list[float] | None]]]) -> dict[str, list[float]]:\n    # TODO\n    pass",
    "eHint": "def compact_vector_segments(segments: list[list[tuple[str, int, list[float] | None]]]) -> dict[str, list[float]]:\n    latest = {}\n    for seg in segments:\n        for did, seq, vec in seg:\n            if did not in latest or seq > latest[did][0]:\n                latest[did] = (seq, vec)\n    return {did: vec for did, (_, vec) in latest.items() if vec is not None}",
    "eTest": "s1 = [(\"a\", 1, [1.0, 2.0]), (\"b\", 2, [3.0, 4.0])]\ns2 = [(\"a\", 3, None), (\"b\", 4, [9.0, 9.0]), (\"c\", 5, [5.0, 5.0])]\nassert compact_vector_segments([s1, s2]) == {\"b\": [9.0, 9.0], \"c\": [5.0, 5.0]}\nassert compact_vector_segments([[(\"a\", 5, [1.0])], [(\"a\", 2, None)]]) == {\"a\": [1.0]}\nassert compact_vector_segments([]) == {}\nprint('All checks passed.')",
    "aTitle": "MemTable Spill Threshold & Tiered Leveled Compaction Trigger",
    "aDesc": "Write `pick_compaction_candidates(segments: list[dict], dead_ratio_thresh: float = 0.25, small_mb_thresh: float = 64.0) -> list[str]`: select segment IDs whose `(deleted / total) >= dead_ratio_thresh` OR `size_mb < small_mb_thresh` (sorted by ID).",
    "aStarter": "def pick_compaction_candidates(segments: list[dict], dead_ratio_thresh: float = 0.25, small_mb_thresh: float = 64.0) -> list[str]:\n    # TODO\n    pass",
    "aHint": "def pick_compaction_candidates(segments: list[dict], dead_ratio_thresh: float = 0.25, small_mb_thresh: float = 64.0) -> list[str]:\n    out = []\n    for s in segments:\n        dead_r = (s[\"deleted\"] / s[\"total\"]) if s[\"total\"] > 0 else 0.0\n        if dead_r >= dead_ratio_thresh or s[\"size_mb\"] < small_mb_thresh:\n            out.append(s[\"id\"])\n    return sorted(out)",
    "aTest": "segs = [{\"id\": \"s1\", \"total\": 100, \"deleted\": 30, \"size_mb\": 200.0}, {\"id\": \"s2\", \"total\": 100, \"deleted\": 0, \"size_mb\": 100.0}, {\"id\": \"s3\", \"total\": 50, \"deleted\": 0, \"size_mb\": 20.0}]\nassert pick_compaction_candidates(segs) == [\"s1\", \"s3\"]\nassert pick_compaction_candidates([segs[1]]) == []\nassert pick_compaction_candidates([]) == []\nprint('All checks passed.')"
  },
  {
    "day": 47,
    "fallbackTitle": "Write-Ahead Logging (WAL), Crash Recovery & Snapshot Isolation for Vector Upserts",
    "eTitle": "CRC-Protected WAL Replay & Crash-Safe Upsert/Delete Recovery",
    "eDesc": "Write `replay_vector_wal(records: list[dict], checkpoint_lsn: int, checkpoint_state: dict[str, list[float]]) -> dict[str, list[float]]`: starting from copy of `checkpoint_state`, validate `sha256(f\"{lsn}:{op}:{id}\")[:8] == rec[\"crc\"]`, apply records with `lsn > checkpoint_lsn` in LSN order (`upsert`/`delete`), stopping immediately on first corrupt/truncated CRC tail record.",
    "eStarter": "import hashlib\n\ndef replay_vector_wal(records: list[dict], checkpoint_lsn: int, checkpoint_state: dict[str, list[float]]) -> dict[str, list[float]]:\n    # TODO\n    pass",
    "eHint": "import hashlib\n\ndef replay_vector_wal(records: list[dict], checkpoint_lsn: int, checkpoint_state: dict[str, list[float]]) -> dict[str, list[float]]:\n    state = {k: list(v) for k, v in checkpoint_state.items()}\n    for r in sorted(records, key=lambda x: x[\"lsn\"]):\n        expected = hashlib.sha256(f\"{r['lsn']}:{r['op']}:{r['id']}\".encode()).hexdigest()[:8]\n        if r.get(\"crc\") != expected:\n            break\n        if r[\"lsn\"] <= checkpoint_lsn:\n            continue\n        if r[\"op\"] == \"upsert\":\n            state[r[\"id\"]] = list(r[\"vec\"])\n        elif r[\"op\"] == \"delete\":\n            state.pop(r[\"id\"], None)\n    return state",
    "eTest": "import hashlib\ndef mk(lsn, op, did, vec=None): return {\"lsn\": lsn, \"op\": op, \"id\": did, \"vec\": vec, \"crc\": hashlib.sha256(f\"{lsn}:{op}:{did}\".encode()).hexdigest()[:8]}\nwal = [mk(2, \"upsert\", \"a\", [1.0]), mk(3, \"delete\", \"b\"), {\"lsn\": 4, \"op\": \"upsert\", \"id\": \"bad\", \"vec\": [9.0], \"crc\": \"deadbeef\"}]\nassert replay_vector_wal(wal, 1, {\"b\": [2.0]}) == {\"a\": [1.0]}\nassert replay_vector_wal(wal, 3, {\"b\": [2.0]}) == {\"b\": [2.0]}\nassert replay_vector_wal([], 0, {\"k\": [5.0]}) == {\"k\": [5.0]}\nprint('All checks passed.')",
    "aTitle": "MVCC Snapshot Visibility Reader Over Versioned Vector Writes",
    "aDesc": "Write `snapshot_visible_vectors(versions: dict[str, list[tuple[int, list[float] | None]]], read_lsn: int) -> dict[str, list[float]]`: for each `doc_id`, select version with largest `lsn <= read_lsn` and include iff non-None.",
    "aStarter": "def snapshot_visible_vectors(versions: dict[str, list[tuple[int, list[float] | None]]], read_lsn: int) -> dict[str, list[float]]:\n    # TODO\n    pass",
    "aHint": "def snapshot_visible_vectors(versions: dict[str, list[tuple[int, list[float] | None]]], read_lsn: int) -> dict[str, list[float]]:\n    out = {}\n    for did, vs in versions.items():\n        vis = [pair for pair in vs if pair[0] <= read_lsn]\n        if vis:\n            _, vec = max(vis, key=lambda x: x[0])\n            if vec is not None:\n                out[did] = list(vec)\n    return out",
    "aTest": "vs = {\"d1\": [(1, [1.0]), (5, None), (8, [2.0])], \"d2\": [(4, [9.0])]}\nassert snapshot_visible_vectors(vs, 3) == {\"d1\": [1.0]}\nassert snapshot_visible_vectors(vs, 5) == {\"d2\": [9.0]}\nassert snapshot_visible_vectors(vs, 9) == {\"d1\": [2.0], \"d2\": [9.0]}\nprint('All checks passed.')"
  },
  {
    "day": 48,
    "fallbackTitle": "Consistent Hash Sharding vs Tenant-Key Routing for Multi-Tenant Vector Clusters",
    "eTitle": "Consistent Hash Ring with Virtual Nodes & Minimal Migration Ratio",
    "eDesc": "Write `route_consistent_hash(keys: list[str], nodes: list[str], vnodes: int = 8) -> dict[str, str]`: place `f\"{node}#{i}\"` tokens on a SHA-256 `int(hex[:12], 16)` sorted ring, bisect each key hash clockwise to its owning physical node (`ring[0]` wrap-around).",
    "eStarter": "import hashlib, bisect\n\ndef route_consistent_hash(keys: list[str], nodes: list[str], vnodes: int = 8) -> dict[str, str]:\n    # TODO\n    pass",
    "eHint": "import hashlib, bisect\n\ndef route_consistent_hash(keys: list[str], nodes: list[str], vnodes: int = 8) -> dict[str, str]:\n    def h(s): return int(hashlib.sha256(s.encode()).hexdigest()[:12], 16)\n    ring = sorted((h(f\"{n}#{i}\"), n) for n in nodes for i in range(vnodes))\n    pts = [p for p, _ in ring]\n    out = {}\n    for k in keys:\n        idx = bisect.bisect_left(pts, h(k)) % len(ring)\n        out[k] = ring[idx][1]\n    return out",
    "eTest": "keys = [f\"k{i}\" for i in range(50)]\nm1 = route_consistent_hash(keys, [\"s0\", \"s1\", \"s2\"])\nm2 = route_consistent_hash(keys, [\"s0\", \"s1\", \"s2\", \"s3\"])\nmoved = sum(1 for k in keys if m1[k] != m2[k])\nassert len(set(m1.values())) >= 2\nassert 1 <= moved <= 25\nassert route_consistent_hash([], [\"s0\"]) == {}\nprint('All checks passed.')",
    "aTitle": "Tenant-Co-Located Shard Planner vs Global Uniform Hash",
    "aDesc": "Write `route_tenant_query(tenant_id: str, large_tenants: dict[str, list[str]], shared_shards: list[str]) -> list[str]`: if `tenant_id` is in `large_tenants`, query only its dedicated shard list (tenant isolation); otherwise scatter ONLY to `shared_shards`.",
    "aStarter": "def route_tenant_query(tenant_id: str, large_tenants: dict[str, list[str]], shared_shards: list[str]) -> list[str]:\n    # TODO\n    pass",
    "aHint": "def route_tenant_query(tenant_id: str, large_tenants: dict[str, list[str]], shared_shards: list[str]) -> list[str]:\n    return list(large_tenants[tenant_id]) if tenant_id in large_tenants else list(shared_shards)",
    "aTest": "assert route_tenant_query(\"acme\", {\"acme\": [\"ded-1\", \"ded-2\"]}, [\"sh-0\", \"sh-1\"]) == [\"ded-1\", \"ded-2\"]\nassert route_tenant_query(\"smb-9\", {\"acme\": [\"ded-1\"]}, [\"sh-0\", \"sh-1\"]) == [\"sh-0\", \"sh-1\"]\nassert route_tenant_query(\"none\", {}, [\"sh-0\"]) == [\"sh-0\"]\nprint('All checks passed.')"
  },
  {
    "day": 49,
    "fallbackTitle": "Scatter-Gather Query Coordinator: Tail-Latency Cutoffs & Partial Result Merging",
    "eTitle": "SLA Deadline Scatter-Gather Coordinator with Partial Degradation Status",
    "eDesc": "Write `scatter_gather_shards(shard_responses: list[dict], deadline_ms: float, top_k: int) -> dict`: filter shards responding cleanly (`lat_ms <= deadline_ms` and not `failed`), merge their `hits: [(doc_id, score)]` via top-K max-score desc (`(-score, id)`), and report `{\"hits\": list, \"shards_ok\": int, \"total_shards\": int, \"partial\": bool}`.",
    "eStarter": "def scatter_gather_shards(shard_responses: list[dict], deadline_ms: float, top_k: int) -> dict:\n    # TODO\n    pass",
    "eHint": "def scatter_gather_shards(shard_responses: list[dict], deadline_ms: float, top_k: int) -> dict:\n    hits = []\n    ok = 0\n    for sr in shard_responses:\n        if not sr.get(\"failed\") and sr[\"lat_ms\"] <= deadline_ms:\n            ok += 1\n            hits.extend(sr[\"hits\"])\n    hits.sort(key=lambda x: (-x[1], x[0]))\n    return {\"hits\": hits[:top_k], \"shards_ok\": ok, \"total_shards\": len(shard_responses), \"partial\": ok < len(shard_responses)}",
    "eTest": "res = scatter_gather_shards([{\"lat_ms\": 12, \"failed\": False, \"hits\": [(\"a\", 0.9), (\"b\", 0.5)]}, {\"lat_ms\": 95, \"failed\": False, \"hits\": [(\"z\", 0.99)]}], 50.0, 2)\nassert res[\"hits\"] == [(\"a\", 0.9), (\"b\", 0.5)]\nassert res[\"shards_ok\"] == 1 and res[\"partial\"] is True\nassert scatter_gather_shards([{\"lat_ms\": 10, \"failed\": False, \"hits\": [(\"a\", 0.8)]}], 50.0, 1)[\"partial\"] is False\nprint('All checks passed.')",
    "aTitle": "Bounded Quorum Hedged Request Tail-Latency Simulator",
    "aDesc": "Write `hedged_pair_latency(primary_ms: float, hedge_delay_ms: float, replica_ms: float) -> float`: client sends primary at `t=0`; if `primary_ms <= hedge_delay_ms`, returns `primary_ms`; else fires replica at `t = hedge_delay_ms` and completes at `min(primary_ms, hedge_delay_ms + replica_ms)`.",
    "aStarter": "def hedged_pair_latency(primary_ms: float, hedge_delay_ms: float, replica_ms: float) -> float:\n    # TODO\n    pass",
    "aHint": "def hedged_pair_latency(primary_ms: float, hedge_delay_ms: float, replica_ms: float) -> float:\n    if primary_ms <= hedge_delay_ms:\n        return float(primary_ms)\n    return float(min(primary_ms, hedge_delay_ms + replica_ms))",
    "aTest": "assert hedged_pair_latency(8.0, 15.0, 5.0) == 8.0\nassert hedged_pair_latency(120.0, 15.0, 10.0) == 25.0\nassert hedged_pair_latency(20.0, 15.0, 30.0) == 20.0\nprint('All checks passed.')"
  },
  {
    "day": 50,
    "fallbackTitle": "Milestone 10: Distributed Sharded Vector Storage & Scatter-Gather Coordinator",
    "eTitle": "Milestone 10A: Multi-Shard Vector Cluster Router + Cosine Merge Engine",
    "eDesc": "Write `sharded_vector_search(shards: dict[str, dict[str, list[float]]], target_shards: list[str], query: list[float], top_k: int) -> list[tuple[str, float, str]]`: scan only `target_shards`, compute cosine similarity per doc, merge globally descending, and return top `top_k` `(doc_id, round(cos, 6), shard_id)` sorted by `(-cos, doc_id)`.",
    "eStarter": "import math\n\ndef sharded_vector_search(shards: dict[str, dict[str, list[float]]], target_shards: list[str], query: list[float], top_k: int) -> list[tuple[str, float, str]]:\n    # TODO\n    pass",
    "eHint": "import math\n\ndef sharded_vector_search(shards: dict[str, dict[str, list[float]]], target_shards: list[str], query: list[float], top_k: int) -> list[tuple[str, float, str]]:\n    nq = math.sqrt(sum(x * x for x in query))\n    res = []\n    for sid in target_shards:\n        for did, vec in shards.get(sid, {}).items():\n            nv = math.sqrt(sum(x * x for x in vec))\n            sc = sum(a * b for a, b in zip(query, vec)) / (nq * nv) if nq > 0 and nv > 0 else 0.0\n            res.append((did, round(sc, 6), sid))\n    return sorted(res, key=lambda x: (-x[1], x[0]))[:top_k]",
    "eTest": "sh = {\"s0\": {\"d1\": [1.0, 0.0]}, \"s1\": {\"d2\": [0.8, 0.6]}, \"s2\": {\"d3\": [1.0, 0.0]}}\nassert sharded_vector_search(sh, [\"s0\", \"s1\"], [1.0, 0.0], 2) == [(\"d1\", 1.0, \"s0\"), (\"d2\", 0.8, \"s1\")]\nassert sharded_vector_search(sh, [\"s1\"], [1.0, 0.0], 1) == [(\"d2\", 0.8, \"s1\")]\nassert sharded_vector_search(sh, [], [1.0, 0.0], 2) == []\nprint('All checks passed.')",
    "aTitle": "Milestone 10B: Quorum Vector Replication Consistency Arbiter (`W + R > N`)",
    "aDesc": "Write `quorum_read_repair(replica_records: list[tuple[int, list[float] | None]]) -> dict`: given `[(lsn, vec_or_none)]` across `R` replicas, pick authoritative newest `max_lsn` value (or None if tombstoned) and return `{\"latest_lsn\": int, \"value\": val, \"stale_count\": int}` counting how many replicas lagged behind `latest_lsn`.",
    "aStarter": "def quorum_read_repair(replica_records: list[tuple[int, list[float] | None]]) -> dict:\n    # TODO\n    pass",
    "aHint": "def quorum_read_repair(replica_records: list[tuple[int, list[float] | None]]) -> dict:\n    best_lsn, best_val = max(replica_records, key=lambda x: x[0])\n    stale = sum(1 for lsn, _ in replica_records if lsn < best_lsn)\n    return {\"latest_lsn\": best_lsn, \"value\": best_val, \"stale_count\": stale}",
    "aTest": "r = quorum_read_repair([(10, [1.0]), (14, [2.0]), (12, [1.5])])\nassert r == {\"latest_lsn\": 14, \"value\": [2.0], \"stale_count\": 2}\nassert quorum_read_repair([(5, None), (3, [1.0])]) == {\"latest_lsn\": 5, \"value\": None, \"stale_count\": 1}\nassert quorum_read_repair([(7, [9.0]), (7, [9.0])])[\"stale_count\"] == 0\nprint('All checks passed.')"
  },
  {
    "day": 51,
    "fallbackTitle": "Multi-Tenant Namespace Isolation, Row-Level ACLs & Per-Tenant Quota Throttling",
    "eTitle": "Zero-Trust Row-Level Security (RLS) Vector Filter & Namespace Guard",
    "eDesc": "Write `authorize_and_filter_hits(hits: list[dict], principal_tenant: str, principal_roles: set[str], top_k: int) -> list[str]`: drop ANY hit whose `\"tenant_id\" != principal_tenant` (hard cross-tenant isolation even on ID match) or where `not (set(hit[\"acl_roles\"]) & principal_roles)`, returning remaining `hit[\"id\"]` ordered by original score desc up to `top_k`.",
    "eStarter": "def authorize_and_filter_hits(hits: list[dict], principal_tenant: str, principal_roles: set[str], top_k: int) -> list[str]:\n    # TODO\n    pass",
    "eHint": "def authorize_and_filter_hits(hits: list[dict], principal_tenant: str, principal_roles: set[str], top_k: int) -> list[str]:\n    ok = [h[\"id\"] for h in hits if h.get(\"tenant_id\") == principal_tenant and (set(h.get(\"acl_roles\", [])) & principal_roles)]\n    return ok[:top_k]",
    "eTest": "hits = [{\"id\": \"d1\", \"tenant_id\": \"t2\", \"acl_roles\": [\"admin\"]}, {\"id\": \"d2\", \"tenant_id\": \"t1\", \"acl_roles\": [\"finance\"]}, {\"id\": \"d3\", \"tenant_id\": \"t1\", \"acl_roles\": [\"eng\", \"public\"]}]\nassert authorize_and_filter_hits(hits, \"t1\", {\"eng\"}, 5) == [\"d3\"]\nassert authorize_and_filter_hits(hits, \"t1\", {\"finance\", \"eng\"}, 1) == [\"d2\"]\nassert authorize_and_filter_hits(hits, \"t1\", {\"guest\"}, 5) == []\nprint('All checks passed.')",
    "aTitle": "Per-Tenant Token-Bucket QPS Quota Enforcer",
    "aDesc": "Implement `TenantRateLimiter(cap: float, rate_per_sec: float)`: `allow(tenant: str, now_sec: float, cost: float = 1.0) -> bool` refills each tenant bucket independently from `cap` up to `cap` (`min(cap, tokens + (now - last)*rate)`) and consumes `cost` iff sufficient.",
    "aStarter": "class TenantRateLimiter:\n    def __init__(self, cap: float, rate_per_sec: float):\n        # TODO\n        pass\n\n    def allow(self, tenant: str, now_sec: float, cost: float = 1.0) -> bool:\n        # TODO\n        pass",
    "aHint": "class TenantRateLimiter:\n    def __init__(self, cap: float, rate_per_sec: float):\n        self.cap = float(cap)\n        self.rate = float(rate_per_sec)\n        self.state = {}\n\n    def allow(self, tenant: str, now_sec: float, cost: float = 1.0) -> bool:\n        toks, last = self.state.get(tenant, (self.cap, now_sec))\n        toks = min(self.cap, toks + max(0.0, now_sec - last) * self.rate)\n        if toks >= cost:\n            self.state[tenant] = (toks - cost, now_sec)\n            return True\n        self.state[tenant] = (toks, now_sec)\n        return False",
    "aTest": "rl = TenantRateLimiter(2.0, 1.0)\nassert rl.allow(\"t1\", 0.0) and rl.allow(\"t1\", 0.0)\nassert not rl.allow(\"t1\", 0.5)\nassert rl.allow(\"t2\", 0.5) and rl.allow(\"t1\", 1.0)\nprint('All checks passed.')"
  },
  {
    "day": 52,
    "fallbackTitle": "Query Rewriting, Expansion & Cross-Encoder Reranking Cascades",
    "eTitle": "Multi-Query Expansion Union + Exact Two-Stage Cascade Reranker",
    "eDesc": "Write `cascade_rerank(subquery_hits: list[list[str]], ce_scores: dict[str, float], top_k: int) -> list[tuple[str, float]]`: collect deduplicated candidate union across sub-queries, score using cross-encoder lookup `ce_scores.get(id, 0.0)`, and return top `top_k` `(doc_id, score)` sorted desc by `(-score, doc_id)`.",
    "eStarter": "def cascade_rerank(subquery_hits: list[list[str]], ce_scores: dict[str, float], top_k: int) -> list[tuple[str, float]]:\n    # TODO\n    pass",
    "eHint": "def cascade_rerank(subquery_hits: list[list[str]], ce_scores: dict[str, float], top_k: int) -> list[tuple[str, float]]:\n    pool = {did for hits in subquery_hits for did in hits}\n    scored = [(did, float(ce_scores.get(did, 0.0))) for did in pool]\n    return sorted(scored, key=lambda x: (-x[1], x[0]))[:top_k]",
    "eTest": "res = cascade_rerank([[\"d1\", \"d2\"], [\"d2\", \"d3\"]], {\"d1\": 0.2, \"d2\": 0.95, \"d3\": 0.7}, 2)\nassert res == [(\"d2\", 0.95), (\"d3\", 0.7)]\nassert cascade_rerank([[\"d4\"]], {}, 2) == [(\"d4\", 0.0)]\nassert cascade_rerank([], {\"d1\": 1.0}, 2) == []\nprint('All checks passed.')",
    "aTitle": "HyDE Query-Embedding Centroid Averager & Metadata Constraint Extractor",
    "aDesc": "Write `average_hyde_embeddings(vecs: list[list[float]]) -> list[float]`: compute normalized elementwise centroid across hypothetical document embeddings (L2-normalized output, rounded to 6 decimals; `[]` if empty).",
    "aStarter": "import math\n\ndef average_hyde_embeddings(vecs: list[list[float]]) -> list[float]:\n    # TODO\n    pass",
    "aHint": "import math\n\ndef average_hyde_embeddings(vecs: list[list[float]]) -> list[float]:\n    if not vecs:\n        return []\n    d = len(vecs[0])\n    mean = [sum(v[j] for v in vecs) / len(vecs) for j in range(d)]\n    n = math.sqrt(sum(x * x for x in mean))\n    return [round(x / n, 6) for x in mean] if n > 0 else [0.0] * d",
    "aTest": "assert average_hyde_embeddings([[1.0, 0.0], [0.0, 1.0]]) == [0.707107, 0.707107]\nassert average_hyde_embeddings([[3.0, 4.0]]) == [0.6, 0.8]\nassert average_hyde_embeddings([]) == []\nprint('All checks passed.')"
  },
  {
    "day": 53,
    "fallbackTitle": "MMR (Maximal Marginal Relevance) Diversity Reranking to Eliminate Redundant Chunks",
    "eTitle": "Carbonell-Goldstein MMR (`lambda * sim(q, d) - (1-lambda) * max sim(d, s)`) Reranker",
    "eDesc": "Write `mmr_select(query: list[float], candidates: dict[str, list[float]], k: int, lam: float = 0.5) -> list[str]`: greedily select `k` IDs maximizing `lam * cos(q, d)` on step 1 and `lam * cos(q, d) - (1 - lam) * max_{s in S} cos(d, s)` on subsequent steps (tie-break lexicographical `doc_id`).",
    "eStarter": "import math\n\ndef mmr_select(query: list[float], candidates: dict[str, list[float]], k: int, lam: float = 0.5) -> list[str]:\n    # TODO\n    pass",
    "eHint": "import math\n\ndef mmr_select(query: list[float], candidates: dict[str, list[float]], k: int, lam: float = 0.5) -> list[str]:\n    def cos(a, b):\n        na, nb = math.sqrt(sum(x * x for x in a)), math.sqrt(sum(x * x for x in b))\n        return sum(x * y for x, y in zip(a, b)) / (na * nb) if na > 0 and nb > 0 else 0.0\n    rem = sorted(candidates.keys())\n    sel = []\n    while rem and len(sel) < k:\n        best_id = None\n        best_val = float(\"-inf\")\n        for cid in rem:\n            rel = cos(query, candidates[cid])\n            red = max((cos(candidates[cid], candidates[s]) for s in sel), default=0.0)\n            val = rel if not sel else (lam * rel - (1.0 - lam) * red)\n            if val > best_val + 1e-12:\n                best_val = val\n                best_id = cid\n        sel.append(best_id)\n        rem.remove(best_id)\n    return sel",
    "eTest": "cands = {\"a\": [0.96, 0.28], \"a_dup\": [0.96, 0.28], \"b\": [0.8, -0.6]}\nassert mmr_select([1.0, 0.0], cands, 2, lam=0.5) == [\"a\", \"b\"]\nassert mmr_select([1.0, 0.0], cands, 2, lam=0.95) == [\"a\", \"a_dup\"]\nassert mmr_select([1.0, 0.0], {}, 2) == []\nprint('All checks passed.')",
    "aTitle": "Per-Document Chunk Cap & Section-Diversity Deduplicator",
    "aDesc": "Write `enforce_parent_doc_cap(ranked_chunks: list[tuple[str, str, float]], max_per_parent: int, top_k: int) -> list[str]`: iterate `(chunk_id, parent_doc_id, score)` keeping at most `max_per_parent` chunks per `parent_doc_id`, returning top `top_k` `chunk_id`s.",
    "aStarter": "def enforce_parent_doc_cap(ranked_chunks: list[tuple[str, str, float]], max_per_parent: int, top_k: int) -> list[str]:\n    # TODO\n    pass",
    "aHint": "from collections import Counter\n\ndef enforce_parent_doc_cap(ranked_chunks: list[tuple[str, str, float]], max_per_parent: int, top_k: int) -> list[str]:\n    cnt = Counter()\n    out = []\n    for cid, pid, _ in ranked_chunks:\n        if cnt[pid] < max_per_parent:\n            cnt[pid] += 1\n            out.append(cid)\n            if len(out) >= top_k:\n                break\n    return out",
    "aTest": "chunks = [(\"c1\", \"docA\", 0.99), (\"c2\", \"docA\", 0.98), (\"c3\", \"docB\", 0.85), (\"c4\", \"docC\", 0.7)]\nassert enforce_parent_doc_cap(chunks, 1, 3) == [\"c1\", \"c3\", \"c4\"]\nassert enforce_parent_doc_cap(chunks, 2, 2) == [\"c1\", \"c2\"]\nassert enforce_parent_doc_cap([], 1, 3) == []\nprint('All checks passed.')"
  },
  {
    "day": 54,
    "fallbackTitle": "Semantic Cache Lookup with Adaptive Similarity Thresholds & Staleness Eviction",
    "eTitle": "TTL + Cosine Threshold Semantic Query Cache Engine",
    "eDesc": "Implement `SemanticCache(sim_thresh: float, ttl_sec: float, capacity: int)`: `put(key_id, vec, answer, now_sec)` inserts/evicts oldest if full; `get(q_vec, now_sec) -> str | None` prunes expired entries `(now_sec - ts) > ttl_sec` and returns answer of highest-cosine live entry iff `cos >= sim_thresh`.",
    "eStarter": "import math\n\nclass SemanticCache:\n    def __init__(self, sim_thresh: float, ttl_sec: float, capacity: int):\n        # TODO\n        pass\n\n    def put(self, key_id: str, vec: list[float], answer: str, now_sec: float):\n        # TODO\n        pass\n\n    def get(self, q_vec: list[float], now_sec: float):\n        # TODO\n        pass",
    "eHint": "import math\n\nclass SemanticCache:\n    def __init__(self, sim_thresh: float, ttl_sec: float, capacity: int):\n        self.thresh = sim_thresh\n        self.ttl = ttl_sec\n        self.cap = capacity\n        self.entries = []\n\n    def _cos(self, a, b):\n        na, nb = math.sqrt(sum(x * x for x in a)), math.sqrt(sum(x * x for x in b))\n        return sum(x * y for x, y in zip(a, b)) / (na * nb) if na > 0 and nb > 0 else 0.0\n\n    def put(self, key_id: str, vec: list[float], answer: str, now_sec: float):\n        self.entries = [e for e in self.entries if e[0] != key_id]\n        if len(self.entries) >= self.cap:\n            self.entries.pop(0)\n        self.entries.append((key_id, vec, answer, now_sec))\n\n    def get(self, q_vec: list[float], now_sec: float):\n        self.entries = [e for e in self.entries if (now_sec - e[3]) <= self.ttl]\n        best = None\n        best_s = self.thresh - 1e-12\n        for _, vec, ans, _ in self.entries:\n            s = self._cos(q_vec, vec)\n            if s >= best_s:\n                best_s = s\n                best = ans\n        return best",
    "eTest": "sc = SemanticCache(0.95, 60.0, 2)\nsc.put(\"k1\", [1.0, 0.0], \"ans1\", 10.0)\nassert sc.get([0.99, 0.1], 20.0) == \"ans1\"\nassert sc.get([0.0, 1.0], 20.0) is None\nassert sc.get([1.0, 0.0], 80.0) is None\nprint('All checks passed.')",
    "aTitle": "Cache False-Hit Threshold Calibrator via ROC Cost Objective",
    "aDesc": "Write `best_cache_threshold(samples: list[tuple[float, bool]], fp_penalty: float = 5.0) -> float`: each sample is `(cos_sim, actually_same_intent)`. Pick candidate threshold `t` from unique similarities that maximizes `true_hits - fp_penalty * false_hits` (tie-break highest threshold).",
    "aStarter": "def best_cache_threshold(samples: list[tuple[float, bool]], fp_penalty: float = 5.0) -> float:\n    # TODO\n    pass",
    "aHint": "def best_cache_threshold(samples: list[tuple[float, bool]], fp_penalty: float = 5.0) -> float:\n    cands = sorted({s for s, _ in samples}, reverse=True)\n    best_t, best_u = cands[0], float(\"-inf\")\n    for t in cands:\n        tp = sum(1 for s, ok in samples if s >= t and ok)\n        fp = sum(1 for s, ok in samples if s >= t and not ok)\n        u = tp - fp_penalty * fp\n        if u > best_u:\n            best_u = u\n            best_t = t\n    return round(best_t, 4)",
    "aTest": "samps = [(0.96, True), (0.94, True), (0.91, False), (0.85, False)]\nassert best_cache_threshold(samps, fp_penalty=5.0) == 0.94\nassert best_cache_threshold([(0.88, True), (0.88, False)], 5.0) == 0.88\nassert best_cache_threshold([(0.99, True)], 2.0) == 0.99\nprint('All checks passed.')"
  },
  {
    "day": 55,
    "fallbackTitle": "Milestone 11: Multi-Tenant Access Guard & MMR Diversity Reranking Pipeline",
    "eTitle": "Milestone 11A: Tenant-Isolated MMR Diversifying Search Endpoint",
    "eDesc": "Write `tenant_mmr_search(query: list[float], docs: list[dict], tenant_id: str, k: int, lam: float = 0.6) -> list[str]`: enforce `doc[\"tenant_id\"] == tenant_id` BEFORE any ranking, then run MMR diversity selection (`lam * rel - (1-lam) * max_red`), returning ordered `doc[\"id\"]` list.",
    "eStarter": "import math\n\ndef tenant_mmr_search(query: list[float], docs: list[dict], tenant_id: str, k: int, lam: float = 0.6) -> list[str]:\n    # TODO\n    pass",
    "eHint": "import math\n\ndef tenant_mmr_search(query: list[float], docs: list[dict], tenant_id: str, k: int, lam: float = 0.6) -> list[str]:\n    def cos(a, b):\n        na, nb = math.sqrt(sum(x * x for x in a)), math.sqrt(sum(x * x for x in b))\n        return sum(x * y for x, y in zip(a, b)) / (na * nb) if na > 0 and nb > 0 else 0.0\n    pool = {d[\"id\"]: d[\"vec\"] for d in docs if d.get(\"tenant_id\") == tenant_id}\n    rem = sorted(pool.keys())\n    sel = []\n    while rem and len(sel) < k:\n        bid = max(rem, key=lambda cid: cos(query, pool[cid]) if not sel else lam * cos(query, pool[cid]) - (1.0 - lam) * max(cos(pool[cid], pool[s]) for s in sel))\n        sel.append(bid)\n        rem.remove(bid)\n    return sel",
    "eTest": "docs = [{\"id\": \"leak\", \"tenant_id\": \"other\", \"vec\": [1.0, 0.0]}, {\"id\": \"a\", \"tenant_id\": \"t1\", \"vec\": [0.96, 0.28]}, {\"id\": \"a2\", \"tenant_id\": \"t1\", \"vec\": [0.96, 0.28]}, {\"id\": \"b\", \"tenant_id\": \"t1\", \"vec\": [0.8, -0.6]}]\nassert tenant_mmr_search([1.0, 0.0], docs, \"t1\", 2, 0.5) == [\"a\", \"b\"]\nassert tenant_mmr_search([1.0, 0.0], docs, \"none\", 2) == []\nassert tenant_mmr_search([1.0, 0.0], docs, \"other\", 2) == [\"leak\"]\nprint('All checks passed.')",
    "aTitle": "Milestone 11B: Semantic Cache + Authorized Vector Fallback Orchestrator",
    "aDesc": "Write `cache_aware_retrieve(query: str, tenant_id: str, cache: dict[tuple[str, str], str], fallback_fn) -> dict`: isolate cache strictly by `(tenant_id, query)`; return `{\"hit\": True, \"value\": ans}` on hit, else call `fallback_fn(query, tenant_id)` storing under `(tenant_id, query)` and return `{\"hit\": False, \"value\": val}`.",
    "aStarter": "def cache_aware_retrieve(query: str, tenant_id: str, cache: dict[tuple[str, str], str], fallback_fn) -> dict:\n    # TODO\n    pass",
    "aHint": "def cache_aware_retrieve(query: str, tenant_id: str, cache: dict[tuple[str, str], str], fallback_fn) -> dict:\n    key = (tenant_id, query)\n    if key in cache:\n        return {\"hit\": True, \"value\": cache[key]}\n    val = fallback_fn(query, tenant_id)\n    cache[key] = val\n    return {\"hit\": False, \"value\": val}",
    "aTest": "c = {(\"t1\", \"q\"): \"t1-secret\"}\nassert cache_aware_retrieve(\"q\", \"t1\", c, lambda q, t: \"new\") == {\"hit\": True, \"value\": \"t1-secret\"}\nassert cache_aware_retrieve(\"q\", \"t2\", c, lambda q, t: f\"{t}:{q}\") == {\"hit\": False, \"value\": \"t2:q\"}\nassert c[(\"t2\", \"q\")] == \"t2:q\"\nprint('All checks passed.')"
  },
  {
    "day": 56,
    "fallbackTitle": "Retrieval Evaluation Suite: Recall@K, MRR, MAP & nDCG with Graded Relevance",
    "eTitle": "MRR@K & MAP@K Multi-Query Information Retrieval Evaluators",
    "eDesc": "Write `eval_mrr_map(queries_preds: list[list[str]], queries_rels: list[set[str]], k: int) -> dict`: compute macro Mean Reciprocal Rank `MRR@k` and Mean Average Precision `MAP@k` (average precision over `min(|rel|, k)` or standard precision at each relevant hit divided by `min(|rel|, k)`? Standard TREC MAP divides sum of precision@i at relevant hits in top k by `len(rel)` if `len(rel) > 0` else 0; wait use `min(len(rel), k)`? Standard IR MAP@k uses `len(rel)` if `len(rel)<=k` else `min(len(rel), k)` -> let use `min(len(rel), k)`). Round both to 4 decimals.",
    "eStarter": "def eval_mrr_map(queries_preds: list[list[str]], queries_rels: list[set[str]], k: int) -> dict:\n    # TODO\n    pass",
    "eHint": "def eval_mrr_map(queries_preds: list[list[str]], queries_rels: list[set[str]], k: int) -> dict:\n    mrr = map_s = 0.0\n    n = len(queries_preds)\n    for preds, rels in zip(queries_preds, queries_rels):\n        top = preds[:k]\n        for r, did in enumerate(top, start=1):\n            if did in rels:\n                mrr += 1.0 / r\n                break\n        hits = ap = 0.0\n        for r, did in enumerate(top, start=1):\n            if did in rels:\n                hits += 1\n                ap += hits / r\n        denom = min(len(rels), k)\n        map_s += (ap / denom) if denom > 0 else 0.0\n    return {\"mrr\": round(mrr / n, 4), \"map\": round(map_s / n, 4)} if n else {\"mrr\": 0.0, \"map\": 0.0}",
    "eTest": "r = eval_mrr_map([[\"a\", \"b\", \"c\"], [\"x\", \"a\", \"y\"]], [{\"a\", \"b\"}, {\"a\"}], 3)\nassert r == {\"mrr\": 0.75, \"map\": 0.75}\nassert eval_mrr_map([[\"z\"]], [{\"a\"}], 1) == {\"mrr\": 0.0, \"map\": 0.0}\nassert eval_mrr_map([], [], 3) == {\"mrr\": 0.0, \"map\": 0.0}\nprint('All checks passed.')",
    "aTitle": "Graded Relevance nDCG@K (Normalized Discounted Cumulative Gain) Scorer",
    "aDesc": "Write `ndcg_at_k(pred_ids: list[str], rel_grades: dict[str, int], k: int) -> float`: compute `DCG@K = sum_{i=1..k} (2**g_i - 1) / log2(i + 1)` over `pred_ids[:k]` and divide by ideal `IDCG@K` over top `k` grades descending, rounded to 4 decimals (`0.0` if `IDCG == 0`).",
    "aStarter": "import math\n\ndef ndcg_at_k(pred_ids: list[str], rel_grades: dict[str, int], k: int) -> float:\n    # TODO\n    pass",
    "aHint": "import math\n\ndef ndcg_at_k(pred_ids: list[str], rel_grades: dict[str, int], k: int) -> float:\n    def dcg(grades):\n        return sum(((2 ** g) - 1.0) / math.log2(i + 2) for i, g in enumerate(grades[:k]))\n    actual = dcg([rel_grades.get(did, 0) for did in pred_ids])\n    ideal = dcg(sorted(rel_grades.values(), reverse=True))\n    return round(actual / ideal, 4) if ideal > 0 else 0.0",
    "aTest": "grades = {\"d1\": 3, \"d2\": 2, \"d3\": 1}\nassert ndcg_at_k([\"d1\", \"d2\", \"d3\"], grades, 3) == 1.0\nsub = ndcg_at_k([\"d3\", \"d2\", \"d1\"], grades, 3)\nassert 0.6 < sub < 0.9\nassert ndcg_at_k([\"none\"], {}, 3) == 0.0\nprint('All checks passed.')"
  },
  {
    "day": 57,
    "fallbackTitle": "Embedding Drift Detection: Centroid Shift, Cosine Distribution PSI & Re-Indexing Triggers",
    "eTitle": "Embedding Centroid Drift & Distribution PSI Monitor",
    "eDesc": "Write `detect_embedding_drift(base_vecs: list[list[float]], live_vecs: list[list[float]], cos_shift_thresh: float = 0.05) -> dict`: compute L2-normalized centroid vectors of `base_vecs` and `live_vecs`, compute `centroid_cos_dist = 1 - cos(c_base, c_live)`, and flag `\"drifted\": centroid_cos_dist > cos_shift_thresh` (rounded to 6 decimals).",
    "eStarter": "import math\n\ndef detect_embedding_drift(base_vecs: list[list[float]], live_vecs: list[list[float]], cos_shift_thresh: float = 0.05) -> dict:\n    # TODO\n    pass",
    "eHint": "import math\n\ndef detect_embedding_drift(base_vecs: list[list[float]], live_vecs: list[list[float]], cos_shift_thresh: float = 0.05) -> dict:\n    def centroid(vs):\n        d = len(vs[0])\n        c = [sum(v[j] for v in vs) / len(vs) for j in range(d)]\n        n = math.sqrt(sum(x * x for x in c))\n        return [x / n for x in c] if n > 0 else c\n    cb, cl = centroid(base_vecs), centroid(live_vecs)\n    dist = round(1.0 - sum(a * b for a, b in zip(cb, cl)), 6)\n    return {\"cos_dist\": dist, \"drifted\": dist > cos_shift_thresh}",
    "eTest": "same = detect_embedding_drift([[1.0, 0.0], [1.0, 0.1]], [[1.0, 0.0], [1.0, 0.05]], 0.05)\nshifted = detect_embedding_drift([[1.0, 0.0]], [[0.0, 1.0]], 0.05)\nassert same[\"drifted\"] is False\nassert same[\"cos_dist\"] < 0.01\nassert shifted == {\"cos_dist\": 1.0, \"drifted\": True}\nprint('All checks passed.')",
    "aTitle": "Population Stability Index (PSI) Over Cosine-Similarity Histogram Buckets",
    "aDesc": "Write `compute_psi(base_probs: list[float], live_probs: list[float], eps: float = 1e-4) -> float`: clamp bin proportions below `eps` to `eps`, compute `sum((p_l - p_b) * ln(p_l / p_b))` rounded to 6 decimals.",
    "aStarter": "import math\n\ndef compute_psi(base_probs: list[float], live_probs: list[float], eps: float = 1e-4) -> float:\n    # TODO\n    pass",
    "aHint": "import math\n\ndef compute_psi(base_probs: list[float], live_probs: list[float], eps: float = 1e-4) -> float:\n    psi = 0.0\n    for pb, pl in zip(base_probs, live_probs):\n        p1, p2 = max(pb, eps), max(pl, eps)\n        psi += (p2 - p1) * math.log(p2 / p1)\n    return round(psi, 6)",
    "aTest": "assert compute_psi([0.5, 0.5], [0.5, 0.5]) == 0.0\np_big = compute_psi([0.8, 0.2], [0.2, 0.8])\nassert abs(p_big - 1.663553) < 1e-4\nassert compute_psi([0.5, 0.5], [0.55, 0.45]) < 0.05\nprint('All checks passed.')"
  },
  {
    "day": 58,
    "fallbackTitle": "Zero-Downtime Dual-Write Index Migrations & Shadow Recall Verification",
    "eTitle": "Zero-Downtime Alias Blue-Green Shadow Recall Cutover Gate",
    "eDesc": "Write `verify_blue_green_cutover(blue_hits: list[list[str]], green_hits: list[list[str]], k: int, min_overlap: float) -> dict`: compute mean top-K set overlap `|B & G| / min(k, len(B))` across queries, approving cutover (`\"cutover_approved\": bool`) iff `avg_overlap >= min_overlap`.",
    "eStarter": "def verify_blue_green_cutover(blue_hits: list[list[str]], green_hits: list[list[str]], k: int, min_overlap: float) -> dict:\n    # TODO\n    pass",
    "eHint": "def verify_blue_green_cutover(blue_hits: list[list[str]], green_hits: list[list[str]], k: int, min_overlap: float) -> dict:\n    if not blue_hits:\n        return {\"avg_overlap\": 1.0, \"cutover_approved\": True}\n    tot = 0.0\n    for b, g in zip(blue_hits, green_hits):\n        sb, sg = set(b[:k]), set(g[:k])\n        tot += (len(sb & sg) / len(sb)) if sb else 1.0\n    avg = round(tot / len(blue_hits), 4)\n    return {\"avg_overlap\": avg, \"cutover_approved\": avg >= min_overlap}",
    "eTest": "assert verify_blue_green_cutover([[\"a\", \"b\"]], [[\"a\", \"b\"]], 2, 0.95) == {\"avg_overlap\": 1.0, \"cutover_approved\": True}\nassert verify_blue_green_cutover([[\"a\", \"b\"]], [[\"c\", \"d\"]], 2, 0.95) == {\"avg_overlap\": 0.0, \"cutover_approved\": False}\nassert verify_blue_green_cutover([[\"a\", \"b\"], [\"c\", \"d\"]], [[\"a\", \"b\"], [\"c\", \"x\"]], 2, 0.7) == {\"avg_overlap\": 0.75, \"cutover_approved\": True}\nprint('All checks passed.')",
    "aTitle": "Dual-Write Reconciler with Vector Epoch Timestamp Conflict Resolution",
    "aDesc": "Write `dual_write_reconcile(ops: list[tuple[str, int, list[float]]], v1_store: dict, v2_store: dict) -> dict`: apply timestamped mutations `(doc_id, epoch, vec)` to BOTH stores only when `epoch` exceeds stored epoch per target, returning counts `{\"v1_applied\": int, \"v2_applied\": int}` while updating both dicts in place.",
    "aStarter": "def dual_write_reconcile(ops: list[tuple[str, int, list[float]]], v1_store: dict, v2_store: dict) -> dict:\n    # TODO\n    pass",
    "aHint": "def dual_write_reconcile(ops: list[tuple[str, int, list[float]]], v1_store: dict, v2_store: dict) -> dict:\n    c1 = c2 = 0\n    for did, ep, vec in ops:\n        if did not in v1_store or ep > v1_store[did][0]:\n            v1_store[did] = (ep, vec)\n            c1 += 1\n        if did not in v2_store or ep > v2_store[did][0]:\n            v2_store[did] = (ep, vec)\n            c2 += 1\n    return {\"v1_applied\": c1, \"v2_applied\": c2}",
    "aTest": "v1, v2 = {\"a\": (10, [1.0])}, {}\nr = dual_write_reconcile([(\"a\", 5, [0.0]), (\"a\", 12, [2.0])], v1, v2)\nassert r == {\"v1_applied\": 1, \"v2_applied\": 2}\nassert v1[\"a\"] == (12, [2.0]) and v2[\"a\"] == (12, [2.0])\nassert dual_write_reconcile([], v1, v2) == {\"v1_applied\": 0, \"v2_applied\": 0}\nprint('All checks passed.')"
  },
  {
    "day": 59,
    "fallbackTitle": "Capacity Planning: RAM/NVMe Footprint, QPS Saturation & Cost-per-Million Queries",
    "eTitle": "HNSW Memory & Shard Replica Capacity Planner",
    "eDesc": "Write `plan_hnsw_cluster(num_vecs: int, dim: int, hnsw_m: int, replicas: int, ram_per_node_gb: float, overhead_pct: float = 0.25) -> dict`: per-vector bytes = `(dim * 4 + hnsw_m * 2 * 4)` (fp32 + graph links at average `2*M` edges); multiply by `(1 + overhead_pct) * replicas`, compute `total_ram_gb` and `min_nodes = ceil(total_ram_gb / ram_per_node_gb)`.",
    "eStarter": "import math\n\ndef plan_hnsw_cluster(num_vecs: int, dim: int, hnsw_m: int, replicas: int, ram_per_node_gb: float, overhead_pct: float = 0.25) -> dict:\n    # TODO\n    pass",
    "eHint": "import math\n\ndef plan_hnsw_cluster(num_vecs: int, dim: int, hnsw_m: int, replicas: int, ram_per_node_gb: float, overhead_pct: float = 0.25) -> dict:\n    b_per = dim * 4 + hnsw_m * 2 * 4\n    tot_gb = (num_vecs * b_per * (1.0 + overhead_pct) * replicas) / (1024 ** 3)\n    return {\"total_ram_gb\": round(tot_gb, 2), \"min_nodes\": math.ceil(tot_gb / ram_per_node_gb)}",
    "eTest": "r = plan_hnsw_cluster(10000000, 1536, 16, 2, 64.0, 0.25)\nassert r[\"total_ram_gb\"] > 140.0\nassert r[\"min_nodes\"] == 3\nassert plan_hnsw_cluster(100000, 128, 16, 1, 64.0)[\"min_nodes\"] == 1\nprint('All checks passed.')",
    "aTitle": "Cost-Per-Million Queries & QPS Saturation Throughput Calculator",
    "aDesc": "Write `cost_per_million_queries(monthly_cluster_usd: float, sustained_qps: float, util_frac: float = 0.6) -> float`: monthly queries = `sustained_qps * util_frac * 30 * 86400`; return USD per 1M queries rounded to 4 decimals.",
    "aStarter": "def cost_per_million_queries(monthly_cluster_usd: float, sustained_qps: float, util_frac: float = 0.6) -> float:\n    # TODO\n    pass",
    "aHint": "def cost_per_million_queries(monthly_cluster_usd: float, sustained_qps: float, util_frac: float = 0.6) -> float:\n    mq = (sustained_qps * util_frac * 30 * 86400) / 1e6\n    return round(monthly_cluster_usd / mq, 4)",
    "aTest": "assert abs(cost_per_million_queries(1000.0, 100.0, 0.6) - 6.43) < 0.01\nassert cost_per_million_queries(1000.0, 200.0, 0.6) < cost_per_million_queries(1000.0, 100.0, 0.6)\nassert cost_per_million_queries(500.0, 50.0, 0.5) > 0.5\nprint('All checks passed.')"
  },
  {
    "day": 60,
    "fallbackTitle": "Milestone 12 Capstone: Cloud-Native Distributed Vector Database Engine",
    "eTitle": "Milestone 12A: Full Multi-Tenant Hybrid Vector DB Collection Engine",
    "eDesc": "Implement `MiniVectorDB`: `upsert(tenant, doc_id, vec, sparse)` stores/overwrites docs scoped strictly to `tenant`; `delete(tenant, doc_id)` removes doc from `tenant` only; `hybrid_search(tenant, q_vec, q_sparse, alpha, top_k)` returns top `top_k` `(doc_id, round(alpha*cos + (1-alpha)*sparse_dot, 6))`.",
    "eStarter": "import math\n\nclass MiniVectorDB:\n    def __init__(self):\n        # TODO\n        pass\n\n    def upsert(self, tenant: str, doc_id: str, vec: list[float], sparse: dict[str, float]):\n        # TODO\n        pass\n\n    def delete(self, tenant: str, doc_id: str):\n        # TODO\n        pass\n\n    def hybrid_search(self, tenant: str, q_vec: list[float], q_sparse: dict[str, float], alpha: float, top_k: int) -> list[tuple[str, float]]:\n        # TODO\n        pass",
    "eHint": "import math\n\nclass MiniVectorDB:\n    def __init__(self):\n        self.ns = {}\n\n    def upsert(self, tenant: str, doc_id: str, vec: list[float], sparse: dict[str, float]):\n        self.ns.setdefault(tenant, {})[doc_id] = (list(vec), dict(sparse))\n\n    def delete(self, tenant: str, doc_id: str):\n        if tenant in self.ns:\n            self.ns[tenant].pop(doc_id, None)\n\n    def hybrid_search(self, tenant: str, q_vec: list[float], q_sparse: dict[str, float], alpha: float, top_k: int) -> list[tuple[str, float]]:\n        nq = math.sqrt(sum(x * x for x in q_vec))\n        out = []\n        for did, (vec, sp) in self.ns.get(tenant, {}).items():\n            nv = math.sqrt(sum(x * x for x in vec))\n            cos = sum(a * b for a, b in zip(q_vec, vec)) / (nq * nv) if nq > 0 and nv > 0 else 0.0\n            sdot = sum(q_sparse.get(k, 0.0) * v for k, v in sp.items())\n            out.append((did, round(alpha * cos + (1.0 - alpha) * sdot, 6)))\n        return sorted(out, key=lambda x: (-x[1], x[0]))[:top_k]",
    "eTest": "db = MiniVectorDB()\ndb.upsert(\"t1\", \"d1\", [1.0, 0.0], {\"ai\": 2.0})\ndb.upsert(\"t2\", \"d_other\", [1.0, 0.0], {\"ai\": 9.0})\nassert db.hybrid_search(\"t1\", [1.0, 0.0], {\"ai\": 1.0}, 0.5, 5) == [(\"d1\", 1.5)]\ndb.delete(\"t1\", \"d1\")\nassert db.hybrid_search(\"t1\", [1.0, 0.0], {\"ai\": 1.0}, 0.5, 5) == []\nassert db.hybrid_search(\"t2\", [1.0, 0.0], {\"ai\": 1.0}, 0.5, 5) == [(\"d_other\", 5.0)]\nprint('All checks passed.')",
    "aTitle": "Milestone 12B: Production Retrieval Readiness SLA & Telemetry Gate",
    "aDesc": "Write `check_vectordb_readiness(recall_k: float, p99_ms: float, drift_psi: float) -> tuple[bool, list[str]]`: enforce `recall_k >= 0.92` (`\"low_recall\"`), `p99_ms <= 50.0` (`\"sla_latency_breach\"`), and `drift_psi <= 0.20` (`\"embedding_drift\"`). Return `(passed, sorted_violations)`.",
    "aStarter": "def check_vectordb_readiness(recall_k: float, p99_ms: float, drift_psi: float) -> tuple[bool, list[str]]:\n    # TODO\n    pass",
    "aHint": "def check_vectordb_readiness(recall_k: float, p99_ms: float, drift_psi: float) -> tuple[bool, list[str]]:\n    errs = []\n    if recall_k < 0.92: errs.append(\"low_recall\")\n    if p99_ms > 50.0: errs.append(\"sla_latency_breach\")\n    if drift_psi > 0.20: errs.append(\"embedding_drift\")\n    errs.sort()\n    return (len(errs) == 0), errs",
    "aTest": "assert check_vectordb_readiness(0.95, 25.0, 0.08) == (True, [])\nassert check_vectordb_readiness(0.85, 65.0, 0.3) == (False, [\"embedding_drift\", \"low_recall\", \"sla_latency_breach\"])\nassert check_vectordb_readiness(0.92, 50.0, 0.20) == (True, [])\nprint('All checks passed.')"
  }
];

const indexByDay = new Map((MONTH2_LESSON_INDEX['vec-py'] || []).map((entry) => [entry.day, entry]));

export const VECTOR_PYTHON_MONTH2_CONFIGS: DayConfig[] = RAW_M2_DAY_TASKS.map((t) => {
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

export const VECTOR_PYTHON_MONTH2_QUESTS: CourseQuest[] = VECTOR_PYTHON_MONTH2_CONFIGS.flatMap((cfg) =>
  buildEnrichedDayQuests('vec-py', cfg.day!, cfg)
);
