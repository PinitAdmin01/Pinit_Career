import { buildEnrichedDayQuests, DayConfig } from './curriculumEnricher';
import { CourseQuest } from './coursesData';
import { VECTOR_DAYS } from './vectorPythonDays';

/**
 * Vector Search Engines in Python (course-vector-python), for the Python track.
 *
 * A Python-first course: the 30 days are in vectorPythonDays.ts and every practice task is written and
 * checked in Python. The lessons are the long Python lessons (longLessons.ts).
 * Checks are plain `assert` statements run after the student's code; the reference answers live in
 * tests/fixtures/vector_python_solutions.json, not here, so students never download them.
 */
type Task = { title: string; desc: string; starter: string; hint: string; test: string };
type Day = { e: Task; a: Task };

const DAYS: Day[] = [
  {
    "e": {
      "title": "Bag-of-Words Vector",
      "desc": "Write `bow_vector(text, vocab)` returning a list with one count per vocabulary word (in vocab order): how many times that word appears in the text. Tokens are the lower-case matches of re.findall(r'[a-z0-9]+', text.lower()). Words not in the vocabulary are ignored.",
      "starter": "import re\n\n\ndef bow_vector(text, vocab):\n    pass",
      "hint": "tokens = re.findall(r'[a-z0-9]+', text.lower()); [tokens.count(w) for w in vocab]",
      "test": "vocab = ['cat', 'dog', 'sat', 'mat']\nassert bow_vector('The cat sat on the mat.', vocab) == [1, 0, 1, 1], f\"Got {bow_vector('The cat sat on the mat.', vocab)}\"\nassert bow_vector('Dog! DOG? dog.', vocab) == [0, 3, 0, 0], 'Case and punctuation ignored'\nassert bow_vector('', vocab) == [0, 0, 0, 0], 'Empty text'\nassert bow_vector('catalogue cats', vocab) == [0, 0, 0, 0], 'Whole tokens only'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Hashing-Trick Embedding",
      "desc": "Write `hashed_vector(text, dims)` that maps each token (re.findall(r'[a-z0-9]+', text.lower())) to a bucket int(hashlib.md5(token.encode()).hexdigest(), 16) % dims, counts tokens per bucket, and returns the vector scaled to unit length (divide by its Euclidean norm), each value rounded to 4 decimals. An empty text returns all zeros. (Python's built-in hash() changes between runs, so md5 is used for a stable bucket.)",
      "starter": "import hashlib\nimport math\nimport re\n\n\ndef hashed_vector(text, dims):\n    pass",
      "hint": "Count per bucket first, then norm = math.sqrt(sum(v * v for v in counts)).",
      "test": "import hashlib\nv = hashed_vector('search engines search', 8)\nassert len(v) == 8, 'One value per dimension'\nassert abs(sum(x * x for x in v) - 1) < 1e-3, f'Unit length: {v}'\nb = int(hashlib.md5(b'search').hexdigest(), 16) % 8\nassert max(v) == v[b], 'The repeated word has the largest value'\nassert hashed_vector('', 4) == [0.0, 0.0, 0.0, 0.0], 'Empty text'\nassert hashed_vector('Search ENGINES search', 8) == v, 'Case-insensitive and repeatable'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Cosine Similarity",
      "desc": "Write `cosine(a, b)` returning dot(a, b) / (|a| × |b|) rounded to 4 decimals, or 0.0 if either vector has zero length. Raise ValueError if the vectors have different lengths.",
      "starter": "import math\n\n\ndef cosine(a, b):\n    pass",
      "hint": "dot = sum(x * y for x, y in zip(a, b)); norms with math.sqrt(sum(x * x ...))",
      "test": "assert cosine([1, 0], [0, 1]) == 0.0, 'Perpendicular'\nassert cosine([1, 2], [2, 4]) == 1.0, 'Same direction, different length'\nassert cosine([1, 0], [-1, 0]) == -1.0, 'Opposite'\nassert cosine([1, 1, 0], [1, 0, 1]) == 0.5, f'Got {cosine([1, 1, 0], [1, 0, 1])}'\nassert cosine([0, 0], [1, 2]) == 0.0, 'Zero vector'\ntry:\n    cosine([1, 2], [1, 2, 3])\n    raise AssertionError('different lengths must raise ValueError')\nexcept ValueError:\n    pass\nprint('All checks passed.')"
    },
    "a": {
      "title": "Rank by Any Metric",
      "desc": "Write `rank(query, docs, metric)` returning the indices of docs from most to least similar to the query. metric is 'dot' (higher is better), 'cosine' (higher is better, zero vectors score 0) or 'euclidean' (smaller distance is better). Ties go to the lower index. Raise ValueError for other metrics.",
      "starter": "import math\n\n\ndef rank(query, docs, metric):\n    pass",
      "hint": "Turn every metric into a score where bigger is better (for euclidean use minus the distance), then sort by (-score, index).",
      "test": "q = [1.0, 0.0]\ndocs = [[2.0, 0.0], [0.5, 0.5], [10.0, 10.0], [0.9, 0.1]]\nassert rank(q, docs, 'dot') == [2, 0, 3, 1], f\"dot: {rank(q, docs, 'dot')}\"\nassert rank(q, docs, 'cosine') == [0, 3, 1, 2], f\"cosine: {rank(q, docs, 'cosine')}\"\nassert rank(q, docs, 'euclidean') == [3, 1, 0, 2], f\"euclidean: {rank(q, docs, 'euclidean')}\"\ntry:\n    rank(q, docs, 'manhattan')\n    raise AssertionError('unknown metric must raise ValueError')\nexcept ValueError:\n    pass\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Exact k-NN Search",
      "desc": "Write `knn(query, vectors, k)` returning a list of (index, score) pairs for the k vectors with the highest cosine similarity to the query, best first, ties to the lower index, scores rounded to 4 decimals. Zero vectors score 0.0. If k is larger than the number of vectors, return them all.",
      "starter": "import math\n\n\ndef knn(query, vectors, k):\n    pass",
      "hint": "Score everything, sort by (-score, index), then take the first k.",
      "test": "vecs = [[1, 0], [0, 1], [1, 1], [0, 0], [2, 0.1]]\nassert knn([1, 0], vecs, 2) == [(0, 1.0), (4, 0.9988)], f'Got {knn([1, 0], vecs, 2)}'\nassert knn([0, 1], vecs, 3) == [(1, 1.0), (2, 0.7071), (4, 0.0499)], f'Got {knn([0, 1], vecs, 3)}'\nassert len(knn([1, 1], vecs, 10)) == 5, 'k larger than the collection'\nassert knn([1, 1], [], 3) == [], 'Empty collection'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Normalise Once, Search with Dot",
      "desc": "Vector databases often store unit-length vectors so that a plain dot product equals cosine similarity. Write `normalize_all(vectors)` returning each vector divided by its Euclidean length (values rounded to 6 decimals; a zero vector stays all zeros), and `dot_search(query, unit_vectors, k)` that normalises the query and returns the indices of the k highest dot products, ties to the lower index.",
      "starter": "import math\n\n\ndef normalize_all(vectors):\n    pass\n\n\ndef dot_search(query, unit_vectors, k):\n    pass",
      "hint": "Reuse normalize_all([query])[0] inside dot_search.",
      "test": "units = normalize_all([[3, 4], [0, 2], [0, 0], [1, 1]])\nassert units == [[0.6, 0.8], [0.0, 1.0], [0.0, 0.0], [0.707107, 0.707107]], f'Got {units}'\nassert dot_search([10, 0], units, 2) == [3, 0], f'Got {dot_search([10, 0], units, 2)}'\nassert dot_search([0, 5], units, 1) == [1], 'Straight up'\nassert dot_search([1, 1], units, 4) == [3, 0, 1, 2], f'Got {dot_search([1, 1], units, 4)}'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Heap Top-k",
      "desc": "Write `top_k(scores, k)` that uses heapq to return the k best (index, score) pairs from a list of scores, highest score first, ties to the lower index. Use a heap of size at most k (heapq.nlargest or a manual min-heap are both fine).",
      "starter": "import heapq\n\n\ndef top_k(scores, k):\n    pass",
      "hint": "heapq.nlargest(k, range(len(scores)), key=lambda i: (scores[i], -i))",
      "test": "s = [0.2, 0.9, 0.5, 0.9, 0.1]\nassert top_k(s, 3) == [(1, 0.9), (3, 0.9), (2, 0.5)], f'Got {top_k(s, 3)}'\nassert top_k(s, 1) == [(1, 0.9)], 'Tie goes to the lower index'\nassert top_k(s, 0) == [], 'k = 0'\nassert top_k([], 3) == [], 'No scores'\nassert len(top_k(list(range(1000)), 5)) == 5, 'Only k results'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Merge Shard Results",
      "desc": "Each shard returns its own top results as a list of (doc_id, score) pairs. Write `merge_results(shard_lists, k)` returning the global top k pairs, highest score first, ties by doc_id (string order). If a doc_id appears on several shards (a replica), keep only its highest score.",
      "starter": "def merge_results(shard_lists, k):\n    pass",
      "hint": "Collect the best score per doc_id in a dict, then sort by (-score, doc_id).",
      "test": "a = [('d1', 0.91), ('d7', 0.80)]\nb = [('d3', 0.95), ('d1', 0.85)]\nc = [('d9', 0.80)]\nassert merge_results([a, b, c], 3) == [('d3', 0.95), ('d1', 0.91), ('d7', 0.8)], f'Got {merge_results([a, b, c], 3)}'\nassert merge_results([a, b, c], 10) == [('d3', 0.95), ('d1', 0.91), ('d7', 0.8), ('d9', 0.8)], 'Tie by id'\nassert merge_results([], 3) == [], 'No shards'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Recall and Precision at k",
      "desc": "Write `recall_at_k(retrieved, relevant, k)` = (number of relevant items in the first k retrieved) ÷ len(relevant), and `precision_at_k(retrieved, relevant, k)` = the same count ÷ k. Round both to 4 decimals. If relevant is empty, recall is 0.0; if k is 0, precision is 0.0.",
      "starter": "def recall_at_k(retrieved, relevant, k):\n    pass\n\n\ndef precision_at_k(retrieved, relevant, k):\n    pass",
      "hint": "hits = len(set(retrieved[:k]) & set(relevant))",
      "test": "r = ['d3', 'd1', 'd9', 'd4', 'd2']\nrel = {'d1', 'd2', 'd5'}\nassert recall_at_k(r, rel, 3) == 0.3333, f'Got {recall_at_k(r, rel, 3)}'\nassert recall_at_k(r, rel, 5) == 0.6667, 'Two of three found'\nassert precision_at_k(r, rel, 5) == 0.4, 'Two of five are relevant'\nassert precision_at_k(r, rel, 1) == 0.0, 'The top result is not relevant'\nassert recall_at_k(r, set(), 3) == 0.0 and precision_at_k(r, rel, 0) == 0.0, 'Edge cases'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Mean Reciprocal Rank",
      "desc": "Write `mrr(results)` where results is a list of (retrieved_list, relevant_set) pairs, one per query. For each query, the reciprocal rank is 1 ÷ (position of the first relevant item, counting from 1), or 0 if none is retrieved. Return the mean over queries rounded to 4 decimals (0.0 for no queries).",
      "starter": "def mrr(results):\n    pass",
      "hint": "for pos, doc in enumerate(retrieved, 1): if doc in relevant: rr = 1 / pos; break",
      "test": "q1 = (['a', 'b', 'c'], {'a'})\nq2 = (['a', 'b', 'c'], {'c'})\nq3 = (['x', 'y'], {'z'})\nassert mrr([q1]) == 1.0, 'First place'\nassert mrr([q1, q2]) == 0.6667, f'Got {mrr([q1, q2])}'\nassert mrr([q1, q2, q3]) == 0.4444, f'Got {mrr([q1, q2, q3])}'\nassert mrr([]) == 0.0, 'No queries'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Inverted Index",
      "desc": "Write `build_index(docs)` where docs is a list of strings. Tokenise each with re.findall(r'[a-z0-9]+', text.lower()) and return a dict mapping each term to the sorted list of document indices that contain it (each index once). Also write `and_query(index, terms)` returning the sorted indices of documents containing every term (an empty list if any term is missing or terms is empty).",
      "starter": "import re\n\n\ndef build_index(docs):\n    pass\n\n\ndef and_query(index, terms):\n    pass",
      "hint": "Use a dict of sets while building, then convert to sorted lists; intersect sets for the AND query.",
      "test": "docs = ['Fast vector search', 'Keyword search with BM25', 'Vector databases store vectors']\nidx = build_index(docs)\nassert idx['search'] == [0, 1] and idx['vector'] == [0, 2], f'Got {idx}'\nassert idx['vectors'] == [2], 'Each index once, exact token'\nassert and_query(idx, ['vector', 'search']) == [0], 'Both terms'\nassert and_query(idx, ['search', 'missing']) == [], 'Missing term'\nassert and_query(idx, []) == [], 'No terms'\nprint('All checks passed.')"
    },
    "a": {
      "title": "BM25 Scoring",
      "desc": "Write `bm25(query_terms, docs_terms, k1=1.5, b=0.75)` where docs_terms is a list of token lists. For each document return its BM25 score (rounded to 4 decimals): the sum over query terms of idf × tf × (k1 + 1) ÷ (tf + k1 × (1 − b + b × len(doc) ÷ avgdl)), with idf = ln((N − n + 0.5) ÷ (n + 0.5) + 1), N the number of documents, n the number containing the term, tf the term's count in the document and avgdl the average document length. Terms that appear nowhere add 0.",
      "starter": "import math\n\n\ndef bm25(query_terms, docs_terms, k1=1.5, b=0.75):\n    pass",
      "hint": "Precompute N, avgdl and n for each query term; then loop over documents.",
      "test": "docs = [['vector', 'search', 'engine'], ['keyword', 'search'], ['vector', 'vector', 'database', 'index', 'store']]\ns = bm25(['vector'], docs)\nassert s == [0.4922, 0.0, 0.5785], f'Got {s}'\ns2 = bm25(['vector', 'search'], docs)\nassert s2 == [0.9843, 0.5732, 0.5785], f'Got {s2}'\nassert bm25(['missing'], docs) == [0.0, 0.0, 0.0], 'Unknown term'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Reciprocal Rank Fusion",
      "desc": "Write `rrf(rankings, k=60)` where rankings is a list of ranked lists of document ids. Each document scores the sum of 1 ÷ (k + rank) over the lists it appears in (rank counted from 1). Return the document ids sorted by fused score, highest first, ties by id (string order).",
      "starter": "def rrf(rankings, k=60):\n    pass",
      "hint": "scores[doc] = scores.get(doc, 0) + 1 / (k + rank) for rank, doc in enumerate(lst, 1)",
      "test": "dense = ['d2', 'd1', 'd3']\nsparse = ['d1', 'd4', 'd2']\nassert rrf([dense, sparse]) == ['d1', 'd2', 'd4', 'd3'], f'Got {rrf([dense, sparse])}'\nassert rrf([dense]) == dense, 'One list keeps its order'\nassert rrf([['a', 'b'], ['b', 'a']]) == ['a', 'b'], 'Tie by id'\nassert rrf([]) == [], 'Nothing to fuse'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Weighted Score Fusion",
      "desc": "Write `weighted_fusion(dense, sparse, alpha)` where dense and sparse map doc ids to raw scores. Min-max normalise each dict separately to 0..1 (if all its scores are equal, they all become 1.0), treat a missing document as 0 in that source, and combine: alpha × dense + (1 − alpha) × sparse. Return a list of (doc_id, score rounded to 4 decimals), best first, ties by id.",
      "starter": "def weighted_fusion(dense, sparse, alpha):\n    pass",
      "hint": "Write a small normalise(d) helper: (v - lo) / (hi - lo), or 1.0 when hi == lo.",
      "test": "dense = {'a': 0.9, 'b': 0.7, 'c': 0.5}\nsparse = {'b': 12.0, 'd': 4.0}\nr = weighted_fusion(dense, sparse, 0.5)\nassert r == [('b', 0.75), ('a', 0.5), ('c', 0.0), ('d', 0.0)], f'Got {r}'\nassert weighted_fusion(dense, sparse, 1.0)[0] == ('a', 1.0), 'Dense only'\nassert weighted_fusion({'x': 3.0}, {}, 0.5) == [('x', 0.5)], 'Single score normalises to 1.0'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Word Chunks with Overlap",
      "desc": "Write `chunk_words(text, size, overlap)` that splits text on whitespace into words and returns chunks of `size` words joined by single spaces, each new chunk starting size − overlap words after the previous one. Stop once a chunk reaches the last word. Raise ValueError unless 0 <= overlap < size.",
      "starter": "def chunk_words(text, size, overlap):\n    pass",
      "hint": "step = size - overlap; for start in range(0, len(words), step): take words[start:start + size]; break after the chunk that includes the last word.",
      "test": "text = 'one two three four five six seven'\nassert chunk_words(text, 3, 1) == ['one two three', 'three four five', 'five six seven'], f'Got {chunk_words(text, 3, 1)}'\nassert chunk_words(text, 4, 0) == ['one two three four', 'five six seven'], 'No overlap'\nassert chunk_words('a b', 5, 2) == ['a b'], 'Short text: one chunk'\nassert chunk_words('', 3, 1) == [], 'Empty text'\nfor bad in [(3, 3), (3, -1)]:\n    try:\n        chunk_words(text, *bad)\n        raise AssertionError(f'{bad} must raise ValueError')\n    except ValueError:\n        pass\nprint('All checks passed.')"
    },
    "a": {
      "title": "Sentence-Aware Chunks",
      "desc": "Write `chunk_sentences(text, max_words)` that splits text into sentences with re.split(r'(?<=[.!?])\\s+', text.strip()) (dropping empty strings), then packs consecutive sentences into chunks of at most max_words words. A single sentence longer than max_words becomes a chunk on its own. Return the list of chunk strings (sentences joined by a space).",
      "starter": "import re\n\n\ndef chunk_sentences(text, max_words):\n    pass",
      "hint": "Keep a current list and its word count; start a new chunk when adding the next sentence would exceed max_words.",
      "test": "text = 'Vectors capture meaning. Search finds neighbours quickly! Indexes trade recall for speed. Done?'\nr = chunk_sentences(text, 6)\nassert r == ['Vectors capture meaning.', 'Search finds neighbours quickly!', 'Indexes trade recall for speed. Done?'], f'Got {r}'\nassert chunk_sentences(text, 100) == [text], 'Everything fits in one chunk'\nassert chunk_sentences('This single sentence is much too long for the limit.', 3) == ['This single sentence is much too long for the limit.'], 'Long sentence alone'\nassert chunk_sentences('   ', 5) == [], 'Empty text'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Pre-filtered Search",
      "desc": "Write `filtered_search(query, items, where, k)` where items is a list of dicts {'id', 'vector', 'meta'}. Keep only items whose meta has every key in `where` with an equal value, rank them by cosine similarity to the query (zero vectors score 0), and return the ids of the best k, ties by id.",
      "starter": "import math\n\n\ndef filtered_search(query, items, where, k):\n    pass",
      "hint": "matches = [it for it in items if all(it['meta'].get(key) == val for key, val in where.items())]",
      "test": "items = [\n    {'id': 'a', 'vector': [1, 0], 'meta': {'lang': 'en', 'year': 2024}},\n    {'id': 'b', 'vector': [0.9, 0.1], 'meta': {'lang': 'fr', 'year': 2024}},\n    {'id': 'c', 'vector': [0.5, 0.5], 'meta': {'lang': 'en', 'year': 2023}},\n    {'id': 'd', 'vector': [0, 1], 'meta': {'lang': 'en', 'year': 2024}},\n]\nassert filtered_search([1, 0], items, {'lang': 'en'}, 2) == ['a', 'c'], f\"Got {filtered_search([1, 0], items, {'lang': 'en'}, 2)}\"\nassert filtered_search([1, 0], items, {'lang': 'en', 'year': 2024}, 5) == ['a', 'd'], 'Two conditions'\nassert filtered_search([1, 0], items, {}, 2) == ['a', 'b'], 'No filter'\nassert filtered_search([1, 0], items, {'lang': 'de'}, 2) == [], 'Nothing matches'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Post-filtering Pitfall",
      "desc": "Post-filtering first takes the top fetch_k results, then removes those that fail the filter, which can leave fewer than k. Write `post_filter(ranked_ids, meta, where, k, fetch_k)` returning (ids, complete): the first k ids among ranked_ids[:fetch_k] that match `where` (meta maps id to a dict), and complete = True if k results were found.",
      "starter": "def post_filter(ranked_ids, meta, where, k, fetch_k):\n    pass",
      "hint": "Loop over ranked_ids[:fetch_k], keep matches, stop at k.",
      "test": "ranked = ['a', 'b', 'c', 'd', 'e', 'f']\nmeta = {'a': {'lang': 'fr'}, 'b': {'lang': 'fr'}, 'c': {'lang': 'en'}, 'd': {'lang': 'fr'}, 'e': {'lang': 'en'}, 'f': {'lang': 'en'}}\nassert post_filter(ranked, meta, {'lang': 'en'}, 2, 4) == (['c'], False), f\"Got {post_filter(ranked, meta, {'lang': 'en'}, 2, 4)}\"\nassert post_filter(ranked, meta, {'lang': 'en'}, 2, 6) == (['c', 'e'], True), 'Fetch more to fill k'\nassert post_filter(ranked, meta, {}, 3, 6) == (['a', 'b', 'c'], True), 'No filter'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Assign to Nearest Centroid",
      "desc": "Write `assign(points, centroids)` returning, for each point, the index of the nearest centroid by squared Euclidean distance, ties to the lower index.",
      "starter": "def assign(points, centroids):\n    pass",
      "hint": "min(range(len(centroids)), key=lambda c: (sqdist(p, centroids[c]), c))",
      "test": "cents = [[0, 0], [10, 10]]\nassert assign([[1, 1], [9, 8], [5, 5]], cents) == [0, 1, 0], f'Got {assign([[1, 1], [9, 8], [5, 5]], cents)}'\nassert assign([[6, 6]], cents) == [1], 'Closer to the second'\nassert assign([], cents) == [], 'No points'\nprint('All checks passed.')"
    },
    "a": {
      "title": "k-Means",
      "desc": "Write `kmeans(points, k, iters)`: start with the first k points as centroids; on each iteration assign every point to its nearest centroid (squared Euclidean, ties to the lower index), then move each centroid to the mean of its points (a centroid with no points stays where it is). Return (centroids rounded to 4 decimals, final assignments).",
      "starter": "def kmeans(points, k, iters):\n    pass",
      "hint": "After the loop, recompute the assignments once more so they match the final centroids.",
      "test": "pts = [[0, 0], [10, 10], [1, 0], [0, 1], [9, 10], [10, 9]]\nc, a = kmeans(pts, 2, 5)\nassert c == [[0.3333, 0.3333], [9.6667, 9.6667]], f'Got {c}'\nassert a == [0, 1, 0, 0, 1, 1], f'Got {a}'\nc1, _ = kmeans([[0, 0], [2, 0], [4, 0]], 2, 1)\nassert c1 == [[0.0, 0.0], [3.0, 0.0]], f'One iteration: {c1}'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Build IVF Lists",
      "desc": "Write `ivf_build(vectors, centroids)` returning a dict mapping each centroid index (every index, even if empty) to the list of vector indices assigned to it (nearest by squared Euclidean distance, ties to the lower centroid), in increasing order.",
      "starter": "def ivf_build(vectors, centroids):\n    pass",
      "hint": "lists = {c: [] for c in range(len(centroids))}; append each vector index to its nearest centroid's list.",
      "test": "cents = [[0, 0], [10, 0], [0, 10]]\nvecs = [[1, 1], [9, 1], [0, 9], [2, 0], [8, 0]]\nassert ivf_build(vecs, cents) == {0: [0, 3], 1: [1, 4], 2: [2]}, f'Got {ivf_build(vecs, cents)}'\nassert ivf_build([], cents) == {0: [], 1: [], 2: []}, 'Empty lists kept'\nprint('All checks passed.')"
    },
    "a": {
      "title": "IVF Search with nprobe",
      "desc": "Write `ivf_search(query, vectors, centroids, lists, nprobe, k)`: choose the nprobe centroids nearest to the query (squared Euclidean, ties to the lower index), gather the vector indices from their lists, and return the k nearest of those candidates (squared Euclidean, ties to the lower index) as a list of indices.",
      "starter": "def ivf_search(query, vectors, centroids, lists, nprobe, k):\n    pass",
      "hint": "probe = sorted(range(len(centroids)), key=...)[:nprobe]; candidates = [i for c in probe for i in lists[c]]",
      "test": "cents = [[0, 0], [10, 0], [0, 10]]\nvecs = [[1, 1], [9, 1], [0, 9], [2, 0], [8, 0], [4, 1]]\nlists = {0: [0, 3, 5], 1: [1, 4], 2: [2]}\nassert ivf_search([6, 0], vecs, cents, lists, 1, 2) == [4, 1], f'nprobe 1 misses vector 5: {ivf_search([6, 0], vecs, cents, lists, 1, 2)}'\nassert ivf_search([6, 0], vecs, cents, lists, 2, 2) == [4, 5], f'nprobe 2: {ivf_search([6, 0], vecs, cents, lists, 2, 2)}'\nassert ivf_search([0, 10], vecs, cents, lists, 1, 5) == [2], 'Only one candidate in that list'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Product Quantization Encoder",
      "desc": "Write `pq_encode(vector, codebooks)` where codebooks is a list of m codebooks, each a list of codewords (lists) of equal sub-vector length. Split the vector into m consecutive equal parts, and for each part return the index of the nearest codeword in its codebook (squared Euclidean, ties to the lower index). Raise ValueError if the vector length is not m × the sub-vector length.",
      "starter": "def pq_encode(vector, codebooks):\n    pass",
      "hint": "d = len(codebooks[0][0]); part j is vector[j * d:(j + 1) * d]",
      "test": "books = [[[0, 0], [1, 1], [5, 5]], [[0, 0], [2, 0], [0, 2]]]\nassert pq_encode([0.9, 1.2, 1.8, 0.1], books) == [1, 1], f'Got {pq_encode([0.9, 1.2, 1.8, 0.1], books)}'\nassert pq_encode([4, 6, 0, 3], books) == [2, 2], 'Nearest codewords'\nassert pq_encode([0, 0, 1, 1], books) == [0, 0], f'Tie goes to index 0: {pq_encode([0, 0, 1, 1], books)}'\ntry:\n    pq_encode([1, 2, 3], books)\n    raise AssertionError('wrong length must raise ValueError')\nexcept ValueError:\n    pass\nprint('All checks passed.')"
    },
    "a": {
      "title": "Asymmetric PQ Distance",
      "desc": "Write `pq_distance(query, codes, codebooks)` returning the approximate squared Euclidean distance between a full query vector and a PQ-encoded vector: the sum over parts j of the squared distance between the query's part j and codebooks[j][codes[j]], rounded to 4 decimals. Then write `pq_rank(query, all_codes, codebooks)` returning the indices of the encoded vectors from nearest to farthest (ties to the lower index).",
      "starter": "def pq_distance(query, codes, codebooks):\n    pass\n\n\ndef pq_rank(query, all_codes, codebooks):\n    pass",
      "hint": "d = len(codebooks[0][0]); compare query[j * d:(j + 1) * d] with the chosen codeword.",
      "test": "books = [[[0, 0], [1, 1], [5, 5]], [[0, 0], [2, 0], [0, 2]]]\nassert pq_distance([1, 1, 2, 0], [1, 1], books) == 0.0, 'Exact codewords'\nassert pq_distance([0.5, 0.5, 1, 1], [1, 2], books) == 2.5, f'Got {pq_distance([0.5, 0.5, 1, 1], [1, 2], books)}'\ncodes = [[2, 0], [1, 1], [0, 2]]\nassert pq_rank([1, 1, 2, 0], codes, books) == [1, 2, 0], f'Got {pq_rank([1, 1, 2, 0], codes, books)}'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Scalar Quantization to 8 Bits",
      "desc": "Write `sq_fit(vectors)` returning (mins, maxs), the per-dimension minimum and maximum over all vectors, and `sq_encode(vector, mins, maxs)` returning one integer 0..255 per dimension: round((x − min) ÷ (max − min) × 255), clamped to 0..255 (use 0 when max == min). Write `sq_decode(codes, mins, maxs)` returning min + code ÷ 255 × (max − min), rounded to 4 decimals.",
      "starter": "def sq_fit(vectors):\n    pass\n\n\ndef sq_encode(vector, mins, maxs):\n    pass\n\n\ndef sq_decode(codes, mins, maxs):\n    pass",
      "hint": "mins = [min(col) for col in zip(*vectors)]; clamp with max(0, min(255, value)).",
      "test": "vecs = [[0.0, -1.0], [1.0, 1.0], [0.5, 0.0]]\nmins, maxs = sq_fit(vecs)\nassert (mins, maxs) == ([0.0, -1.0], [1.0, 1.0]), f'Got {(mins, maxs)}'\nassert sq_encode([0.5, 0.0], mins, maxs) == [128, 128], f'Got {sq_encode([0.5, 0.0], mins, maxs)}'\nassert sq_encode([2.0, -5.0], mins, maxs) == [255, 0], 'Clamped'\nassert sq_decode([255, 0], mins, maxs) == [1.0, -1.0], 'Ends decode exactly'\nassert sq_encode([3.0], [3.0], [3.0]) == [0], 'Constant dimension'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Binary Codes and Hamming Distance",
      "desc": "Write `binarize(vector)` returning an integer whose bit i (counting from the least significant bit) is 1 when vector[i] > 0, and `hamming(a, b)` returning the number of differing bits (bin(a ^ b).count('1')). Then write `hamming_rank(query, codes)` that binarises the query and returns the indices of codes from smallest to largest Hamming distance, ties to the lower index.",
      "starter": "def binarize(vector):\n    pass\n\n\ndef hamming(a, b):\n    pass\n\n\ndef hamming_rank(query, codes):\n    pass",
      "hint": "code |= 1 << i for every positive value at position i.",
      "test": "assert binarize([0.3, -0.2, 0.0, 1.5]) == 9, f'Bits 0 and 3: got {binarize([0.3, -0.2, 0.0, 1.5])}'\nassert binarize([-1, -1]) == 0, 'All negative'\nassert hamming(0b1010, 0b0110) == 2, 'Two bits differ'\ncodes = [binarize(v) for v in [[1, 1, -1, -1], [1, -1, 1, -1], [-1, -1, -1, 1]]]\nassert hamming_rank([0.5, 0.9, -0.3, 0.1], codes) == [0, 2, 1], f'Got {hamming_rank([0.5, 0.9, -0.3, 0.1], codes)}'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Random Hyperplane Hash",
      "desc": "Write `lsh_signature(vector, planes)` returning a string with one character per plane: '1' if the dot product of the vector and the plane is >= 0, otherwise '0'. Similar vectors fall on the same side of most planes, so they tend to share signatures.",
      "starter": "def lsh_signature(vector, planes):\n    pass",
      "hint": "''.join('1' if sum(v * p for v, p in zip(vector, plane)) >= 0 else '0' for plane in planes)",
      "test": "planes = [[1, 0], [0, 1], [1, -1]]\nassert lsh_signature([2, 1], planes) == '111', f'Got {lsh_signature([2, 1], planes)}'\nassert lsh_signature([-1, 2], planes) == '010', f'Got {lsh_signature([-1, 2], planes)}'\nassert lsh_signature([0, 0], planes) == '111', 'Zero dot product counts as 1'\nassert lsh_signature([2.1, 1.1], planes) == lsh_signature([2, 1], planes), 'Similar vectors share a signature'\nprint('All checks passed.')"
    },
    "a": {
      "title": "LSH Candidates from Several Tables",
      "desc": "Write `lsh_candidates(query, vectors, tables)` where tables is a list of plane sets (each a list of planes). A vector is a candidate if its signature equals the query's signature in at least one table. Return the sorted list of candidate indices.",
      "starter": "def lsh_candidates(query, vectors, tables):\n    pass",
      "hint": "For each table, compute the query signature once and compare it with each vector's signature.",
      "test": "t1 = [[1, 0], [0, 1]]\nt2 = [[1, 1], [1, -1]]\nvecs = [[1, 1], [-1, 1], [1, -1], [3, 0.5], [-2, -2]]\nassert lsh_candidates([2, 1], vecs, [t1]) == [0, 3], f'Got {lsh_candidates([2, 1], vecs, [t1])}'\nassert lsh_candidates([2, 1], vecs, [t1, t2]) == [0, 2, 3], f'More tables, more candidates: {lsh_candidates([2, 1], vecs, [t1, t2])}'\nassert lsh_candidates([2, 1], [], [t1]) == [], 'No vectors'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Greedy Graph Search",
      "desc": "Write `greedy_search(graph, vectors, query, entry)` where graph maps each node to a list of neighbour nodes. Starting at entry, repeatedly move to the neighbour closest to the query (squared Euclidean, ties to the lower node number) if it is closer than the current node; stop when no neighbour is closer. Return (final_node, path) where path lists every node visited, starting with entry.",
      "starter": "def greedy_search(graph, vectors, query, entry):\n    pass",
      "hint": "Loop: best = min(graph[current], key=lambda n: (dist(n), n)); if dist(best) < dist(current): move, else stop.",
      "test": "vecs = {0: [0, 0], 1: [2, 0], 2: [4, 0], 3: [4, 2], 4: [0, 4]}\ngraph = {0: [1, 4], 1: [0, 2], 2: [1, 3], 3: [2], 4: [0]}\nassert greedy_search(graph, vecs, [4, 3], 0) == (3, [0, 1, 2, 3]), f'Got {greedy_search(graph, vecs, [4, 3], 0)}'\nassert greedy_search(graph, vecs, [0, 5], 0) == (4, [0, 4]), 'Straight to node 4'\nassert greedy_search(graph, vecs, [0, 0], 0) == (0, [0]), 'Already at the best node'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Beam Search with ef",
      "desc": "Write `beam_search(graph, vectors, query, entry, ef, k)`: keep a candidate heap and a result list of at most ef best nodes found so far. Start with entry. Repeatedly take the closest unexpanded candidate; stop if it is farther than the worst of ef results (when there are ef results); otherwise visit its unvisited neighbours, adding each to the candidates and results (keeping only the ef closest results). Return the k closest result nodes, nearest first, ties to the lower node number. Use squared Euclidean distance.",
      "starter": "import heapq\n\n\ndef beam_search(graph, vectors, query, entry, ef, k):\n    pass",
      "hint": "Candidates: min-heap of (dist, node). Results: a list you sort by (dist, node) and trim to ef after each addition.",
      "test": "vecs = {0: [0, 0], 1: [2, 0], 2: [4, 0], 3: [4, 2], 4: [0, 4], 5: [3, 3]}\ngraph = {0: [1, 4], 1: [0, 2], 2: [1, 3], 3: [2, 5], 4: [0, 5], 5: [3, 4]}\nassert beam_search(graph, vecs, [4, 3], 0, 1, 1) == [3], f'ef 1: {beam_search(graph, vecs, [4, 3], 0, 1, 1)}'\nassert beam_search(graph, vecs, [4, 3], 0, 4, 2) == [3, 5], f'Got {beam_search(graph, vecs, [4, 3], 0, 4, 2)}'\nassert beam_search(graph, vecs, [0, 0], 0, 3, 3) == [0, 1, 4], f'Got {beam_search(graph, vecs, [0, 0], 0, 3, 3)}'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "HNSW Levels",
      "desc": "HNSW gives each new node a random top layer: level = floor(−ln(u) × mL) with mL = 1 ÷ ln(M), where u is a uniform random number in (0, 1]. Write `assign_levels(uniforms, M)` returning the level for each u. Raise ValueError if any u is not in (0, 1] or M < 2.",
      "starter": "import math\n\n\ndef assign_levels(uniforms, M):\n    pass",
      "hint": "mL = 1 / math.log(M); math.floor(-math.log(u) * mL)",
      "test": "lv = assign_levels([1.0, 0.5, 0.1, 0.01, 0.001], 16)\nassert lv == [0, 0, 0, 1, 2], f'Got {lv}'\nassert assign_levels([0.3, 0.05], 4) == [0, 2], f'Got {assign_levels([0.3, 0.05], 4)}'\nfor bad in [([0.0], 16), ([1.5], 16), ([0.5], 1)]:\n    try:\n        assign_levels(*bad)\n        raise AssertionError(f'{bad} must raise ValueError')\n    except ValueError:\n        pass\nprint('All checks passed.')"
    },
    "a": {
      "title": "Neighbour Selection Heuristic",
      "desc": "HNSW keeps diverse neighbours. Write `select_neighbors(base, candidates, vectors, M)`: sort candidate node ids by squared distance to vectors[base] (ties to the lower id), then keep a candidate only if it is closer to base than to every neighbour already kept; stop at M neighbours. Return the kept ids in the order kept.",
      "starter": "def select_neighbors(base, candidates, vectors, M):\n    pass",
      "hint": "for c in ordered: if all(d(c, base) < d(c, s) for s in kept): kept.append(c)",
      "test": "vecs = {0: [0, 0], 1: [1, 0], 2: [2, 0], 3: [0, 1], 4: [-1, 0], 5: [1, 1]}\nassert select_neighbors(0, [1, 2, 3, 4, 5], vecs, 4) == [1, 3, 4], f'Got {select_neighbors(0, [1, 2, 3, 4, 5], vecs, 4)}'\nassert select_neighbors(0, [1, 2, 3, 4, 5], vecs, 2) == [1, 3], 'Stop at M'\nassert select_neighbors(0, [2, 5], vecs, 3) == [5], f'Node 2 is closer to node 5 than to the base: {select_neighbors(0, [2, 5], vecs, 3)}'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Pareto Front of Index Settings",
      "desc": "Write `pareto_front(configs)` where configs is a list of dicts {'name', 'recall', 'latency_ms'}. A configuration is dominated if another has recall >= and latency <= with at least one strictly better. Return the names of the non-dominated configurations sorted by latency, then name.",
      "starter": "def pareto_front(configs):\n    pass",
      "hint": "def dominated(c): return any(o['recall'] >= c['recall'] and o['latency_ms'] <= c['latency_ms'] and (o['recall'] > c['recall'] or o['latency_ms'] < c['latency_ms']) for o in configs)",
      "test": "configs = [{'name': 'ef16', 'recall': 0.82, 'latency_ms': 1.2}, {'name': 'ef32', 'recall': 0.91, 'latency_ms': 1.9},\n           {'name': 'ef64', 'recall': 0.96, 'latency_ms': 3.1}, {'name': 'ivf8', 'recall': 0.88, 'latency_ms': 2.5},\n           {'name': 'flat', 'recall': 1.0, 'latency_ms': 40.0}]\nassert pareto_front(configs) == ['ef16', 'ef32', 'ef64', 'flat'], f'Got {pareto_front(configs)}'\nassert pareto_front(configs[:1]) == ['ef16'], 'A single configuration'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Pick a Configuration",
      "desc": "Write `pick_config(configs, min_recall, max_latency_ms=None)` returning the name of the fastest configuration with recall >= min_recall (and latency <= max_latency_ms if given). Ties by higher recall, then name. Return None if nothing qualifies.",
      "starter": "def pick_config(configs, min_recall, max_latency_ms=None):\n    pass",
      "hint": "ok = [c for c in configs if c['recall'] >= min_recall and (max_latency_ms is None or c['latency_ms'] <= max_latency_ms)]",
      "test": "configs = [{'name': 'ef16', 'recall': 0.82, 'latency_ms': 1.2}, {'name': 'ef32', 'recall': 0.91, 'latency_ms': 1.9},\n           {'name': 'ef64', 'recall': 0.96, 'latency_ms': 3.1}, {'name': 'flat', 'recall': 1.0, 'latency_ms': 40.0}]\nassert pick_config(configs, 0.9) == 'ef32', 'Fastest above 90% recall'\nassert pick_config(configs, 0.95) == 'ef64', 'Higher target'\nassert pick_config(configs, 0.99, max_latency_ms=10) is None, 'No config meets both limits'\nassert pick_config(configs, 0.99) == 'flat', 'Exact search as the fallback'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "A Tiny Vector Store",
      "desc": "Write a class `VectorStore` with: upsert(id, vector, meta=None) that stores or replaces a record and increases its version (1 for a new id, then 2, 3 ...); delete(id) that marks a live record as deleted (a tombstone) and returns True, or returns False if it is missing or already deleted; get(id) returning {'vector', 'meta', 'version'} for a live record or None; count() returning the number of live records; and search(query, k) returning the ids of the k live records with the highest cosine similarity (ties by id).",
      "starter": "import math\n\n\nclass VectorStore:\n    def __init__(self):\n        pass\n\n    def upsert(self, id, vector, meta=None):\n        pass\n\n    def delete(self, id):\n        pass\n\n    def get(self, id):\n        pass\n\n    def count(self):\n        pass\n\n    def search(self, query, k):\n        pass",
      "hint": "Store records in a dict: id -> {'vector', 'meta', 'version', 'deleted'}.",
      "test": "s = VectorStore()\ns.upsert('a', [1, 0], {'lang': 'en'})\ns.upsert('b', [0, 1])\ns.upsert('c', [1, 1])\nassert s.count() == 3 and s.get('a')['version'] == 1, 'Three live records'\ns.upsert('a', [0.9, 0.1])\nassert s.get('a')['version'] == 2 and s.get('a')['vector'] == [0.9, 0.1], 'Upsert replaces and bumps the version'\nassert s.search([1, 0], 2) == ['a', 'c'], f'Got {s.search([1, 0], 2)}'\nassert s.delete('a') is True and s.delete('a') is False and s.delete('zzz') is False, 'Delete once'\nassert s.get('a') is None and s.count() == 2, 'Deleted records are hidden'\nassert s.search([1, 0], 2) == ['c', 'b'], 'Tombstones are skipped in search'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Compaction",
      "desc": "Segments accumulate old versions and tombstones. Write `compact(records)` where records is a list of {'id', 'version', 'deleted'} entries (possibly several per id). For each id keep only the entry with the highest version, and drop it if that entry is deleted. Return {'kept': sorted list of (id, version), 'reclaimed': number of entries removed}.",
      "starter": "def compact(records):\n    pass",
      "hint": "latest = {}; for r in records: keep r if it has a higher version than latest.get(r['id'])",
      "test": "recs = [{'id': 'a', 'version': 1, 'deleted': False}, {'id': 'a', 'version': 2, 'deleted': False},\n        {'id': 'b', 'version': 1, 'deleted': False}, {'id': 'b', 'version': 2, 'deleted': True},\n        {'id': 'c', 'version': 3, 'deleted': False}, {'id': 'c', 'version': 1, 'deleted': True}]\nassert compact(recs) == {'kept': [('a', 2), ('c', 3)], 'reclaimed': 4}, f'Got {compact(recs)}'\nassert compact([]) == {'kept': [], 'reclaimed': 0}, 'Nothing to compact'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Hash Sharding",
      "desc": "Write `shard_for(doc_id, shards)` returning int(hashlib.md5(doc_id.encode()).hexdigest(), 16) % shards, and `shard_counts(doc_ids, shards)` returning a list with the number of ids that land on each shard.",
      "starter": "import hashlib\n\n\ndef shard_for(doc_id, shards):\n    pass\n\n\ndef shard_counts(doc_ids, shards):\n    pass",
      "hint": "counts = [0] * shards; counts[shard_for(d, shards)] += 1 for every id",
      "test": "import hashlib\nassert shard_for('doc-1', 4) == int(hashlib.md5(b'doc-1').hexdigest(), 16) % 4, 'Use md5 of the id'\nassert shard_for('doc-1', 4) == shard_for('doc-1', 4), 'Stable'\ncounts = shard_counts([f'doc-{i}' for i in range(1000)], 4)\nassert sum(counts) == 1000 and min(counts) > 200, f'Roughly even: {counts}'\nassert shard_counts([], 3) == [0, 0, 0], 'No ids'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Scatter-Gather Search",
      "desc": "Write `scatter_gather(query, shards, k)` where shards maps shard names to lists of (doc_id, vector). Search each shard for its own top k by cosine similarity (zero vectors score 0), then merge all shard results and return the global top k doc ids, ties by doc_id.",
      "starter": "import math\n\n\ndef scatter_gather(query, shards, k):\n    pass",
      "hint": "Collect (score, doc_id) from each shard's top k, then sort by (-score, doc_id).",
      "test": "shards = {'s0': [('a', [1, 0]), ('b', [0, 1])], 's1': [('c', [0.9, 0.1]), ('d', [-1, 0])], 's2': [('e', [0.7, 0.7])]}\nassert scatter_gather([1, 0], shards, 3) == ['a', 'c', 'e'], f'Got {scatter_gather([1, 0], shards, 3)}'\nassert scatter_gather([0, 1], shards, 2) == ['b', 'e'], f'Got {scatter_gather([0, 1], shards, 2)}'\nassert scatter_gather([1, 0], {}, 3) == [], 'No shards'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Access Check",
      "desc": "Write `can_read(user, acl)` where user is {'id', 'groups'} and acl is {'users': [...], 'groups': [...], 'public': bool} (keys may be missing). Return True if the document is public, the user's id is listed, or the user belongs to a listed group.",
      "starter": "def can_read(user, acl):\n    pass",
      "hint": "acl.get('public', False) or user['id'] in acl.get('users', []) or any(g in acl.get('groups', []) for g in user['groups'])",
      "test": "asha = {'id': 'asha', 'groups': ['finance', 'staff']}\nassert can_read(asha, {'users': ['asha']}) is True, 'Listed user'\nassert can_read(asha, {'groups': ['finance']}) is True, 'Via group'\nassert can_read(asha, {'users': ['ravi'], 'groups': ['legal']}) is False, 'Not allowed'\nassert can_read(asha, {'public': True}) is True, 'Public document'\nassert can_read(asha, {}) is False, 'Empty ACL denies'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Tenant-Safe Search",
      "desc": "Write `tenant_search(query, items, tenant, user, k)` where items are {'id', 'tenant', 'vector', 'acl'}. Search only items whose tenant equals the given tenant and whose acl lets the user read (same rules as can_read), rank by cosine similarity (ties by id), and return the top k ids. Raise ValueError if tenant is empty, so a missing tenant can never search everything.",
      "starter": "import math\n\n\ndef tenant_search(query, items, tenant, user, k):\n    pass",
      "hint": "Filter first by tenant and ACL, then rank what is left.",
      "test": "user = {'id': 'u1', 'groups': ['team-a']}\nitems = [{'id': 'x1', 'tenant': 'acme', 'vector': [1, 0], 'acl': {'groups': ['team-a']}},\n         {'id': 'x2', 'tenant': 'acme', 'vector': [0.9, 0.1], 'acl': {'users': ['u2']}},\n         {'id': 'x3', 'tenant': 'globex', 'vector': [1, 0], 'acl': {'public': True}},\n         {'id': 'x4', 'tenant': 'acme', 'vector': [0, 1], 'acl': {'public': True}}]\nassert tenant_search([1, 0], items, 'acme', user, 5) == ['x1', 'x4'], f\"Got {tenant_search([1, 0], items, 'acme', user, 5)}\"\nassert tenant_search([1, 0], items, 'globex', user, 5) == ['x3'], 'Only the other tenant\\'s public item'\ntry:\n    tenant_search([1, 0], items, '', user, 5)\n    raise AssertionError('empty tenant must raise ValueError')\nexcept ValueError:\n    pass\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Re-rank by Term Overlap",
      "desc": "A second-stage re-ranker looks at each candidate more carefully. Write `rerank(query, docs, candidate_ids)` where docs maps ids to text. Score each candidate by the fraction of distinct query tokens (re.findall(r'[a-z0-9]+', text.lower())) that appear in the document, and return (id, score rounded to 4 decimals) pairs sorted by score, highest first; ties keep the original candidate order.",
      "starter": "import re\n\n\ndef rerank(query, docs, candidate_ids):\n    pass",
      "hint": "Python's sort is stable: sort by -score only and ties keep their original order.",
      "test": "docs = {'d1': 'Cheap flights to Paris', 'd2': 'Paris hotels and cheap flights in spring', 'd3': 'Train tickets to Rome'}\nr = rerank('cheap flights Paris spring', docs, ['d1', 'd3', 'd2'])\nassert r == [('d2', 1.0), ('d1', 0.75), ('d3', 0.0)], f'Got {r}'\nassert rerank('rome', docs, ['d1', 'd2']) == [('d1', 0.0), ('d2', 0.0)], 'Ties keep the original order'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Maximal Marginal Relevance",
      "desc": "Write `mmr(query, docs, k, lam)` where docs maps ids to vectors. Repeatedly pick the document maximising lam × cos(query, d) − (1 − lam) × (the highest cos(d, s) over already selected s, or 0 if none), ties by id. Return the list of selected ids.",
      "starter": "import math\n\n\ndef mmr(query, docs, k, lam):\n    pass",
      "hint": "Loop k times over the remaining ids; compute relevance and redundancy for each.",
      "test": "docs = {'a': [1.0, 0.1], 'b': [1.0, 0.12], 'c': [0.7, 0.7], 'd': [0.0, 1.0]}\nassert mmr([1, 0.3], docs, 2, 1.0) == ['b', 'a'], f'lam 1: pure relevance picks two near-duplicates: {mmr([1, 0.3], docs, 2, 1.0)}'\nassert mmr([1, 0.3], docs, 2, 0.5) == ['b', 'd'], f'Diversity: {mmr([1, 0.3], docs, 2, 0.5)}'\nassert mmr([1, 0.3], docs, 10, 0.5) == ['b', 'd', 'c', 'a'], f'All of them: {mmr([1, 0.3], docs, 10, 0.5)}'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Query Normaliser",
      "desc": "Write `normalize_query(text, stopwords, spelling)` that lower-cases the text, takes tokens with re.findall(r'[a-z0-9]+', ...), replaces misspelt tokens using the spelling dict, drops tokens in stopwords (after correction), and returns the remaining tokens joined by single spaces.",
      "starter": "import re\n\n\ndef normalize_query(text, stopwords, spelling):\n    pass",
      "hint": "tokens = [spelling.get(t, t) for t in re.findall(...)]; keep t not in stopwords",
      "test": "stop = {'the', 'a', 'for', 'to'}\nspell = {'vectr': 'vector', 'serch': 'search'}\nassert normalize_query('The best VECTR serch for a startup?', stop, spell) == 'best vector search startup', 'Normalised'\nassert normalize_query('   ', stop, spell) == '', 'Empty query'\nassert normalize_query('To the', stop, spell) == '', 'Only stopwords'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Synonym Expansion",
      "desc": "Write `expand_query(tokens, synonyms, max_variants)` returning a list of query strings: first the original tokens joined by spaces, then, for each token in order and each of its synonyms in order, the query with that one token replaced. Skip duplicates and stop at max_variants queries in total.",
      "starter": "def expand_query(tokens, synonyms, max_variants):\n    pass",
      "hint": "Build variants with tokens[:i] + [syn] + tokens[i + 1:]; keep a seen set.",
      "test": "syn = {'cheap': ['budget', 'low cost'], 'flights': ['airfare']}\nr = expand_query(['cheap', 'flights', 'paris'], syn, 10)\nassert r == ['cheap flights paris', 'budget flights paris', 'low cost flights paris', 'cheap airfare paris'], f'Got {r}'\nassert expand_query(['cheap', 'flights'], syn, 2) == ['cheap flights', 'budget flights'], 'Limit'\nassert expand_query(['rome'], syn, 5) == ['rome'], 'No synonyms'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Context Assembly under a Token Budget",
      "desc": "Write `assemble_context(chunks, budget)` where chunks is a ranked list of {'id', 'tokens'}. Walk the list in order and include each chunk that still fits in the remaining budget (skip ones that do not fit, but keep trying later, smaller chunks). Return (included_ids, tokens_used).",
      "starter": "def assemble_context(chunks, budget):\n    pass",
      "hint": "used = 0; if used + c['tokens'] <= budget: include it",
      "test": "chunks = [{'id': 'c1', 'tokens': 400}, {'id': 'c2', 'tokens': 700}, {'id': 'c3', 'tokens': 250}, {'id': 'c4', 'tokens': 300}]\nassert assemble_context(chunks, 1000) == (['c1', 'c3', 'c4'], 950), f'Got {assemble_context(chunks, 1000)}'\nassert assemble_context(chunks, 300) == (['c3'], 250), 'Only a small chunk fits'\nassert assemble_context(chunks, 100) == ([], 0), 'Nothing fits'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Numbered Citations",
      "desc": "Write `cite(sentences)` where sentences is a list of (text, source_id) pairs (source_id may be None). Number sources in order of first appearance starting at 1, append ' [n]' to each sentence that has a source, join all sentences with single spaces, and return (answer_text, sources_in_number_order).",
      "starter": "def cite(sentences):\n    pass",
      "hint": "numbers = {}; numbers.setdefault(src, len(numbers) + 1)",
      "test": "s = [('Paris is the capital of France.', 'wiki-fr'), ('It has about 2 million residents.', 'census-2023'),\n     ('It is known for the Eiffel Tower.', 'wiki-fr'), ('Enjoy your trip!', None)]\ntext, sources = cite(s)\nassert text == 'Paris is the capital of France. [1] It has about 2 million residents. [2] It is known for the Eiffel Tower. [1] Enjoy your trip!', f'Got {text}'\nassert sources == ['wiki-fr', 'census-2023'], f'Got {sources}'\nassert cite([]) == ('', []), 'Nothing to cite'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Semantic Cache",
      "desc": "Write a class `SemanticCache(threshold)` with put(vector, answer) and get(vector). get returns the answer of the most similar cached entry (cosine similarity, first stored wins ties) if that similarity is at least threshold, otherwise None. Also keep counters self.hits and self.misses, updated by get.",
      "starter": "import math\n\n\nclass SemanticCache:\n    def __init__(self, threshold):\n        pass\n\n    def put(self, vector, answer):\n        pass\n\n    def get(self, vector):\n        pass",
      "hint": "Store (vector, answer) pairs in a list; find the best cosine in get.",
      "test": "c = SemanticCache(0.95)\nc.put([1.0, 0.0], 'Paris')\nc.put([0.0, 1.0], 'Rome')\nassert c.get([0.99, 0.05]) == 'Paris', 'Near-identical query hits'\nassert c.get([0.7, 0.7]) is None, 'Too different: miss'\nassert c.get([0.02, 1.0]) == 'Rome', 'Hit the other entry'\nassert (c.hits, c.misses) == (2, 1), f'Got {(c.hits, c.misses)}'\nassert SemanticCache(0.9).get([1, 0]) is None, 'Empty cache'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Cache Savings",
      "desc": "Write `cache_savings(events, llm_cost, lookup_cost)` where events is a list of 'hit' or 'miss'. Every request pays lookup_cost; misses also pay llm_cost. Return {'hit_rate': hits ÷ requests rounded to 3 decimals, 'cost_without_cache': requests × llm_cost, 'cost_with_cache': the total with the cache, 'saved': the difference}, with the three costs rounded to 2 decimals. For no events return zeros.",
      "starter": "def cache_savings(events, llm_cost, lookup_cost):\n    pass",
      "hint": "with_cache = n * lookup_cost + misses * llm_cost",
      "test": "ev = ['hit', 'miss', 'hit', 'hit', 'miss']\nassert cache_savings(ev, 0.02, 0.002) == {'hit_rate': 0.6, 'cost_without_cache': 0.1, 'cost_with_cache': 0.05, 'saved': 0.05}, f'Got {cache_savings(ev, 0.02, 0.002)}'\nassert cache_savings(['miss'] * 4, 0.02, 0.005) == {'hit_rate': 0.0, 'cost_without_cache': 0.08, 'cost_with_cache': 0.1, 'saved': -0.02}, 'A cache with no hits costs extra'\nassert cache_savings([], 0.02, 0.001) == {'hit_rate': 0.0, 'cost_without_cache': 0.0, 'cost_with_cache': 0.0, 'saved': 0.0}, 'No events'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Stale Documents",
      "desc": "Write `stale_docs(docs)` where each doc is {'id', 'updated', 'indexed'} with ISO date strings ('YYYY-MM-DD') and indexed possibly None. Return the sorted ids of documents that were never indexed or were updated after they were last indexed. (ISO dates compare correctly as strings.)",
      "starter": "def stale_docs(docs):\n    pass",
      "hint": "d['indexed'] is None or d['updated'] > d['indexed']",
      "test": "docs = [{'id': 'p1', 'updated': '2026-09-01', 'indexed': '2026-09-02'},\n        {'id': 'p2', 'updated': '2026-09-20', 'indexed': '2026-09-02'},\n        {'id': 'p3', 'updated': '2026-09-05', 'indexed': None},\n        {'id': 'p0', 'updated': '2026-09-02', 'indexed': '2026-09-02'}]\nassert stale_docs(docs) == ['p2', 'p3'], f'Got {stale_docs(docs)}'\nassert stale_docs([]) == [], 'No documents'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Choose the Right Index for a Model",
      "desc": "Vectors from different embedding models cannot be compared. Write `pick_index(model, indexes)` where indexes is a list of {'name', 'model', 'status'}. Return the name of the last listed index with status 'ready' built with the same model, or None. Then write `can_switch(new_model, indexes)` returning True only if a ready index exists for new_model.",
      "starter": "def pick_index(model, indexes):\n    pass\n\n\ndef can_switch(new_model, indexes):\n    pass",
      "hint": "Loop through the list and remember the latest match.",
      "test": "idx = [{'name': 'docs-v1', 'model': 'embed-small-1', 'status': 'ready'},\n       {'name': 'docs-v2', 'model': 'embed-large-2', 'status': 'building'},\n       {'name': 'docs-v1b', 'model': 'embed-small-1', 'status': 'ready'}]\nassert pick_index('embed-small-1', idx) == 'docs-v1b', 'Latest ready index for the model'\nassert pick_index('embed-large-2', idx) is None, 'Still building'\nassert can_switch('embed-large-2', idx) is False, 'Do not switch before the new index is ready'\nidx[1]['status'] = 'ready'\nassert can_switch('embed-large-2', idx) is True and pick_index('embed-large-2', idx) == 'docs-v2', 'Ready now'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "nDCG at k",
      "desc": "Write `ndcg_at_k(grades, k)` where grades lists the relevance grade (0, 1, 2 or 3) of each result in ranked order. DCG@k = Σ over positions i = 1..k of (2^grade − 1) ÷ log2(i + 1). nDCG@k = DCG@k ÷ the DCG@k of the grades sorted from best to worst. Return it rounded to 4 decimals, or 0.0 if the ideal DCG is 0.",
      "starter": "import math\n\n\ndef ndcg_at_k(grades, k):\n    pass",
      "hint": "def dcg(g): return sum((2 ** x - 1) / math.log2(i + 2) for i, x in enumerate(g[:k]))",
      "test": "assert ndcg_at_k([3, 2, 1, 0], 4) == 1.0, 'Perfect order'\nassert ndcg_at_k([0, 1, 2, 3], 4) == 0.5478, f'Got {ndcg_at_k([0, 1, 2, 3], 4)}'\nassert ndcg_at_k([2, 0, 3], 2) == 0.3374, f'Got {ndcg_at_k([2, 0, 3], 2)}'\nassert ndcg_at_k([0, 0], 2) == 0.0, 'Nothing relevant'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Golden-Set Evaluation",
      "desc": "Write `evaluate(golden, results, k)` where golden maps each query to its set of relevant ids and results maps each query to its ranked list. Return {'recall_at_k': mean recall@k, 'mrr': mean reciprocal rank, 'worst_query': the query with the lowest recall@k (ties by query text)}, with means rounded to 4 decimals. A query missing from results counts as an empty list.",
      "starter": "def evaluate(golden, results, k):\n    pass",
      "hint": "Loop over sorted(golden); compute recall@k and reciprocal rank for each query.",
      "test": "golden = {'q1': {'a', 'b'}, 'q2': {'c'}, 'q3': {'d'}}\nresults = {'q1': ['a', 'x', 'b'], 'q2': ['y', 'c'], 'q3': ['z', 'w']}\nassert evaluate(golden, results, 3) == {'recall_at_k': 0.6667, 'mrr': 0.5, 'worst_query': 'q3'}, f'Got {evaluate(golden, results, 3)}'\nassert evaluate(golden, results, 1) == {'recall_at_k': 0.1667, 'mrr': 0.5, 'worst_query': 'q2'}, f'Got {evaluate(golden, results, 1)}'\nassert evaluate({'q': {'a'}}, {}, 5)['recall_at_k'] == 0.0, 'Missing results'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Latency Percentiles",
      "desc": "Write `percentile(values, p)` using the nearest-rank method: sort the values and return the one at position ceil(p ÷ 100 × n) (counting from 1; use position 1 when p is 0). Then write `latency_report(values)` returning {'p50', 'p95', 'p99', 'max'}.",
      "starter": "import math\n\n\ndef percentile(values, p):\n    pass\n\n\ndef latency_report(values):\n    pass",
      "hint": "s = sorted(values); rank = max(1, math.ceil(p / 100 * len(s))); return s[rank - 1]",
      "test": "lat = [12, 15, 11, 14, 13, 90, 16, 12, 14, 250]\nassert percentile(lat, 50) == 14, f'Got {percentile(lat, 50)}'\nassert percentile(lat, 90) == 90, f'Got {percentile(lat, 90)}'\nassert latency_report(lat) == {'p50': 14, 'p95': 250, 'p99': 250, 'max': 250}, f'Got {latency_report(lat)}'\nassert percentile([5], 99) == 5 and percentile([3, 1], 0) == 1, 'Edge cases'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Embedding Drift",
      "desc": "Write `drift(baseline, current, threshold)` where both are lists of vectors. Compute each set's mean vector, then the drift = 1 − cosine(mean_baseline, mean_current), rounded to 4 decimals (treat a zero mean as cosine 0). Return {'drift': drift, 'alert': drift > threshold}.",
      "starter": "import math\n\n\ndef drift(baseline, current, threshold):\n    pass",
      "hint": "mean = [sum(col) / len(vectors) for col in zip(*vectors)]",
      "test": "base = [[1, 0], [0.9, 0.1], [1, 0.2]]\nsame = [[0.95, 0.1], [1, 0.1]]\nshifted = [[0.2, 1], [0.1, 0.9]]\nassert drift(base, same, 0.05) == {'drift': 0.0, 'alert': False}, f'Got {drift(base, same, 0.05)}'\nr = drift(base, shifted, 0.05)\nassert r['alert'] is True and r['drift'] == 0.7432, f'Got {r}'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Index Memory",
      "desc": "Write `index_memory_gb(n, dims, bytes_per_dim, graph_m=0)` returning the memory of a vector index in GB (1e9 bytes) rounded to 2 decimals: vectors take n × dims × bytes_per_dim bytes, and an HNSW graph adds n × graph_m × 2 × 4 bytes (about 2M neighbour links per node at the bottom layer, 4 bytes each).",
      "starter": "def index_memory_gb(n, dims, bytes_per_dim, graph_m=0):\n    pass",
      "hint": "round((n * dims * bytes_per_dim + n * graph_m * 2 * 4) / 1e9, 2)",
      "test": "assert index_memory_gb(10_000_000, 768, 4) == 30.72, f'Got {index_memory_gb(10_000_000, 768, 4)}'\nassert index_memory_gb(10_000_000, 768, 4, graph_m=16) == 32.0, 'Graph overhead'\nassert index_memory_gb(10_000_000, 768, 1) == 7.68, 'int8'\nassert index_memory_gb(1_000_000, 1024, 0.125) == 0.13, 'Binary codes'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Choose a Storage Format",
      "desc": "Write `choose_format(n, dims, budget_gb, graph_m=16)` that tries 'float32' (4 bytes per dimension), 'float16' (2), 'int8' (1) and 'binary' (0.125) in that order and returns (name, memory_gb) for the first whose index memory, including the HNSW graph, fits within budget_gb (memory rounded to 2 decimals). Return (None, memory of the binary option) if nothing fits.",
      "starter": "def choose_format(n, dims, budget_gb, graph_m=16):\n    pass",
      "hint": "Loop over [('float32', 4), ('float16', 2), ('int8', 1), ('binary', 0.125)].",
      "test": "assert choose_format(10_000_000, 768, 64) == ('float32', 32.0), 'Plenty of memory'\nassert choose_format(10_000_000, 768, 20) == ('float16', 16.64), f'Got {choose_format(10_000_000, 768, 20)}'\nassert choose_format(100_000_000, 1024, 30) == ('binary', 25.6), f'Graph links dominate: {choose_format(100_000_000, 1024, 30)}'\nassert choose_format(100_000_000, 1024, 20) == (None, 25.6), 'Nothing fits'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Redact Before Embedding",
      "desc": "Personal data should not end up in vectors. Write `redact(text)` that replaces e-mail addresses (re r'[\\w.+-]+@[\\w-]+\\.[\\w.]+') with '[EMAIL]' and then phone numbers (re r'\\+?\\d[\\d -]{8,}\\d') with '[PHONE]', and returns (clean_text, counts) where counts is {'email': n, 'phone': m}.",
      "starter": "import re\n\n\ndef redact(text):\n    pass",
      "hint": "Use re.subn, which returns the new text and the number of replacements.",
      "test": "t, c = redact('Email priya.k@example.com or call +91 98765 43210 today.')\nassert t == 'Email [EMAIL] or call [PHONE] today.', f'Got {t}'\nassert c == {'email': 1, 'phone': 1}, f'Got {c}'\nassert redact('Order 123 shipped.') == ('Order 123 shipped.', {'email': 0, 'phone': 0}), 'Short numbers are kept'\nt2, c2 = redact('a@b.io, c@d.org')\nassert t2 == '[EMAIL], [EMAIL]' and c2['email'] == 2, f'Got {t2}'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Forget a User",
      "desc": "Write `forget_user(records, cache, user_id)` where records is a list of {'id', 'owner'} and cache is a dict of key -> {'owner', 'answer'}. Remove every record and cache entry owned by user_id. Return (remaining_records, remaining_cache, audit) where audit is {'user': user_id, 'records_deleted': sorted ids, 'cache_deleted': number of cache entries removed}.",
      "starter": "def forget_user(records, cache, user_id):\n    pass",
      "hint": "Build new lists and dicts rather than deleting while looping.",
      "test": "records = [{'id': 'r1', 'owner': 'u1'}, {'id': 'r2', 'owner': 'u2'}, {'id': 'r3', 'owner': 'u1'}]\ncache = {'k1': {'owner': 'u1', 'answer': 'x'}, 'k2': {'owner': 'u2', 'answer': 'y'}}\nrest, rest_cache, audit = forget_user(records, cache, 'u1')\nassert rest == [{'id': 'r2', 'owner': 'u2'}] and list(rest_cache) == ['k2'], f'Got {rest}, {rest_cache}'\nassert audit == {'user': 'u1', 'records_deleted': ['r1', 'r3'], 'cache_deleted': 1}, f'Got {audit}'\nassert forget_user(records, cache, 'u9')[2] == {'user': 'u9', 'records_deleted': [], 'cache_deleted': 0}, 'Unknown user'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Hybrid Search with Filters",
      "desc": "Write `hybrid_search(query_tokens, query_vec, docs, where, k, alpha)` where docs are {'id', 'tokens', 'vector', 'meta'}. Keep docs whose meta matches every key/value in where. Score each as alpha × cosine(query_vec, vector) + (1 − alpha) × (fraction of distinct query tokens found in the doc's tokens). Return the top k as (id, score rounded to 4 decimals), best first, ties by id.",
      "starter": "import math\n\n\ndef hybrid_search(query_tokens, query_vec, docs, where, k, alpha):\n    pass",
      "hint": "overlap = len(set(query_tokens) & set(doc['tokens'])) / len(set(query_tokens))",
      "test": "docs = [{'id': 'a', 'tokens': ['refund', 'policy'], 'vector': [1, 0], 'meta': {'lang': 'en'}},\n        {'id': 'b', 'tokens': ['return', 'items', 'refund'], 'vector': [0.8, 0.6], 'meta': {'lang': 'en'}},\n        {'id': 'c', 'tokens': ['shipping', 'times'], 'vector': [0, 1], 'meta': {'lang': 'en'}},\n        {'id': 'd', 'tokens': ['refund', 'return'], 'vector': [1, 0], 'meta': {'lang': 'fr'}}]\nr = hybrid_search(['refund', 'return'], [1, 0], docs, {'lang': 'en'}, 2, 0.5)\nassert r == [('b', 0.9), ('a', 0.75)], f'Got {r}'\nassert hybrid_search(['refund', 'return'], [1, 0], docs, {}, 1, 0.5) == [('d', 1.0)], 'French doc wins without a filter'\nassert hybrid_search(['shipping'], [0, 1], docs, {'lang': 'de'}, 3, 0.5) == [], 'Nothing matches the filter'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Evaluation Report",
      "desc": "Write `eval_report(runs, golden, k)` where runs maps queries to ranked id lists and golden maps queries to sets of relevant ids. Return {'queries': number of golden queries, 'recall_at_k': mean recall@k, 'mrr': mean reciprocal rank, 'failed': sorted queries whose recall@k is 0}, means rounded to 4 decimals. Queries missing from runs count as empty results; with no golden queries return zeros and an empty list.",
      "starter": "def eval_report(runs, golden, k):\n    pass",
      "hint": "Reuse the recall and reciprocal-rank logic from Days 5 and 26.",
      "test": "golden = {'refund': {'b', 'a'}, 'shipping': {'c'}, 'warranty': {'w'}}\nruns = {'refund': ['b', 'x', 'a'], 'shipping': ['x', 'c'], 'warranty': ['x', 'y']}\nassert eval_report(runs, golden, 2) == {'queries': 3, 'recall_at_k': 0.5, 'mrr': 0.5, 'failed': ['warranty']}, f'Got {eval_report(runs, golden, 2)}'\nassert eval_report(runs, golden, 3)['recall_at_k'] == 0.6667, 'Larger k finds more'\nassert eval_report({}, {}, 3) == {'queries': 0, 'recall_at_k': 0.0, 'mrr': 0.0, 'failed': []}, 'Empty'\nprint('All checks passed.')"
    }
  }
];

export const VECTOR_PYTHON_30_DAYS_CONFIGS: DayConfig[] = VECTOR_DAYS.map((cfg, i) => {
  const day = DAYS[i];
  return {
    ...cfg,
    eTitle: day.e.title,
    eDesc: day.e.desc,
    eStarter: day.e.starter,
    eHint: day.e.hint,
    eTest: day.e.test,
    aTitle: day.a.title,
    aDesc: day.a.desc,
    aStarter: day.a.starter,
    aHint: day.a.hint,
    aTest: day.a.test,
  };
});

export const VECTOR_PYTHON_30_DAYS_QUESTS: CourseQuest[] = VECTOR_PYTHON_30_DAYS_CONFIGS.flatMap((cfg, idx) =>
  buildEnrichedDayQuests('vec-py', idx + 1, cfg)
);
