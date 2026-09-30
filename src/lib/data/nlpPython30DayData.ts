import { buildEnrichedDayQuests, DayConfig } from './curriculumEnricher';
import { CourseQuest } from './coursesData';
import { NLP_30_DAYS_CONFIGS } from './nlp30DayData';

/**
 * NLP in Python (course-nlp-python), for the Python track.
 *
 * The same 30 days and topics as Natural Language Processing & Computational Linguistics (course-nlp), but every
 * practice task is written and checked in Python. The lessons are the long Python lessons (longLessons.ts).
 * Checks are plain `assert` statements run after the student's code; the reference answers live in
 * tests/fixtures/nlp_python_solutions.json, not here, so students never download them.
 */
type Task = { title: string; desc: string; starter: string; hint: string; test: string };
type Day = { e: Task; a: Task };

const DAYS: Day[] = [
  {
    "e": {
      "title": "Text Normalizer and Tokenizer",
      "desc": "Write `normalize_tokens(text, stopwords)`. Normalize with unicodedata.normalize('NFKD', text) and drop combining marks (unicodedata.combining(ch) is non-zero for them), lowercase, replace every character that is not a letter, digit or whitespace with a space, split on whitespace, and drop words in stopwords. Return the list of tokens.",
      "starter": "import unicodedata\n\n\ndef normalize_tokens(text, stopwords):\n    pass",
      "hint": "''.join(ch for ch in unicodedata.normalize('NFKD', text) if not unicodedata.combining(ch)).lower(), then re.sub(r'[^\\w\\s]', ' ', ...)",
      "test": "toks = normalize_tokens('Café résumé: The quick brown fox!', {'the', 'a', 'is'})\nassert toks == ['cafe', 'resume', 'quick', 'brown', 'fox'], f'Got {toks}'\nassert normalize_tokens('Hello,world', set()) == ['hello', 'world'], 'Punctuation separates words'\nassert normalize_tokens('  The  THE the ', {'the'}) == [], 'Only stopwords'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Accent Stripper",
      "desc": "Write `strip_accents(text)` that returns text with accents removed but letters kept: decompose with NFKD, drop combining marks, and keep case. NFKD also turns compatibility characters into plain ones, for example the ligature 'ﬁ' becomes 'fi'.",
      "starter": "import unicodedata\n\n\ndef strip_accents(text):\n    pass",
      "hint": "''.join(ch for ch in unicodedata.normalize('NFKD', text) if not unicodedata.combining(ch))",
      "test": "assert strip_accents('Crème Brûlée') == 'Creme Brulee', f'Got {strip_accents(\"Crème Brûlée\")}'\nassert strip_accents('naïve São Paulo') == 'naive Sao Paulo', 'Remove every accent'\nassert strip_accents('ﬁnal') == 'final', 'NFKD splits the fi ligature'\nassert strip_accents('plain') == 'plain', 'Plain text is unchanged'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Heuristic Suffix Stemmer",
      "desc": "Write `simple_stem(word)`. Lowercase the word. Try the suffixes 'ing', 'ed', 'ly', 'es', 's' in that order and strip the FIRST one the word ends with, but only if at least 3 letters remain. Then, if the result ends in a doubled consonant (the same letter twice, not a vowel), drop one of them. Return the stem.",
      "starter": "def simple_stem(word):\n    pass",
      "hint": "for suf in ('ing', 'ed', 'ly', 'es', 's'): if w.endswith(suf) and len(w) - len(suf) >= 3: w = w[:-len(suf)]; break",
      "test": "assert simple_stem('running') == 'run', 'Strip ing, then the doubled n'\nassert simple_stem('jumped') == 'jump', 'Strip ed'\nassert simple_stem('quickly') == 'quick', 'Strip ly'\nassert simple_stem('boxes') == 'box', 'Strip es'\nassert simple_stem('cats') == 'cat', 'Strip s'\nassert simple_stem('sing') == 'sing', 'Too short to strip ing'\nassert simple_stem('Stopped') == 'stop', 'Lowercase, strip ed, undouble'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Dictionary Lemmatizer",
      "desc": "Write `lemmatize(word, pos, lemma_dict)`. lemma_dict maps (word, pos) pairs to lemmas, for example ('better', 'ADJ') -> 'good'. Look up the lowercased word with its part of speech; if it is not there, return the lowercased word unchanged.",
      "starter": "def lemmatize(word, pos, lemma_dict):\n    pass",
      "hint": "return lemma_dict.get((word.lower(), pos), word.lower())",
      "test": "D = {('better', 'ADJ'): 'good', ('meeting', 'VERB'): 'meet', ('mice', 'NOUN'): 'mouse', ('was', 'VERB'): 'be'}\nassert lemmatize('better', 'ADJ', D) == 'good', 'better (adjective) -> good'\nassert lemmatize('meeting', 'VERB', D) == 'meet', 'meeting as a verb -> meet'\nassert lemmatize('meeting', 'NOUN', D) == 'meeting', 'meeting as a noun stays meeting'\nassert lemmatize('Mice', 'NOUN', D) == 'mouse', 'Case does not matter'\nassert lemmatize('table', 'NOUN', D) == 'table', 'Unknown words are returned lowercased'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Laplace Bigram Probability",
      "desc": "Write `laplace_bigram_prob(bigram_count, context_count, vocab_size)` returning (bigram_count + 1) / (context_count + vocab_size), rounded to 4 decimals. Add-one smoothing gives unseen word pairs a small probability instead of zero.",
      "starter": "def laplace_bigram_prob(bigram_count, context_count, vocab_size):\n    pass",
      "hint": "round((bigram_count + 1) / (context_count + vocab_size), 4)",
      "test": "assert laplace_bigram_prob(3, 10, 5) == 0.2667, 'Seen pair: (3 + 1) / (10 + 5)'\nassert laplace_bigram_prob(0, 10, 5) == 0.0667, 'Unseen pair still gets 1 / 15'\nassert laplace_bigram_prob(0, 0, 4) == 0.25, 'New context: uniform over the vocabulary'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Perplexity",
      "desc": "Write `perplexity(probs)` for the probabilities a language model gave each word of a test sentence. Perplexity is exp(-(1/N) * sum(log p)). Lower is better. Round to 4 decimals; any probability of 0 makes perplexity infinite, so return float('inf').",
      "starter": "import math\n\n\ndef perplexity(probs):\n    pass",
      "hint": "if any(p == 0 for p in probs): return float('inf'); return round(math.exp(-sum(math.log(p) for p in probs) / len(probs)), 4)",
      "test": "assert perplexity([0.25, 0.25, 0.25, 0.25]) == 4.0, 'Always 1 in 4 means perplexity 4'\nassert perplexity([0.5, 0.5]) == 2.0, 'Coin-flip guesses'\nassert perplexity([0.9, 0.5, 0.2]) == 2.2314, f'Got {perplexity([0.9, 0.5, 0.2])}'\nassert perplexity([0.5, 0.0]) == float('inf'), 'A zero probability means infinite perplexity'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "TF-IDF Weight",
      "desc": "Write `tf_idf(term_count, doc_length, n_docs, doc_freq)`. TF = term_count / doc_length; IDF = log10(n_docs / doc_freq). Return TF * IDF rounded to 4 decimals. If doc_freq is 0 or doc_length is 0, return 0.0.",
      "starter": "import math\n\n\ndef tf_idf(term_count, doc_length, n_docs, doc_freq):\n    pass",
      "hint": "if doc_freq == 0 or doc_length == 0: return 0.0; round(term_count / doc_length * math.log10(n_docs / doc_freq), 4)",
      "test": "assert tf_idf(3, 100, 1000, 10) == 0.06, '0.03 * log10(100) = 0.06'\nassert tf_idf(5, 50, 1000, 1000) == 0.0, 'A word in every document has IDF 0'\nassert tf_idf(2, 20, 10000, 5) == 0.3301, f'Got {tf_idf(2, 20, 10000, 5)}'\nassert tf_idf(1, 10, 100, 0) == 0.0, 'Unknown term'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Bag of Words",
      "desc": "Write `bag_of_words(docs)` where docs is a list of token lists. Build the vocabulary as the sorted list of all distinct tokens, and for each document a count vector in vocabulary order. Return (vocab, vectors).",
      "starter": "def bag_of_words(docs):\n    pass",
      "hint": "vocab = sorted({t for d in docs for t in d}); [[d.count(w) for w in vocab] for d in docs]",
      "test": "vocab, vecs = bag_of_words([['the', 'cat', 'sat'], ['the', 'cat', 'the', 'end']])\nassert vocab == ['cat', 'end', 'sat', 'the'], f'Got {vocab}'\nassert vecs == [[1, 0, 1, 1], [1, 1, 0, 2]], f'Got {vecs}'\nassert bag_of_words([]) == ([], []), 'No documents'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "TF-IDF Search Engine",
      "desc": "Write `search(query, docs)` where docs maps a doc id to its token list and query is a token list. Score each document as the sum, over query terms, of TF-IDF with TF = count / len(doc) and IDF = log10(N / df) (terms in no document add 0). Return the ids of documents with a score above 0, sorted by score (highest first), then by id.",
      "starter": "import math\n\n\ndef search(query, docs):\n    pass",
      "hint": "Compute df for each query term once: sum(term in d for d in docs.values()).",
      "test": "docs = {\n    'd1': ['cloud', 'cost', 'cloud', 'savings'],\n    'd2': ['python', 'cloud', 'lambda'],\n    'd3': ['python', 'tests', 'python', 'tests'],\n    'd4': ['cooking', 'rice'],\n}\nassert search(['python'], docs) == ['d3', 'd2'], f'Got {search([\"python\"], docs)}'\nassert search(['cloud', 'savings'], docs) == ['d1', 'd2'], 'd1 has both terms'\nassert search(['quantum'], docs) == [], 'No document matches'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Inverted Index",
      "desc": "Write `inverted_index(docs)` where docs maps a doc id to its token list. Return a dict from each token to the sorted list of doc ids containing it (each id once).",
      "starter": "def inverted_index(docs):\n    pass",
      "hint": "index.setdefault(tok, set()).add(doc_id), then sort each set.",
      "test": "idx = inverted_index({'d2': ['cloud', 'python'], 'd1': ['cloud', 'cloud', 'cost'], 'd3': []})\nassert idx == {'cloud': ['d1', 'd2'], 'python': ['d2'], 'cost': ['d1']}, f'Got {idx}'\nassert inverted_index({}) == {}, 'No documents'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Cosine Similarity",
      "desc": "Write `cosine_similarity(a, b)` for two equal-length vectors: dot(a, b) / (|a| * |b|), rounded to 4 decimals. If either vector is all zeros, return 0.0.",
      "starter": "import math\n\n\ndef cosine_similarity(a, b):\n    pass",
      "hint": "dot = sum(x * y for x, y in zip(a, b)); norms with math.sqrt(sum(x * x ...))",
      "test": "assert cosine_similarity([1, 0], [1, 0]) == 1.0, 'Same direction'\nassert cosine_similarity([1, 0], [0, 1]) == 0.0, 'Orthogonal'\nassert cosine_similarity([1, 2, 3], [2, 4, 6]) == 1.0, 'Length does not matter'\nassert cosine_similarity([1, 2, 0], [2, 1, 1]) == 0.7303, f'Got {cosine_similarity([1, 2, 0], [2, 1, 1])}'\nassert cosine_similarity([1, 1], [-1, -1]) == -1.0, 'Opposite'\nassert cosine_similarity([0, 0], [1, 2]) == 0.0, 'Zero vector'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Top-k Similar Documents",
      "desc": "Write `top_k_similar(query, vectors, k)` where vectors maps a doc id to a vector. Return the ids of the k documents with the highest cosine similarity to query, highest first, ties broken by id. Define your own cosine helper (a zero vector has similarity 0).",
      "starter": "import math\n\n\ndef top_k_similar(query, vectors, k):\n    pass",
      "hint": "sorted(vectors, key=lambda d: (-cos(query, vectors[d]), d))[:k]",
      "test": "vecs = {'a': [1, 0, 0], 'b': [1, 1, 0], 'c': [0, 0, 1], 'd': [2, 0, 0]}\nassert top_k_similar([1, 0, 0], vecs, 2) == ['a', 'd'], 'a and d point the same way; tie broken by id'\nassert top_k_similar([1, 1, 0], vecs, 3) == ['b', 'a', 'd'], f'Got {top_k_similar([1, 1, 0], vecs, 3)}'\nassert top_k_similar([0, 0, 1], vecs, 1) == ['c'], 'Only c points up'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Word Vector Analogy",
      "desc": "Write `vector_analogy(a, b, c)` returning a - b + c element by element (as in king - man + woman), each value rounded to 4 decimals.",
      "starter": "def vector_analogy(a, b, c):\n    pass",
      "hint": "[round(x - y + z, 4) for x, y, z in zip(a, b, c)]",
      "test": "king, man, woman = [0.8, 0.9, 0.1], [0.7, 0.1, 0.1], [0.7, 0.1, 0.9]\nassert vector_analogy(king, man, woman) == [0.8, 0.9, 0.9], f'Got {vector_analogy(king, man, woman)}'\nassert vector_analogy([1, 2], [1, 2], [3, -1]) == [3, -1], 'a - a + c = c'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Nearest Word",
      "desc": "Write `nearest_word(vector, embeddings, exclude)` where embeddings maps words to vectors. Return the word (not in exclude) whose vector has the highest cosine similarity to vector. Ties go to the alphabetically first word. Analogy tools exclude the input words, or they would often win.",
      "starter": "import math\n\n\ndef nearest_word(vector, embeddings, exclude):\n    pass",
      "hint": "candidates = [w for w in embeddings if w not in exclude]; min(candidates, key=lambda w: (-cos(vector, embeddings[w]), w))",
      "test": "emb = {'king': [0.8, 0.9, 0.1], 'queen': [0.8, 0.9, 0.9], 'man': [0.7, 0.1, 0.1], 'woman': [0.7, 0.1, 0.9], 'apple': [0.1, 0.0, 0.2]}\ntarget = [0.8, 0.9, 0.9]\nassert nearest_word(target, emb, {'king', 'man', 'woman'}) == 'queen', 'king - man + woman is closest to queen'\nassert nearest_word([0.7, 0.1, 0.12], emb, set()) == 'man', 'Nearest overall'\nassert nearest_word([0.7, 0.1, 0.12], emb, {'man'}) == 'king', f'Got {nearest_word([0.7, 0.1, 0.12], emb, {\"man\"})}'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "FastText Character N-grams",
      "desc": "Write `char_ngrams(word, min_n, max_n)`. Wrap the word as '<' + word + '>'. Return every substring of length min_n to max_n (shorter lengths first, left to right), followed by the whole wrapped word, without duplicates.",
      "starter": "def char_ngrams(word, min_n, max_n):\n    pass",
      "hint": "w = f'<{word}>'; for n in range(min_n, max_n + 1): for i in range(len(w) - n + 1): add w[i:i + n] if new",
      "test": "assert char_ngrams('where', 3, 3) == ['<wh', 'whe', 'her', 'ere', 're>', '<where>'], f'Got {char_ngrams(\"where\", 3, 3)}'\ng = char_ngrams('cat', 3, 4)\nassert g == ['<ca', 'cat', 'at>', '<cat', 'cat>', '<cat>'], f'Got {g}'\nassert char_ngrams('ab', 3, 3) == ['<ab', 'ab>', '<ab>'], 'Short words still get n-grams'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Out-of-Vocabulary Vector",
      "desc": "Write `oov_vector(word, ngram_vectors, min_n, max_n)`. Build the word's character n-grams (as in Practice 1: wrapped in < >, lengths min_n to max_n, plus the whole wrapped word), keep those found in ngram_vectors, and return their element-wise average rounded to 4 decimals. If none are known, return None.",
      "starter": "def oov_vector(word, ngram_vectors, min_n, max_n):\n    pass",
      "hint": "known = [ngram_vectors[g] for g in grams if g in ngram_vectors]; average column by column.",
      "test": "nv = {'<ru': [1.0, 0.0], 'run': [0.0, 1.0], 'unn': [0.5, 0.5], 'ing': [0.2, 0.8]}\nassert oov_vector('running', nv, 3, 3) == [0.425, 0.575], f'Got {oov_vector(\"running\", nv, 3, 3)}'\nassert oov_vector('xyz', nv, 3, 3) is None, 'Nothing known'\nassert oov_vector('run', {'<run>': [3.0, 1.0]}, 3, 3) == [3.0, 1.0], 'The whole word counts too'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "GloVe Weighting Function",
      "desc": "Write `glove_weight(x, x_max=100, alpha=0.75)` returning min(1, (x / x_max) ** alpha) rounded to 4 decimals, and 0.0 when x is 0. The weight stops very common pairs from dominating training.",
      "starter": "def glove_weight(x, x_max=100, alpha=0.75):\n    pass",
      "hint": "if x == 0: return 0.0; round(min(1.0, (x / x_max) ** alpha), 4)",
      "test": "assert glove_weight(100) == 1.0, 'At x_max the weight is 1'\nassert glove_weight(5000) == 1.0, 'Capped at 1'\nassert glove_weight(10) == 0.1778, f'Got {glove_weight(10)}'\nassert glove_weight(50, x_max=50, alpha=0.5) == 1.0, 'Custom settings'\nassert glove_weight(0) == 0.0, 'Pairs never seen get no weight'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Co-occurrence Counts",
      "desc": "Write `cooccurrence(tokens, window)`. For every pair of positions i < j with j - i <= window, count the word pair as a tuple sorted alphabetically (so ('cat', 'sat') and ('sat', 'cat') are the same key). Skip pairs of the same word. Return a dict from pair to count.",
      "starter": "def cooccurrence(tokens, window):\n    pass",
      "hint": "for i in range(len(tokens)): for j in range(i + 1, min(len(tokens), i + window + 1)): key = tuple(sorted((tokens[i], tokens[j])))",
      "test": "c = cooccurrence(['the', 'cat', 'sat', 'on', 'the', 'mat'], 2)\nassert c[('cat', 'the')] == 1 and c[('sat', 'the')] == 2, 'sat is within 2 of both \"the\"s'\nassert c[('on', 'the')] == 1 and c[('mat', 'the')] == 1 and c[('mat', 'on')] == 1, f'Got {c}'\nassert ('cat', 'mat') not in c, 'Too far apart'\nassert cooccurrence(['a', 'b', 'a', 'b'], 1) == {('a', 'b'): 3}, 'Order inside the pair does not matter'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Viterbi POS Tagger",
      "desc": "Write `viterbi(words, states, start, trans, emit)` returning the most likely tag sequence for words under a hidden Markov model. start[s] is P(first tag s), trans[s1][s2] is P(s2 after s1), emit[s][w] is P(word w | tag s) (missing words have probability 0). Use dynamic programming: keep, for each tag, the best probability of ending there and the path that got there. Ties go to the tag listed first in states.",
      "starter": "def viterbi(words, states, start, trans, emit):\n    pass",
      "hint": "best = {s: (start[s] * emit[s].get(words[0], 0), [s]) for s in states}; for each next word choose max over previous tags.",
      "test": "states = ['NOUN', 'VERB']\nstart = {'NOUN': 0.7, 'VERB': 0.3}\ntrans = {'NOUN': {'NOUN': 0.3, 'VERB': 0.7}, 'VERB': {'NOUN': 0.8, 'VERB': 0.2}}\nemit = {'NOUN': {'fish': 0.6, 'swim': 0.1, 'dogs': 0.3}, 'VERB': {'fish': 0.3, 'swim': 0.6, 'dogs': 0.1}}\nassert viterbi(['fish', 'swim'], states, start, trans, emit) == ['NOUN', 'VERB'], 'fish swim'\nassert viterbi(['dogs', 'fish'], states, start, trans, emit) == ['NOUN', 'VERB'], 'dogs fish (fish is a verb here)'\nassert viterbi(['swim'], states, start, trans, emit) == ['VERB'], f'On its own, swim is most likely a verb; got {viterbi([\"swim\"], states, start, trans, emit)}'\nprint('All checks passed.')"
    },
    "a": {
      "title": "HMM Sequence Probability",
      "desc": "Write `sequence_prob(tags, words, start, trans, emit)` returning the joint probability of one tag sequence and its words: start[t1] * emit[t1][w1] * trans[t1][t2] * emit[t2][w2] * ... Round to 6 decimals. Missing emissions count as 0.",
      "starter": "def sequence_prob(tags, words, start, trans, emit):\n    pass",
      "hint": "p = start[tags[0]] * emit[tags[0]].get(words[0], 0); for i in range(1, len(tags)): p *= trans[tags[i-1]][tags[i]] * emit[tags[i]].get(words[i], 0)",
      "test": "start = {'NOUN': 0.7, 'VERB': 0.3}\ntrans = {'NOUN': {'NOUN': 0.3, 'VERB': 0.7}, 'VERB': {'NOUN': 0.8, 'VERB': 0.2}}\nemit = {'NOUN': {'fish': 0.6, 'swim': 0.1}, 'VERB': {'fish': 0.3, 'swim': 0.6}}\nassert sequence_prob(['NOUN', 'VERB'], ['fish', 'swim'], start, trans, emit) == 0.1764, '0.7 * 0.6 * 0.7 * 0.6'\nassert sequence_prob(['VERB', 'NOUN'], ['fish', 'swim'], start, trans, emit) == 0.0072, f'Got {sequence_prob([\"VERB\", \"NOUN\"], [\"fish\", \"swim\"], start, trans, emit)}'\nassert sequence_prob(['NOUN'], ['cat'], start, trans, emit) == 0.0, 'Unknown word'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "BIO Tag Validator",
      "desc": "Write `valid_bio(tags)`. In the BIO scheme, 'B-X' begins an entity of type X, 'I-X' continues it and 'O' is outside any entity. Return True only if every 'I-X' comes right after a 'B-X' or an 'I-X' of the SAME type.",
      "starter": "def valid_bio(tags):\n    pass",
      "hint": "prev = 'O'; for t in tags: if t.startswith('I-') and prev[2:] != t[2:] or prev == 'O': invalid",
      "test": "assert valid_bio(['B-PER', 'I-PER', 'O', 'B-LOC']) is True, 'A valid sequence'\nassert valid_bio(['O', 'I-PER']) is False, 'I- cannot start an entity'\nassert valid_bio(['B-PER', 'I-LOC']) is False, 'The type must match'\nassert valid_bio(['B-ORG', 'I-ORG', 'I-ORG']) is True, 'Long entities are fine'\nassert valid_bio(['I-ORG']) is False, 'I- at the very start'\nprint('All checks passed.')"
    },
    "a": {
      "title": "BIO to Entity Spans",
      "desc": "Write `bio_spans(tokens, tags)` returning a list of (type, text) tuples for each entity, where text joins the entity's tokens with spaces. A 'B-X' starts a new entity; 'I-X' of the same type extends the current one; anything else ends it.",
      "starter": "def bio_spans(tokens, tags):\n    pass",
      "hint": "Keep the current (type, [tokens]); close it when a tag does not continue it.",
      "test": "toks = ['Sundar', 'Pichai', 'visited', 'New', 'Delhi', 'on', 'Monday']\ntags = ['B-PER', 'I-PER', 'O', 'B-LOC', 'I-LOC', 'O', 'B-DATE']\nassert bio_spans(toks, tags) == [('PER', 'Sundar Pichai'), ('LOC', 'New Delhi'), ('DATE', 'Monday')], f'Got {bio_spans(toks, tags)}'\nassert bio_spans(['A', 'B'], ['B-ORG', 'B-ORG']) == [('ORG', 'A'), ('ORG', 'B')], 'Two B- tags are two entities'\nassert bio_spans(['x'], ['O']) == [], 'No entities'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Naive Bayes Log Score",
      "desc": "Write `nb_log_score(log_prior, log_likelihoods)` returning log_prior + sum(log_likelihoods), rounded to 4 decimals. Adding logs avoids multiplying many tiny probabilities, which would underflow to 0.",
      "starter": "def nb_log_score(log_prior, log_likelihoods):\n    pass",
      "hint": "round(log_prior + sum(log_likelihoods), 4)",
      "test": "assert nb_log_score(-0.6931, [-2.3026, -1.2040]) == -4.1997, 'Add the logs'\nassert nb_log_score(-1.0, []) == -1.0, 'No words: just the prior'\nassert nb_log_score(-0.5, [-0.25, -0.25]) == -1.0, f'Got {nb_log_score(-0.5, [-0.25, -0.25])}'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Naive Bayes Classifier",
      "desc": "Write `nb_classify(tokens, priors, likelihoods, unknown=1e-6)`. priors maps class to P(class); likelihoods maps class to a dict of P(word | class). For each class compute log(prior) + sum(log(P(word | class))) using unknown for words the class has not seen. Return the class with the highest score (ties: alphabetical first).",
      "starter": "import math\n\n\ndef nb_classify(tokens, priors, likelihoods, unknown=1e-6):\n    pass",
      "hint": "score = math.log(priors[c]) + sum(math.log(likelihoods[c].get(w, unknown)) for w in tokens)",
      "test": "priors = {'pos': 0.5, 'neg': 0.5}\nlike = {'pos': {'great': 0.3, 'fun': 0.2, 'boring': 0.01}, 'neg': {'great': 0.02, 'fun': 0.03, 'boring': 0.4}}\nassert nb_classify(['great', 'fun'], priors, like) == 'pos', 'Positive words'\nassert nb_classify(['boring', 'boring', 'fun'], priors, like) == 'neg', 'Negative words win'\nassert nb_classify([], {'a': 0.3, 'b': 0.7}, {'a': {}, 'b': {}}) == 'b', 'No words: the larger prior wins'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "RNN Hidden State Step",
      "desc": "Write `rnn_step(w_hh, h_prev, w_xh, x, b)` for a one-number RNN: h = tanh(w_hh * h_prev + w_xh * x + b), rounded to 4 decimals. Use math.tanh.",
      "starter": "import math\n\n\ndef rnn_step(w_hh, h_prev, w_xh, x, b):\n    pass",
      "hint": "round(math.tanh(w_hh * h_prev + w_xh * x + b), 4)",
      "test": "assert rnn_step(0.5, 0.0, 1.0, 0.0, 0.0) == 0.0, 'All zeros'\nassert rnn_step(0.5, 0.2, 1.0, 0.3, 0.1) == 0.4621, f'Got {rnn_step(0.5, 0.2, 1.0, 0.3, 0.1)}'\nassert rnn_step(1.0, 5.0, 1.0, 5.0, 0.0) == 1.0, 'tanh saturates at 1'\nassert rnn_step(1.0, -0.5, 0.0, 9.9, 0.0) == -0.4621, 'Negative states'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Vanishing Gradient Check",
      "desc": "When a gradient flows back through many RNN steps it is multiplied by roughly the same factor each step. Write `gradient_after(factor, steps)` returning {'gradient': factor ** steps rounded to 6 decimals, 'status': ...} where status is 'VANISHING' if the absolute gradient is below 0.001, 'EXPLODING' if above 1000, else 'STABLE'.",
      "starter": "def gradient_after(factor, steps):\n    pass",
      "hint": "g = factor ** steps; status from abs(g)",
      "test": "assert gradient_after(0.5, 20) == {'gradient': 1e-06, 'status': 'VANISHING'}, f'Got {gradient_after(0.5, 20)}'\nassert gradient_after(1.5, 20)['status'] == 'EXPLODING', '1.5 ** 20 is over 3,000'\nassert gradient_after(0.9, 5) == {'gradient': 0.59049, 'status': 'STABLE'}, 'A few steps is fine'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "LSTM Cell State",
      "desc": "Write `lstm_cell(f, c_prev, i, c_candidate)` returning the new cell state f * c_prev + i * c_candidate, rounded to 4 decimals. f is the forget gate and i the input gate, both between 0 and 1.",
      "starter": "def lstm_cell(f, c_prev, i, c_candidate):\n    pass",
      "hint": "round(f * c_prev + i * c_candidate, 4)",
      "test": "assert lstm_cell(1.0, 0.8, 0.0, 0.5) == 0.8, 'Forget gate open, input closed: memory kept'\nassert lstm_cell(0.0, 0.8, 1.0, 0.5) == 0.5, 'Forget everything, write the new value'\nassert lstm_cell(0.9, 0.5, 0.3, -0.2) == 0.39, f'Got {lstm_cell(0.9, 0.5, 0.3, -0.2)}'\nprint('All checks passed.')"
    },
    "a": {
      "title": "GRU Update",
      "desc": "Write `gru_update(z, h_prev, h_candidate)` for a GRU: h = (1 - z) * h_prev + z * h_candidate, rounded to 4 decimals, where z is the update gate. Also accept lists: if h_prev and h_candidate are lists, apply the formula element by element and return a list.",
      "starter": "def gru_update(z, h_prev, h_candidate):\n    pass",
      "hint": "if isinstance(h_prev, list): return [gru_update(z, a, b) for a, b in zip(h_prev, h_candidate)]",
      "test": "assert gru_update(0.0, 0.7, 0.1) == 0.7, 'z = 0 keeps the old state'\nassert gru_update(1.0, 0.7, 0.1) == 0.1, 'z = 1 takes the new state'\nassert gru_update(0.25, 0.8, 0.4) == 0.7, f'Got {gru_update(0.25, 0.8, 0.4)}'\nassert gru_update(0.5, [1.0, 0.0], [0.0, 1.0]) == [0.5, 0.5], 'Lists work element by element'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Bidirectional Pass",
      "desc": "Write `bidirectional(xs, step, h0=0.0)`. Run step(h, x) forward over xs starting from h0, and separately backward (from the last x to the first). Return a list of (forward_state, backward_state) pairs, one per position, where both states are the ones AFTER reading that position's x. This is how a BiLSTM sees context on both sides.",
      "starter": "def bidirectional(xs, step, h0=0.0):\n    pass",
      "hint": "Build fwd left to right and bwd right to left (then reverse bwd so it lines up), then zip.",
      "test": "add = lambda h, x: h + x\nassert bidirectional([1, 2, 3], add) == [(1, 6), (3, 5), (6, 3)], f'Got {bidirectional([1, 2, 3], add)}'\nassert bidirectional([], add) == [], 'Empty input'\nlast = lambda h, x: x\nassert bidirectional(['a', 'b'], last, '') == [('a', 'a'), ('b', 'b')], 'Each state is after reading that position'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Sentence Embedding",
      "desc": "Write `sentence_embedding(tokens, vectors)` returning the element-wise average of the vectors of the tokens found in vectors, rounded to 4 decimals. Unknown tokens are skipped; if none are known, return None.",
      "starter": "def sentence_embedding(tokens, vectors):\n    pass",
      "hint": "known = [vectors[t] for t in tokens if t in vectors]; [round(sum(col) / len(known), 4) for col in zip(*known)]",
      "test": "vecs = {'good': [1.0, 0.0], 'movie': [0.0, 1.0], 'very': [0.5, 0.5]}\nassert sentence_embedding(['very', 'good', 'movie'], vecs) == [0.5, 0.5], f'Got {sentence_embedding([\"very\", \"good\", \"movie\"], vecs)}'\nassert sentence_embedding(['good', 'good', 'unknownword'], vecs) == [1.0, 0.0], 'Unknown words are skipped'\nassert sentence_embedding(['???'], vecs) is None, 'Nothing known'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Teacher Forcing Schedule",
      "desc": "Write `teacher_forcing_ratio(epoch, max_epochs, decay=1.0)` returning max(0.1, 1.0 - (epoch / max_epochs) * decay), rounded to 4 decimals. Early in training the decoder is fed the true previous word; later it increasingly uses its own predictions.",
      "starter": "def teacher_forcing_ratio(epoch, max_epochs, decay=1.0):\n    pass",
      "hint": "round(max(0.1, 1.0 - epoch / max_epochs * decay), 4)",
      "test": "assert teacher_forcing_ratio(0, 10) == 1.0, 'Start fully teacher-forced'\nassert teacher_forcing_ratio(5, 10) == 0.5, 'Halfway'\nassert teacher_forcing_ratio(10, 10) == 0.1, 'Never below 0.1'\nassert teacher_forcing_ratio(3, 10, 0.5) == 0.85, f'Got {teacher_forcing_ratio(3, 10, 0.5)}'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Decoder Inputs",
      "desc": "Write `decoder_inputs(targets, predictions, teacher)` returning the word fed into the decoder at each step. Step 0 always gets '<s>'. At step t > 0 feed targets[t - 1] if teacher is True (teacher forcing) or predictions[t - 1] if False. Return a list as long as targets.",
      "starter": "def decoder_inputs(targets, predictions, teacher):\n    pass",
      "hint": "['<s>'] + (targets if teacher else predictions)[:len(targets) - 1]",
      "test": "tgt = ['je', 'suis', 'content']\npred = ['je', 'es', 'contente']\nassert decoder_inputs(tgt, pred, True) == ['<s>', 'je', 'suis'], 'Teacher forcing feeds the true words'\nassert decoder_inputs(tgt, pred, False) == ['<s>', 'je', 'es'], 'Free running feeds its own guesses'\nassert decoder_inputs(['x'], ['y'], False) == ['<s>'], 'One step'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Stable Softmax",
      "desc": "Write `softmax(scores)` returning e^s / sum(e^s) for each score, each rounded to 4 decimals. Subtract the largest score from every score first, which gives the same result but avoids overflow for big numbers.",
      "starter": "import math\n\n\ndef softmax(scores):\n    pass",
      "hint": "m = max(scores); exps = [math.exp(s - m) for s in scores]; total = sum(exps)",
      "test": "assert softmax([1.0, 1.0]) == [0.5, 0.5], 'Equal scores, equal weights'\nassert softmax([2.0, 1.0, 0.1]) == [0.659, 0.2424, 0.0986], f'Got {softmax([2.0, 1.0, 0.1])}'\nassert softmax([1000.0, 1000.0]) == [0.5, 0.5], 'Big numbers must not overflow'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Attention Context Vector",
      "desc": "Write `context_vector(weights, values)` returning the weighted sum of the value vectors: sum over i of weights[i] * values[i], element by element, rounded to 4 decimals. This is what attention hands to the decoder.",
      "starter": "def context_vector(weights, values):\n    pass",
      "hint": "[round(sum(w * v[j] for w, v in zip(weights, values)), 4) for j in range(len(values[0]))]",
      "test": "vals = [[1.0, 0.0], [0.0, 1.0], [1.0, 1.0]]\nassert context_vector([1.0, 0.0, 0.0], vals) == [1.0, 0.0], 'All attention on the first word'\nassert context_vector([0.5, 0.25, 0.25], vals) == [0.75, 0.5], f'Got {context_vector([0.5, 0.25, 0.25], vals)}'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Scaled Dot-Product Score",
      "desc": "Write `scaled_score(q, k)` returning dot(q, k) / sqrt(len(k)), rounded to 4 decimals. Dividing by the square root of the key size keeps scores in a range where softmax still learns.",
      "starter": "import math\n\n\ndef scaled_score(q, k):\n    pass",
      "hint": "round(sum(a * b for a, b in zip(q, k)) / math.sqrt(len(k)), 4)",
      "test": "assert scaled_score([1, 0, 1, 0], [1, 1, 1, 1]) == 1.0, 'dot 2, divided by sqrt(4)'\nassert scaled_score([1, 2], [3, 4]) == 7.7782, f'Got {scaled_score([1, 2], [3, 4])}'\nassert scaled_score([1, -1], [1, 1]) == 0.0, 'Orthogonal'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Self-Attention",
      "desc": "Write `self_attention(Q, K, V)` for lists of vectors. For each query q in Q: score every key with dot(q, k) / sqrt(d) (d = len(k)), turn the scores into weights with softmax, and output the weighted sum of the value vectors. Return the list of outputs, every number rounded to 4 decimals (round only at the end).",
      "starter": "import math\n\n\ndef self_attention(Q, K, V):\n    pass",
      "hint": "For each q: scores -> exps (subtract max) -> weights -> [sum(w * v[j]) for j]",
      "test": "Q = [[1.0, 0.0], [0.0, 1.0]]\nK = [[1.0, 0.0], [0.0, 1.0]]\nV = [[10.0, 0.0], [0.0, 10.0]]\nout = self_attention(Q, K, V)\nassert out == [[6.6976, 3.3024], [3.3024, 6.6976]], f'Got {out}'\nsame = self_attention([[1.0, 1.0]], [[1.0, 1.0], [1.0, 1.0]], [[2.0, 0.0], [4.0, 0.0]])\nassert same == [[3.0, 0.0]], 'Equal scores average the values'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Head Dimension",
      "desc": "Write `head_dim(d_model, heads)` returning d_model // heads. If heads is not positive, or d_model is not evenly divisible by heads, raise ValueError.",
      "starter": "def head_dim(d_model, heads):\n    pass",
      "hint": "if heads <= 0 or d_model % heads: raise ValueError(...)",
      "test": "assert head_dim(512, 8) == 64, 'The original Transformer: 512 / 8'\nassert head_dim(768, 12) == 64, 'BERT base'\nfor bad in [(512, 7), (512, 0)]:\n    try:\n        head_dim(*bad)\n        raise AssertionError(f'{bad} must raise ValueError')\n    except ValueError:\n        pass\nprint('All checks passed.')"
    },
    "a": {
      "title": "Split Into Heads",
      "desc": "Write `split_heads(vector, heads)` that splits one vector into heads equal consecutive chunks, returning a list of lists. Raise ValueError if the length is not divisible by heads. Also write `merge_heads(chunks)` that joins them back into one list.",
      "starter": "def split_heads(vector, heads):\n    pass\n\n\ndef merge_heads(chunks):\n    pass",
      "hint": "size = len(vector) // heads; [vector[i * size:(i + 1) * size] for i in range(heads)]",
      "test": "v = [1, 2, 3, 4, 5, 6, 7, 8]\nassert split_heads(v, 4) == [[1, 2], [3, 4], [5, 6], [7, 8]], f'Got {split_heads(v, 4)}'\nassert split_heads(v, 2) == [[1, 2, 3, 4], [5, 6, 7, 8]], 'Two heads of 4'\nassert merge_heads(split_heads(v, 4)) == v, 'Merging undoes splitting'\ntry:\n    split_heads(v, 3)\n    raise AssertionError('8 values cannot be split into 3 heads')\nexcept ValueError:\n    pass\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Sinusoidal Positional Encoding",
      "desc": "Write `positional_encoding(pos, i, d_model)` for one entry of the encoding. Let angle = pos / 10000 ** (2 * (i // 2) / d_model). Return sin(angle) for even i and cos(angle) for odd i, rounded to 4 decimals.",
      "starter": "import math\n\n\ndef positional_encoding(pos, i, d_model):\n    pass",
      "hint": "angle = pos / 10000 ** (2 * (i // 2) / d_model); math.sin(angle) if i % 2 == 0 else math.cos(angle)",
      "test": "assert positional_encoding(0, 0, 8) == 0.0, 'sin(0)'\nassert positional_encoding(0, 1, 8) == 1.0, 'cos(0)'\nassert positional_encoding(1, 0, 8) == 0.8415, 'sin(1)'\nassert positional_encoding(1, 1, 8) == 0.5403, 'cos(1)'\nassert positional_encoding(10, 2, 8) == 0.8415, f'Got {positional_encoding(10, 2, 8)}'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Rotary Position Rotation",
      "desc": "RoPE encodes position by rotating pairs of numbers. Write `rotate_pair(x, y, pos, theta)` that rotates the point (x, y) by angle = pos * theta: (x*cos - y*sin, x*sin + y*cos), each rounded to 4 decimals, returned as a tuple.",
      "starter": "import math\n\n\ndef rotate_pair(x, y, pos, theta):\n    pass",
      "hint": "a = pos * theta; (round(x * math.cos(a) - y * math.sin(a), 4), round(x * math.sin(a) + y * math.cos(a), 4))",
      "test": "assert rotate_pair(1.0, 0.0, 0, 0.5) == (1.0, 0.0), 'Position 0 is not rotated'\nassert rotate_pair(1.0, 0.0, 1, math.pi / 2) == (0.0, 1.0), 'A quarter turn'\nassert rotate_pair(2.0, 1.0, 3, 0.1) == (1.6152, 1.5464), f'Got {rotate_pair(2.0, 1.0, 3, 0.1)}'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Add Positional Encodings",
      "desc": "Write `add_positions(embeddings)` where embeddings is a list of token vectors, all of length d. Add to each vector at position pos the sinusoidal encoding for every index i (sin for even i, cos for odd i, with angle = pos / 10000 ** (2 * (i // 2) / d)). Round every number to 4 decimals.",
      "starter": "import math\n\n\ndef add_positions(embeddings):\n    pass",
      "hint": "for pos, vec in enumerate(embeddings): new = [v + pe(pos, i, d) for i, v in enumerate(vec)]",
      "test": "emb = [[0.0, 0.0, 0.0, 0.0], [0.0, 0.0, 0.0, 0.0], [1.0, 1.0, 1.0, 1.0]]\nout = add_positions(emb)\nassert out[0] == [0.0, 1.0, 0.0, 1.0], 'Position 0 adds sin(0), cos(0), ...'\nassert out[1] == [0.8415, 0.5403, 0.01, 1.0], f'Got {out[1]}'\nassert out[2] == [1.9093, 0.5839, 1.02, 1.9998], f'Got {out[2]}'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Layer Normalization",
      "desc": "Write `layer_norm(x, eps=1e-5)` returning (x_i - mean) / sqrt(variance + eps) for each value, rounded to 4 decimals, where variance is the average squared difference from the mean. Transformers apply this after every sub-layer to keep numbers well scaled.",
      "starter": "import math\n\n\ndef layer_norm(x, eps=1e-5):\n    pass",
      "hint": "mean = sum(x) / len(x); var = sum((v - mean) ** 2 for v in x) / len(x)",
      "test": "assert layer_norm([1.0, 2.0, 3.0]) == [-1.2247, 0.0, 1.2247], f'Got {layer_norm([1.0, 2.0, 3.0])}'\nassert layer_norm([5.0, 5.0]) == [0.0, 0.0], 'Constant input becomes zeros'\nout = layer_norm([2.0, 4.0, 6.0, 8.0])\nassert out == [-1.3416, -0.4472, 0.4472, 1.3416], f'Got {out}'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "BPE Merge",
      "desc": "Write `merge_pair(tokens, pair, new_token)` that scans tokens left to right and replaces every adjacent occurrence of pair[0] followed by pair[1] with new_token. Merged tokens are not re-used for an overlapping match.",
      "starter": "def merge_pair(tokens, pair, new_token):\n    pass",
      "hint": "i = 0; while i < len(tokens): if i + 1 < len(tokens) and (tokens[i], tokens[i + 1]) == pair: out.append(new_token); i += 2",
      "test": "assert merge_pair(['l', 'o', 'w', 'e', 'r'], ('l', 'o'), 'lo') == ['lo', 'w', 'e', 'r'], 'One merge'\nassert merge_pair(['a', 'a', 'a'], ('a', 'a'), 'aa') == ['aa', 'a'], 'No overlapping merges'\nassert merge_pair(['t', 'h', 'e', ' ', 't', 'h', 'e'], ('t', 'h'), 'th') == ['th', 'e', ' ', 'th', 'e'], 'Every occurrence'\nassert merge_pair(['x', 'y'], ('y', 'x'), 'yx') == ['x', 'y'], 'Order matters'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Most Frequent Pair",
      "desc": "Write `most_frequent_pair(tokens)` returning the adjacent pair (as a tuple) that occurs most often. Ties go to the pair that appears first. Return None if there are fewer than two tokens. This is the pair BPE merges next.",
      "starter": "def most_frequent_pair(tokens):\n    pass",
      "hint": "Count pairs in a dict (which keeps first-seen order), then pick the max count; max() keeps the first of equal counts.",
      "test": "assert most_frequent_pair(list('abababc')) == ('a', 'b'), 'ab appears 3 times'\nassert most_frequent_pair(['l', 'o', 'w', ' ', 'l', 'o', 'w', 'e', 'r']) == ('l', 'o'), 'lo and ow tie; lo came first'\nassert most_frequent_pair(list('xyzzy')) == ('x', 'y'), f'Got {most_frequent_pair(list(\"xyzzy\"))}'\nassert most_frequent_pair(['a']) is None, 'Nothing to merge'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "BERT Masking Split",
      "desc": "BERT picks 15% of tokens to predict, then replaces 80% of those with [MASK], 10% with a random token and leaves 10% unchanged. Write `bert_mask_plan(n_tokens)` returning {'selected': round(n_tokens * 0.15), 'mask': ..., 'random': ..., 'unchanged': ...} where mask = round(selected * 0.8), random = round(selected * 0.1), and unchanged is whatever is left so the three add up to selected.",
      "starter": "def bert_mask_plan(n_tokens):\n    pass",
      "hint": "selected = round(n_tokens * 0.15); mask = round(selected * 0.8); random = round(selected * 0.1); unchanged = selected - mask - random",
      "test": "assert bert_mask_plan(1000) == {'selected': 150, 'mask': 120, 'random': 15, 'unchanged': 15}, f'Got {bert_mask_plan(1000)}'\nassert bert_mask_plan(128) == {'selected': 19, 'mask': 15, 'random': 2, 'unchanged': 2}, f'Got {bert_mask_plan(128)}'\np = bert_mask_plan(7)\nassert p['mask'] + p['random'] + p['unchanged'] == p['selected'], 'The parts must add up'\nprint('All checks passed.')"
    },
    "a": {
      "title": "BERT Input Builder",
      "desc": "Write `bert_input(tokens_a, tokens_b=None)` returning (tokens, segment_ids). tokens is ['[CLS]'] + tokens_a + ['[SEP]'], plus tokens_b + ['[SEP]'] when a second sentence is given. segment_ids is 0 for [CLS], sentence A and its [SEP], and 1 for sentence B and its [SEP].",
      "starter": "def bert_input(tokens_a, tokens_b=None):\n    pass",
      "hint": "first = ['[CLS]'] + tokens_a + ['[SEP]']; segments = [0] * len(first)",
      "test": "toks, segs = bert_input(['my', 'dog'], ['it', 'barks'])\nassert toks == ['[CLS]', 'my', 'dog', '[SEP]', 'it', 'barks', '[SEP]'], f'Got {toks}'\nassert segs == [0, 0, 0, 0, 1, 1, 1], f'Got {segs}'\nassert bert_input(['hello']) == (['[CLS]', 'hello', '[SEP]'], [0, 0, 0]), 'One sentence'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Causal Attention Mask",
      "desc": "Write `causal_mask(n)` returning an n x n list of lists where entry [i][j] is 0.0 if j <= i (a token may look at itself and earlier tokens) and float('-inf') if j > i (the future is hidden).",
      "starter": "def causal_mask(n):\n    pass",
      "hint": "[[0.0 if j <= i else float('-inf') for j in range(n)] for i in range(n)]",
      "test": "NEG = float('-inf')\nassert causal_mask(3) == [[0.0, NEG, NEG], [0.0, 0.0, NEG], [0.0, 0.0, 0.0]], f'Got {causal_mask(3)}'\nassert causal_mask(1) == [[0.0]], 'A single token sees itself'\nassert sum(v == NEG for row in causal_mask(5) for v in row) == 10, 'Half of the off-diagonal is hidden'\nprint('All checks passed.')"
    },
    "a": {
      "title": "KV Cache Size",
      "desc": "During generation, GPT models cache every past token's keys and values. Write `kv_cache_bytes(layers, heads, head_dim, seq_len, batch=1, bytes_per_value=2)` returning 2 * layers * heads * head_dim * seq_len * batch * bytes_per_value (the 2 is for keys and values). Also write `to_gib(n)` returning n / 1024**3 rounded to 2 decimals.",
      "starter": "def kv_cache_bytes(layers, heads, head_dim, seq_len, batch=1, bytes_per_value=2):\n    pass\n\n\ndef to_gib(n):\n    pass",
      "hint": "return 2 * layers * heads * head_dim * seq_len * batch * bytes_per_value",
      "test": "assert kv_cache_bytes(1, 1, 1, 1) == 4, 'One layer, one head, one number, keys and values, 2 bytes each'\nb = kv_cache_bytes(32, 32, 128, 4096)\nassert b == 2147483648 and to_gib(b) == 2.0, f'A 7B-size model at 4,096 tokens needs 2 GiB, got {b}'\nassert to_gib(kv_cache_bytes(32, 32, 128, 4096, batch=8)) == 16.0, 'Batch 8 needs 8 times as much'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Best Answer Span",
      "desc": "Write `best_span(start_logits, end_logits, max_len)` returning the (i, j) pair with i <= j < i + max_len that maximises start_logits[i] + end_logits[j]. Ties go to the smallest i, then the smallest j.",
      "starter": "def best_span(start_logits, end_logits, max_len):\n    pass",
      "hint": "Two loops; compare scores with > so the first best pair is kept.",
      "test": "start = [0.1, 2.0, 0.3, 0.2, 1.5]\nend = [0.0, 0.5, 2.5, 0.1, 3.0]\nassert best_span(start, end, 2) == (1, 2), 'start 1, end 2: 2.0 + 2.5'\nassert best_span(start, end, 4) == (1, 4), f'Longer spans allowed: got {best_span(start, end, 4)}'\nassert best_span([1.0, 1.0], [1.0, 1.0], 1) == (0, 0), 'Ties: smallest i, then j'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Exact Match Score",
      "desc": "Write `exact_match(prediction, truth)` returning 1 if the two answers match after SQuAD-style normalisation, else 0. Normalise by lowercasing, removing punctuation, removing the words 'a', 'an' and 'the', and collapsing whitespace.",
      "starter": "import string\n\n\ndef exact_match(prediction, truth):\n    pass",
      "hint": "text = ''.join(ch for ch in s.lower() if ch not in string.punctuation); ' '.join(w for w in text.split() if w not in {'a', 'an', 'the'})",
      "test": "assert exact_match('The Eiffel Tower', 'eiffel tower') == 1, 'Case and articles are ignored'\nassert exact_match('Paris, France.', 'paris france') == 1, 'Punctuation is ignored'\nassert exact_match('London', 'Paris') == 0, 'Different answers'\nassert exact_match('an apple', 'apples') == 0, 'Plurals still differ'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Two-Stage Retrieval Check",
      "desc": "Write `check_two_stage(corpus_size, k1, k2)` for a retriever that shortlists k1 documents quickly, then re-ranks them and keeps k2. Return a list of problems: 'K1_NOT_SMALLER_THAN_CORPUS' if k1 >= corpus_size, 'K2_NOT_SMALLER_THAN_K1' if k2 >= k1, 'K2_NOT_POSITIVE' if k2 <= 0. An empty list means the design is valid.",
      "starter": "def check_two_stage(corpus_size, k1, k2):\n    pass",
      "hint": "Append each problem that applies, in the order given.",
      "test": "assert check_two_stage(1_000_000, 100, 5) == [], 'A good funnel'\nassert check_two_stage(50, 100, 5) == ['K1_NOT_SMALLER_THAN_CORPUS'], 'The shortlist cannot exceed the corpus'\nassert check_two_stage(1000, 10, 10) == ['K2_NOT_SMALLER_THAN_K1'], 'Re-ranking must narrow'\nassert check_two_stage(10, 20, 0) == ['K1_NOT_SMALLER_THAN_CORPUS', 'K2_NOT_POSITIVE'], f'Got {check_two_stage(10, 20, 0)}'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Cross-Encoder Re-rank",
      "desc": "Write `rerank(candidates, scores, k)` where candidates is the stage-1 list of doc ids (best first by the fast retriever) and scores maps a doc id to its cross-encoder score. Return the top k ids by cross-encoder score, highest first; ties keep the stage-1 order. Candidates without a score are dropped.",
      "starter": "def rerank(candidates, scores, k):\n    pass",
      "hint": "sorted((c for c in candidates if c in scores), key=lambda c: -scores[c])[:k]  (sorted is stable)",
      "test": "cands = ['d7', 'd2', 'd9', 'd4']\nscores = {'d7': 0.2, 'd2': 0.9, 'd9': 0.9, 'd4': 0.5}\nassert rerank(cands, scores, 3) == ['d2', 'd9', 'd4'], f'Got {rerank(cands, scores, 3)}'\nassert rerank(cands, {'d4': 0.1}, 2) == ['d4'], 'Unscored candidates are dropped'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Nucleus (Top-p) Filter",
      "desc": "Write `top_p(probs, p)` where probs maps tokens to probabilities. Sort tokens by probability (highest first, ties alphabetical) and return the shortest prefix whose cumulative probability is at least p. Round the running total to 9 decimals before comparing, to avoid floating point surprises.",
      "starter": "def top_p(probs, p):\n    pass",
      "hint": "for tok in sorted(probs, key=lambda t: (-probs[t], t)): keep.append(tok); total += probs[tok]; if round(total, 9) >= p: break",
      "test": "probs = {'the': 0.5, 'a': 0.2, 'one': 0.15, 'this': 0.1, 'zebra': 0.05}\nassert top_p(probs, 0.5) == ['the'], 'One token already reaches 0.5'\nassert top_p(probs, 0.8) == ['the', 'a', 'one'], f'Got {top_p(probs, 0.8)}'\nassert top_p(probs, 1.0) == ['the', 'a', 'one', 'this', 'zebra'], 'p = 1 keeps everything'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Temperature Scaling",
      "desc": "Write `apply_temperature(logits, t)` returning softmax(logits / t) rounded to 4 decimals. When t is 0, return greedy decoding as a one-hot list: 1.0 for the first largest logit and 0.0 elsewhere.",
      "starter": "import math\n\n\ndef apply_temperature(logits, t):\n    pass",
      "hint": "if t == 0: one-hot of logits.index(max(logits)); else scaled = [l / t for l in logits] then stable softmax",
      "test": "assert apply_temperature([2.0, 1.0, 0.0], 1.0) == [0.6652, 0.2447, 0.09], f'Got {apply_temperature([2.0, 1.0, 0.0], 1.0)}'\nassert apply_temperature([2.0, 1.0, 0.0], 0.5) == [0.8668, 0.1173, 0.0159], 'Low temperature sharpens'\nassert apply_temperature([2.0, 1.0, 0.0], 10.0) == [0.3672, 0.3322, 0.3006], 'High temperature flattens'\nassert apply_temperature([1.0, 3.0, 3.0], 0) == [0.0, 1.0, 0.0], 'Temperature 0 is greedy'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "BLEU Brevity Penalty",
      "desc": "Write `brevity_penalty(candidate_len, reference_len)` returning 1.0 if the candidate is longer than the reference, otherwise exp(1 - reference_len / candidate_len), rounded to 4 decimals. A candidate of length 0 gets 0.0.",
      "starter": "import math\n\n\ndef brevity_penalty(candidate_len, reference_len):\n    pass",
      "hint": "if candidate_len == 0: 0.0; if candidate_len > reference_len: 1.0; else round(math.exp(1 - reference_len / candidate_len), 4)",
      "test": "assert brevity_penalty(12, 10) == 1.0, 'Longer than the reference: no penalty'\nassert brevity_penalty(10, 10) == 1.0, 'Equal length: exp(0) = 1'\nassert brevity_penalty(8, 10) == 0.7788, f'Got {brevity_penalty(8, 10)}'\nassert brevity_penalty(0, 10) == 0.0, 'Empty output'\nprint('All checks passed.')"
    },
    "a": {
      "title": "ROUGE-1 Recall",
      "desc": "Write `rouge1_recall(candidate, reference)` for token lists: the number of reference words also in the candidate (each word counted at most as often as it appears in the candidate), divided by the reference length, rounded to 4 decimals. An empty reference gives 0.0.",
      "starter": "from collections import Counter\n\n\ndef rouge1_recall(candidate, reference):\n    pass",
      "hint": "overlap = sum(min(n, Counter(candidate)[w]) for w, n in Counter(reference).items())",
      "test": "ref = ['the', 'cat', 'sat', 'on', 'the', 'mat']\nassert rouge1_recall(['the', 'cat', 'on', 'the', 'mat'], ref) == 0.8333, f'Got {rouge1_recall([\"the\", \"cat\", \"on\", \"the\", \"mat\"], ref)}'\nassert rouge1_recall(['the', 'the', 'the', 'the'], ref) == 0.3333, 'Repeats are clipped to the reference count'\nassert rouge1_recall([], ref) == 0.0, 'Empty summary'\nassert rouge1_recall(['x'], []) == 0.0, 'Empty reference'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "LoRA Parameter Savings",
      "desc": "Write `lora_params(d, k, r)` for a d x k weight matrix adapted with rank r. Return {'full': d * k, 'lora': r * (d + k), 'saving_pct': (1 - lora / full) * 100 rounded to 2 decimals}.",
      "starter": "def lora_params(d, k, r):\n    pass",
      "hint": "full = d * k; lora = r * (d + k)",
      "test": "assert lora_params(4096, 4096, 8) == {'full': 16777216, 'lora': 65536, 'saving_pct': 99.61}, f'Got {lora_params(4096, 4096, 8)}'\nassert lora_params(100, 50, 10) == {'full': 5000, 'lora': 1500, 'saving_pct': 70.0}, 'Small example'\nprint('All checks passed.')"
    },
    "a": {
      "title": "LoRA Weight Merge",
      "desc": "Write `lora_merge(W, B, A, alpha, r)` returning W + (alpha / r) * (B @ A) for small matrices given as lists of lists: W is d x k, B is d x r and A is r x k. Round every entry to 4 decimals. Merging lets a fine-tuned model run with no extra cost.",
      "starter": "def lora_merge(W, B, A, alpha, r):\n    pass",
      "hint": "delta[i][j] = sum(B[i][t] * A[t][j] for t in range(r)); W[i][j] + alpha / r * delta",
      "test": "W = [[1.0, 0.0], [0.0, 1.0]]\nB = [[1.0], [2.0]]\nA = [[0.5, 0.25]]\nassert lora_merge(W, B, A, 1, 1) == [[1.5, 0.25], [1.0, 1.5]], f'Got {lora_merge(W, B, A, 1, 1)}'\nassert lora_merge(W, B, A, 2, 1) == [[2.0, 0.5], [2.0, 2.0]], 'alpha scales the update'\nassert lora_merge(W, [[0.0], [0.0]], A, 8, 1) == W, 'B starts at zero, so training starts from W'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Retrieval for Question Answering",
      "desc": "Write `retrieve(question, passages, stopwords, k)` where passages maps an id to text. Tokenise the question and each passage by lowercasing, keeping only letters, digits and spaces, splitting, and removing stopwords. Represent each as a word-count dict and score passages by cosine similarity with the question. Return the ids of the top k passages with a score above 0, best first, ties by id.",
      "starter": "import math\nimport re\n\n\ndef retrieve(question, passages, stopwords, k):\n    pass",
      "hint": "counts = Counter(tokens); cosine over the union of keys; sorted by (-score, id)",
      "test": "passages = {\n    'p1': 'Mount Everest is the highest mountain on Earth.',\n    'p2': 'The Nile is the longest river in Africa.',\n    'p3': 'Everest base camp is in Nepal; climbers acclimatise there.',\n    'p4': 'Python is a programming language.',\n}\nstop = {'is', 'the', 'on', 'in', 'a', 'what', 'which', 'there'}\nassert retrieve('What is the highest mountain?', passages, stop, 2) == ['p1'], f'Got {retrieve(\"What is the highest mountain?\", passages, stop, 2)}'\nassert retrieve('Everest in Nepal', passages, stop, 2) == ['p3', 'p1'], 'p3 mentions both words'\nassert retrieve('quantum physics', passages, stop, 3) == [], 'No overlap, no results'\nprint('All checks passed.')"
    },
    "a": {
      "title": "NLP Capstone Audit",
      "desc": "Write `audit_nlp_capstone(results)` where results maps a component name (such as 'tokenizer', 'retriever', 'attention') to a score from 0 to 100. A component passes at 70 or more. Return {'passed': sorted passing names, 'failed': sorted failing names, 'average': mean score rounded to 1 decimal, 'certified': True only if nothing failed, the average is at least 80, and there is at least one component}.",
      "starter": "def audit_nlp_capstone(results):\n    pass",
      "hint": "passed = sorted(n for n, s in results.items() if s >= 70); average = round(sum(results.values()) / len(results), 1) if results else 0.0",
      "test": "r = {'tokenizer': 95, 'retriever': 82, 'attention': 88}\nassert audit_nlp_capstone(r) == {'passed': ['attention', 'retriever', 'tokenizer'], 'failed': [], 'average': 88.3, 'certified': True}, f'Got {audit_nlp_capstone(r)}'\nlow = {'tokenizer': 72, 'retriever': 71, 'attention': 70}\nassert audit_nlp_capstone(low)['certified'] is False, 'All pass but the average is under 80'\nbad = {'tokenizer': 99, 'retriever': 40}\nassert audit_nlp_capstone(bad)['failed'] == ['retriever'] and audit_nlp_capstone(bad)['certified'] is False, 'One failure'\nassert audit_nlp_capstone({}) == {'passed': [], 'failed': [], 'average': 0.0, 'certified': False}, 'Nothing to certify'\nprint('All checks passed.')"
    }
  }
];

export const NLP_PYTHON_30_DAYS_CONFIGS: DayConfig[] = NLP_30_DAYS_CONFIGS.map((cfg, i) => {
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

export const NLP_PYTHON_30_DAYS_QUESTS: CourseQuest[] = NLP_PYTHON_30_DAYS_CONFIGS.flatMap((cfg, idx) =>
  buildEnrichedDayQuests('nlp-py', idx + 1, cfg)
);
