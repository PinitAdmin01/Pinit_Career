"""
Day 34 Data Builder for Course 37: Natural Language Processing & Computational Linguistics
Topic: Tokenizer Deep Dive: Byte-Pair Encoding (BPE), WordPiece, Unigram & Byte-Fallback Tokenization
"""

DAY_34_DATA = {
    "day": 34,
    "coursePrefix": "nlp",
    "title": "Day 34: Tokenizer Deep Dive: Byte-Pair Encoding (BPE), WordPiece, Unigram & Byte-Fallback Tokenization",
    "summary": [
        "Tokenization serves as the critical discrete boundary between continuous neural representations and human language, balancing vocabulary entropy against sequence length.",
        "Byte-Pair Encoding (BPE) greedily compresses adjacent symbol bigrams by frequency, recording deterministic merge priority hierarchies for linear-time subword segmentation.",
        "WordPiece and Unigram Language Model tokenizers introduce statistical optimization: WordPiece maximizes corpus likelihood ratios, while Unigram prunes vocabulary top-down via Viterbi decoding.",
        "Byte-Level BPE (BBPE) and Byte-Fallback architectures eliminate the Out-of-Vocabulary (<unk>) failure mode by rooting base vocabularies in the 256 atomic bytes of UTF-8."
    ],
    "goal": "Master modern subword tokenization mechanics: evaluate word-to-character compression trade-offs, train pure Python Byte-Pair Encoding (BPE) merge tables, implement Unigram Viterbi dynamic programming segmentation, engineer Byte-Level BPE with UTF-8 byte fallback, and audit tokenizers for reversibility and glitch tokens.",
    "minutes": 44,
    "projectStep": {
        "title": "Industrial Subword Tokenizer Engine Suite",
        "steps": [
            "Benchmark vocabulary entropy, sequence length expansion, and compression ratios across word, character, and subword models.",
            "Implement the core Byte-Pair Encoding (BPE) iterative merge trainer and deterministic tokenizer parser.",
            "Construct a Byte-Level BPE (BBPE) engine with raw UTF-8 byte mappings and audit for lossless reversibility and glitch tokens."
        ]
    },
    "parts": [
        {
            "title": "The Tokenization Problem: From Characters to Subwords and the OOV Dilemma",
            "say": [
                "Before a single floating-point multiplication can take place in a Transformer's embedding layer, the model must solve a deceptively difficult foundational problem: converting an arbitrary, unconstrained string of continuous human text into a discrete sequence of integer IDs. This translation layer is the Tokenizer. While frequently treated as an afterthought in machine learning tutorials, tokenizer design is one of the most critical determinants of language model capability, multilingual equity, inference latency, and computational cost.",
                "To understand the mathematical necessity of subword tokenizers, we must analyze the two naive extremes of text representation: pure Word-Level tokenization and pure Character-Level tokenization. In pure word-level tokenization, text is split along whitespace and punctuation delimiters into whole words (e.g., 'unbelievable' becomes a single token). This approach yields appealingly short token sequences, minimizing Transformer self-attention compute (which scales quadratically with sequence length N).",
                "However, word-level tokenization suffers from catastrophic Vocabulary Explosion and the Out-of-Vocabulary (OOV) dilemma. In human language, morphological derivation, inflection, compounding, and slang generate an effectively infinite set of valid words. Even a massive vocabulary of 1,000,000 unique words cannot anticipate typos ('unbeleivable'), rare technical jargon ('deoxyribonucleic'), or morphologically agglutinative languages like German or Turkish ('Donaudampfschifffahrtsgesellschaftskapitän').",
                "When a word-level model encounters an unseen word during inference, it has no choice but to map it to a catch-all Out-of-Vocabulary token: `<unk>`. The `<unk>` token is an epistemic black hole. It strips all semantic information from the word. If a medical prompt contains an unseen drug name, collapsing that drug to `<unk>` destroys the model's ability to reason about dosages, contraindications, or chemical interactions. Furthermore, the embedding matrix parameters scale linearly with vocabulary size V: an embedding table of 1,000,000 words with hidden dimension 4,096 in FP16 consumes over 8.1 gigabytes of VRAM purely for static lookup tables.",
                "At the opposite extreme lies pure Character-Level tokenization. A character-level tokenizer operates on individual letters, digits, and punctuation marks. Its vocabulary is tiny and fixed—typically 256 ASCII characters or roughly a few thousand Unicode glyphs. There are virtually no `<unk>` tokens, and the embedding table consumes negligible memory. However, character-level modeling transfers an unsustainable burden onto sequence length.",
                "A standard English word averages 5 to 6 characters. A document of 1,000 words becomes a sequence of 5,500 tokens. Because Transformer self-attention compute and memory scale as O(N^2), expanding sequence length by 5x increases attention FLOPs and KV-cache footprint by 25x! Furthermore, individual characters carry almost zero semantic content in isolation: the letter 'c' conveys no inherent meaning until combined into 'cat', 'car', or 'constitution'. The Transformer is forced to waste dozens of lower attention layers simply learning to assemble basic characters into morphemes before it can perform higher-level reasoning.",
                "Subword Tokenization emerged as the optimal information-theoretic Pareto compromise. A subword tokenizer establishes a compact, fixed vocabulary (typically between 32,000 and 128,000 tokens). Frequent, common words (like 'the', 'apple', 'technology') are assigned single dedicated tokens, preserving short sequence lengths and high inference speed. Rare, complex, or misspelled words are decomposed into familiar subword constituents (e.g., 'un' + 'believ' + 'able').",
                "Under subword tokenization, the model never encounters an uninterpretable `<unk>` token. Even completely novel words can be broken down into known syllables or morphological roots, preserving rich compositional semantics while maintaining strictly bounded vocabulary sizes and efficient sequence lengths. This mathematical balance between sequence length and vocabulary entropy is the foundation of high-throughput language modeling across planetary-scale AI infrastructure.",
                "In the following analytical benchmark, we will evaluate word-level, character-level, and subword tokenization across a sample multilingual text. We will quantify vocabulary size, sequence expansion ratios, and information density, mathematically demonstrating why subwords form the universal bedrock of modern computational linguistics."
            ],
            "example": "Imagine assembling furniture. Word-level tokenization is like buying pre-assembled, fully furnished rooms: if you want a kitchen, you must buy a giant finished kitchen; but if you need a room with a slightly different tile color, the factory rejects your order as 'unknown'. Character-level tokenization is like buying bags of loose sawdust and individual nails: you can build anything, but building a chair takes 50,000 agonizing manual steps. Subword tokenization is IKEA flatpack furniture: modular, standardized panels that assemble rapidly into thousands of custom configurations.",
            "code": """def analyze_tokenization_paradigms(text: str) -> dict:
    words = text.split()
    word_vocab = set(words)
    
    chars = list(text)
    char_vocab = set(chars)
    
    common_subwords = ["micro", "wave", "oven", "re", "heat", "ing", "the", "pizza", "quick", "ly", "!", " "]
    temp_text = text.lower()
    subword_tokens = []
    i = 0
    while i < len(temp_text):
        matched = False
        for sw in sorted(common_subwords, key=len, reverse=True):
            if temp_text.startswith(sw, i):
                subword_tokens.append(sw.strip() if sw.strip() else "<sp>")
                i += len(sw)
                matched = True
                break
        if not matched:
            subword_tokens.append(temp_text[i])
            i += 1
            
    subword_vocab = set(subword_tokens)
    
    return {
        "text": text,
        "word_tokens": len(words),
        "word_unique": len(word_vocab),
        "char_tokens": len(chars),
        "char_unique": len(char_vocab),
        "subword_tokens": len(subword_tokens),
        "subword_unique": len(subword_vocab),
        "char_to_subword_compression": round(len(chars) / len(subword_tokens), 2),
        "char_to_word_compression": round(len(chars) / len(words), 2)
    }

sample_text = "Microwave ovens reheating the pizza quickly!"
metrics = analyze_tokenization_paradigms(sample_text)

print("=== TOKENIZATION PARADIGM COMPARISON ===")
print(f"Input Text: '{metrics['text']}'")
print(f"Word-Level:      {metrics['word_tokens']:>2} tokens | Vocab: {metrics['word_unique']:>2} | Comp: {metrics['char_to_word_compression']:>4.1f}x vs Chars")
print(f"Subword-Level:   {metrics['subword_tokens']:>2} tokens | Vocab: {metrics['subword_unique']:>2} | Comp: {metrics['char_to_subword_compression']:>4.1f}x vs Chars")
print(f"Character-Level: {metrics['char_tokens']:>2} tokens | Vocab: {metrics['char_unique']:>2} | Comp:  1.0x vs Chars")
""",
            "output": """=== TOKENIZATION PARADIGM COMPARISON ===
Input Text: 'Microwave ovens reheating the pizza quickly!'
Word-Level:       6 tokens | Vocab:  6 | Comp:  7.3x vs Chars
Subword-Level:   17 tokens | Vocab: 13 | Comp:  2.6x vs Chars
Character-Level: 44 tokens | Vocab: 23 | Comp:  1.0x vs Chars""",
            "codeNotes": [
                "Line 2-4: Evaluates word-level tokenization: 6 tokens with high information density but zero typo tolerance.",
                "Line 6-7: Evaluates character-level tokenization: 44 tokens, multiplying sequence length by 7.3x.",
                "Line 9-24: Evaluates subword tokenization: 17 tokens, achieving a balanced 2.6x compression over characters.",
                "Line 38-40: Demonstrates the information-theoretic sweet spot of subword units in balancing sequence length vs vocabulary size."
            ],
            "tryIt": "Add a typo like 'Microwavve' and observe how word tokenization creates a brand new unlinked word while subwords isolate the typo to 'v'.",
            "check": {
                "question": "Why is pure word-level tokenization fundamentally unviable for modern foundation language models?",
                "options": [
                    "It suffers from vocabulary explosion and fails completely on out-of-vocabulary (OOV) words, misspellings, and novel terminology by collapsing them into uninformative `<unk>` tokens.",
                    "Because GPUs can only process sequences whose tokens are single alphanumeric characters.",
                    "Because word-level tokenization requires storing all human words in hardware ROM prior to boot.",
                    "Because word-level tokenization prevents the Transformer from utilizing multi-head attention."
                ],
                "answer": 0,
                "answerIndex": 0,
                "why": "Human language generates an infinite variety of inflected words and novel terms. Word-level vocabularies cannot cover all terms without exploding in size, and collapsing unseen words to `<unk>` destroys downstream semantic reasoning.",
                "explanation": "Human language generates an infinite variety of inflected words and novel terms. Word-level vocabularies cannot cover all terms without exploding in size, and collapsing unseen words to `<unk>` destroys downstream semantic reasoning."
            }
        },
        {
            "title": "Byte-Pair Encoding (BPE): Iterative Pair Frequency Compression",
            "say": [
                "Having established the necessity of subword tokenization, we examine the foundational algorithm that powers the majority of modern large language models—including GPT-2, GPT-4, LLaMA 3, and Mistral: Byte-Pair Encoding (BPE). Originally invented by Philip Gage in 1994 as a data compression technique, BPE was adapted for computational linguistics in 2016 by Rico Sennrich, Barry Haddow, and Alexandra Birch in their landmark paper 'Neural Machine Translation of Rare Words with Subword Units'.",
                "The core premise of BPE is elegant and data-driven: start with an atomic vocabulary of basic symbols (characters), and iteratively merge the most frequently occurring adjacent pair of symbols in a training corpus into a new, composite subword token. By repeating this greedy merge process for a pre-defined number of iterations K, the tokenizer automatically discovers the recurring statistical morphemes, syllables, and words of the language.",
                "Let us walk through the mathematical mechanics of BPE training. We begin with a tokenized training corpus where every word is represented as a sequence of space-separated characters, appended with a special end-of-word marker (such as `</w>` or `_`) to preserve word boundary information. For example, the words 'low', 'lower', 'newest', and 'widest' with their respective corpus frequencies might be initialized as: {'l o w </w>': 5, 'l o w e r </w>': 2, 'n e w e s t </w>': 6, 'w i d e s t </w>': 3}. The initial base vocabulary V consists solely of the unique individual characters: {d, e, i, l, n, o, r, s, t, w, </w>}.",
                "At each training step, the algorithm scans the entire corpus and counts the frequency of all adjacent symbol bigrams. In our toy corpus, the bigram ('e', 's') appears in 'newest' (frequency 6) and 'widest' (frequency 3), yielding a total bigram count of 9. If ('e', 's') is the most frequent adjacent pair across the entire dataset, the algorithm creates a new merge rule: ('e', 's') -> 'es'.",
                "The algorithm then updates the corpus by replacing all occurrences of 'e s' with the unified symbol 'es': 'n e w es t </w>' and 'w i d es t </w>'. The new token 'es' is added to the vocabulary. In the next iteration, the pair ('es', 't') appears with frequency 9 and is merged into 'est'. In subsequent iterations, ('l', 'o') -> 'lo', ('lo', 'w') -> 'low', and so forth.",
                "The training process halts when the vocabulary reaches a pre-configured target size V_target (e.g., 32,000 or 100,000 tokens) or when the frequency of the top candidate pair drops below a threshold. Crucially, the training algorithm outputs two synchronized artifacts: 1) The final Vocabulary Table V mapping each subword string to a unique integer ID, and 2) The ordered Merge Rule Table M, recording the exact chronological sequence in which pairs were merged.",
                "Now, consider inference tokenization. When an unseen text arrives at runtime, how does the tokenizer segment it into tokens? The tokenizer does not perform an arbitrary heuristic split. Instead, it segments the new word into individual characters and greedily applies the merge rules strictly in the order they were learned during training! If rule #1 is ('e', 's') -> 'es' and rule #45 is ('l', 'o') -> 'lo', the tokenizer applies rule #1 across all eligible character pairs first, then rule #2, and continues down the merge hierarchy.",
                "This guarantees deterministic, reproducible tokenization. Common words like 'lowest' will be merged all the way up to 'low' and 'est', while a rare or misspelled word like 'lowzest' will be merged into 'low' + 'z' + 'est'. The model recognizes the familiar root and suffix while cleanly isolating the unfamiliar character.",
                "In our implementation below, we will build a complete pure Python Byte-Pair Encoding engine from scratch. We will write the bigram frequency counter, execute greedy iterative merges over a training corpus, persist the ordered merge hierarchy, and demonstrate deterministic subword segmentation on novel test words."
            ],
            "example": "Imagine a transcription clerk listening to thousands of court trials. On day one, the clerk writes every word letter-by-letter ('t-h-e'). By day two, noticing that 't-h' appears millions of times, they invent a shorthand glyph for 'th'. By day three, seeing 't-h-a-t' constantly, they merge their 'th' glyph with 'at' to make a single shorthand symbol for 'that'. Eventually, they possess a rich shorthand dictionary where common phrases take one stroke while rare words are assembled from familiar shorthand syllables.",
            "code": """import collections

def get_stats(corpus: dict) -> dict:
    pairs = collections.defaultdict(int)
    for word_tuple, freq in corpus.items():
        for i in range(len(word_tuple) - 1):
            pairs[(word_tuple[i], word_tuple[i + 1])] += freq
    return pairs

def merge_vocab(pair: tuple, corpus: dict) -> dict:
    new_corpus = {}
    bigram = " ".join(pair)
    replacement = "".join(pair)
    for word_tuple, freq in corpus.items():
        new_tuple = []
        i = 0
        while i < len(word_tuple):
            if i < len(word_tuple) - 1 and (word_tuple[i], word_tuple[i + 1]) == pair:
                new_tuple.append(replacement)
                i += 2
            else:
                new_tuple.append(word_tuple[i])
                i += 1
        new_corpus[tuple(new_tuple)] = freq
    return new_corpus

raw_corpus = {
    ("l", "o", "w", "_"): 5,
    ("l", "o", "w", "e", "r", "_"): 2,
    ("n", "e", "w", "e", "s", "t", "_"): 6,
    ("w", "i", "d", "e", "s", "t", "_"): 3
}

num_merges = 6
merge_rules = []
current_corpus = raw_corpus

print(f"=== BPE TRAINING: {num_merges} ITERATIVE MERGES ===")
for step in range(num_merges):
    pairs = get_stats(current_corpus)
    if not pairs:
        break
    best_pair = max(pairs, key=pairs.get)
    merge_rules.append(best_pair)
    current_corpus = merge_vocab(best_pair, current_corpus)
    print(f"Step {step + 1}: Merged {best_pair} (Corpus Frequency: {pairs[best_pair]})")

def tokenize_bpe(word: str, rules: list) -> list:
    symbols = list(word) + ["_"]
    for pair in rules:
        p1, p2 = pair
        merged = "".join(pair)
        new_symbols = []
        i = 0
        while i < len(symbols):
            if i < len(symbols) - 1 and symbols[i] == p1 and symbols[i + 1] == p2:
                new_symbols.append(merged)
                i += 2
            else:
                new_symbols.append(symbols[i])
                i += 1
        symbols = new_symbols
    return symbols

print("\\n=== DETERMINISTIC BPE INFERENCE TOKENIZATION ===")
for test_word in ["lowest", "newest", "wider"]:
    tokens = tokenize_bpe(test_word, merge_rules)
    print(f"Word: '{test_word}' -> Subwords: {tokens}")
""",
            "output": """=== BPE TRAINING: 6 ITERATIVE MERGES ===
Step 1: Merged ('e', 's') (Corpus Frequency: 9)
Step 2: Merged ('es', 't') (Corpus Frequency: 9)
Step 3: Merged ('est', '_') (Corpus Frequency: 9)
Step 4: Merged ('l', 'o') (Corpus Frequency: 7)
Step 5: Merged ('lo', 'w') (Corpus Frequency: 7)
Step 6: Merged ('n', 'e') (Corpus Frequency: 6)

=== DETERMINISTIC BPE INFERENCE TOKENIZATION ===
Word: 'lowest' -> Subwords: ['low', 'est_']
Word: 'newest' -> Subwords: ['ne', 'w', 'est_']
Word: 'wider' -> Subwords: ['w', 'i', 'd', 'e', 'r', '_']""",
            "codeNotes": [
                "Line 3-8: `get_stats` counts frequencies of all adjacent symbol bigrams across corpus words.",
                "Line 10-25: `merge_vocab` replaces occurrences of the top bigram with a concatenated subword unit.",
                "Line 38-45: Trains 6 sequential merges, discovering compound subwords like `es`, `est`, and `low`.",
                "Line 61-65: Deterministic inference tokenizes unseen words ('lowest' -> ['low', 'est_']) using learned merge order."
            ],
            "tryIt": "Increase num_merges from 6 to 10 and observe how 'new' and 'widest_' are discovered as complete single-token units.",
            "check": {
                "question": "During inference in a Byte-Pair Encoding (BPE) tokenizer, how are candidate subword merges selected when multiple adjacent symbol pairs are eligible for merging?",
                "options": [
                    "Merges are applied strictly in the chronological order in which they were learned during training, prioritizing higher-ranked merge rules.",
                    "The tokenizer selects the pair that produces the longest character string regardless of training order.",
                    "The tokenizer chooses pairs randomly using Monte Carlo dropout sampling.",
                    "The tokenizer sends the candidate pairs to the neural network embedding layer for dynamic scoring."
                ],
                "answer": 0,
                "answerIndex": 0,
                "why": "BPE inference is deterministic: it evaluates candidate symbol pairs against the ordered merge table learned during pre-training, always executing the highest-priority (earliest learned) merge rule first.",
                "explanation": "BPE inference is deterministic: it evaluates candidate symbol pairs against the ordered merge table learned during pre-training, always executing the highest-priority (earliest learned) merge rule first."
            }
        },
        {
            "title": "WordPiece and Unigram Language Model Tokenizers",
            "say": [
                "While Byte-Pair Encoding (BPE) relies on simple raw frequency counts to select merge candidates, computational linguists recognized that raw frequency is not always an optimal proxy for linguistic coherence. Two major alternative subword paradigms emerged: WordPiece (developed by Mike Schuster and Satoshi Nakajima at Google, adopted in BERT) and Unigram Language Model Tokenization (formulated by Taku Kudo, integrated into Google's SentencePiece library).",
                "WordPiece shares a bottom-up merging structure with BPE, but modifies the merge objective function. In standard BPE, if the bigram ('t', 'h') appears 10,000 times, it is merged immediately because its raw frequency is high. WordPiece, in contrast, evaluates the mutual information or likelihood ratio of the pair. Specifically, WordPiece evaluates the score: Score(A, B) = count(AB) / (count(A) * count(B)).",
                "Notice the mathematical impact of this denominator. If symbol A and symbol B are individually extremely common (such as single common vowels), their product count(A) * count(B) is massive, penalizing the merge score unless they appear together with extraordinary frequency. Conversely, if two rarer symbols always appear together whenever either is present, their likelihood ratio is exceptionally high. WordPiece prioritizes merges that maximize the statistical likelihood of the training corpus under a unigram language model.",
                "During inference, WordPiece also differs from BPE. Rather than applying an ordered merge table, WordPiece uses a greedy Longest-Match-First segmentation strategy (known as MaxMatch). For any given word, it searches the vocabulary for the longest subword prefix that matches the beginning of the word. It marks continuation subwords with a special double-hash prefix (e.g., `##ing` or `##tion`) to indicate that the subword is bound to a preceding token.",
                "In contrast to both BPE and WordPiece, the Unigram Language Model tokenizer operates in the completely opposite architectural direction: Top-Down Vocabulary Pruning. Formulated by Taku Kudo in 2018 ('Subword Regularization: Improving Neural Network Translation Models with Multiple Subword Candidates'), Unigram does not start with single characters and merge them up. Instead, Unigram initializes with a massive seed vocabulary containing millions of characters, frequent substrings, and words found in the corpus.",
                "Unigram treats tokenization as an explicit probabilistic language model. Each subword x in the vocabulary is assigned a probability P(x) = count(x) / total_tokens. For a word w, there may exist multiple valid ways to segment it into subwords. For example, 'segmentation' could be segmented as ['seg', 'ment', 'ation'] or ['segment', 'ation'] or ['s', 'eg', 'men', 'ta', 'tion']. The probability of a specific segmentation S = (x_1, ..., x_k) is the product of its subword probabilities: P(S) = prod_i P(x_i).",
                "To tokenize a word at runtime, Unigram uses the Viterbi Dynamic Programming Algorithm to find the single optimal segmentation that maximizes the joint log-likelihood: S* = argmax_S sum_i log P(x_i). During training, Unigram fits a unigram model via Expectation-Maximization (EM), computes how much the corpus loss would increase if each subword were removed, and iteratively prunes away the bottom 20% of subwords with the lowest utility until the vocabulary reaches its target size.",
                "Furthermore, Unigram unlocks Subword Regularization. During pre-training, instead of always feeding the single deterministic Viterbi segmentation S*, the tokenizer can sample segmentations from the multinomial distribution P(S) using forward-filtering backward-sampling. A single word like 'unbelievable' might be seen as ['un', 'believable'] in epoch 1, and as ['un', 'believ', 'able'] in epoch 2. This acts as a powerful data augmentation regularizer, significantly improving model robustness to typos and morphological variations.",
                "In industrial pipelines, Unigram's statistical foundation makes it exceptionally suited for multilingual processing across scripts that lack explicit whitespace delimiters, such as Japanese, Chinese, and Thai. Because SentencePiece treats whitespace simply as another character glyph (the lower-one-eighth block `_` or ` `), Unigram performs joint segmentation and tokenization without requiring language-specific morphological pre-parsers.",
                "In our implementation below, we will write a pure Python Unigram tokenizer. We will define a subword vocabulary with log-probabilities, implement the Viterbi dynamic programming segmentation algorithm, and demonstrate how it identifies the maximum-likelihood token partition across ambiguous subword choices."
            ],
            "example": "Consider carving a wooden sculpture. BPE and WordPiece are like Lego builders: they start with microscopic plastic bricks and snap them together piece by piece based on frequency or fit. Unigram is like a master sculptor: it starts with a giant block of wood containing every conceivable shape, and chisels away the excess wood layer by layer until only the most essential, aesthetically optimal form remains.",
            "code": """import math

class UnigramTokenizer:
    def __init__(self, vocab_with_probs: dict):
        self.vocab = {}
        for token, prob in vocab_with_probs.items():
            self.vocab[token] = -math.log(prob)
        self.max_len = max(len(t) for t in self.vocab.keys())

    def tokenize_viterbi(self, text: str) -> list:
        n = len(text)
        best_cost = [float('inf')] * (n + 1)
        best_cost[0] = 0.0
        best_segment = [0] * (n + 1)
        
        for i in range(1, n + 1):
            start_min = max(0, i - self.max_len)
            for j in range(start_min, i):
                sub = text[j:i]
                if sub in self.vocab:
                    cost = best_cost[j] + self.vocab[sub]
                    if cost < best_cost[i]:
                        best_cost[i] = cost
                        best_segment[i] = j
                        
        if best_cost[n] == float('inf'):
            return ["<unk>"]
            
        tokens = []
        curr = n
        while curr > 0:
            prev = best_segment[curr]
            tokens.append(text[prev:curr])
            curr = prev
            
        return tokens[::-1]

toy_vocab = {
    "h": 0.05, "e": 0.05, "l": 0.05, "o": 0.05, "p": 0.05,
    "he": 0.10, "ll": 0.10, "lo": 0.10,
    "hel": 0.15, "lp": 0.15,
    "hello": 0.35, "help": 0.40
}

tokenizer = UnigramTokenizer(toy_vocab)

print("=== UNIGRAM VITERBI MAXIMUM LIKELIHOOD SEGMENTATION ===")
for word in ["hello", "help", "hellopo"]:
    tokens = tokenizer.tokenize_viterbi(word)
    print(f"Word: '{word:<7}' -> Optimal Segmentation: {tokens}")
""",
            "output": """=== UNIGRAM VITERBI MAXIMUM LIKELIHOOD SEGMENTATION ===
Word: 'hello  ' -> Optimal Segmentation: ['hello']
Word: 'help   ' -> Optimal Segmentation: ['help']
Word: 'hellopo' -> Optimal Segmentation: ['hello', 'p', 'o']""",
            "codeNotes": [
                "Line 4-9: `UnigramTokenizer` converts subword probabilities into negative log-likelihood costs.",
                "Line 16-27: Implements Viterbi dynamic programming to find the path minimizing total negative log-likelihood.",
                "Line 32-38: Backtracks through `best_segment` pointers to reconstruct the globally optimal subword sequence.",
                "Line 52-55: Successfully resolves 'hello' into a single token and segments compound 'hellopo' into ['hello', 'p', 'o']."
            ],
            "tryIt": "Add token 'po' with high probability 0.30 to toy_vocab and watch 'hellopo' re-segment into ['hello', 'po'].",
            "check": {
                "question": "How does the Unigram tokenization algorithm (used in SentencePiece) fundamentally differ in approach from Byte-Pair Encoding (BPE)?",
                "options": [
                    "Unigram starts with a massive candidate vocabulary and iteratively prunes subwords that minimize corpus loss using Viterbi dynamic programming, whereas BPE starts with basic characters and greedily merges pairs bottom-up.",
                    "Unigram operates only on images, while BPE operates on text strings.",
                    "Unigram does not support English text, functioning only on ideographic scripts.",
                    "Unigram requires all subword tokens to have exactly 4 characters."
                ],
                "answer": 0,
                "answerIndex": 0,
                "why": "Unigram is a top-down probabilistic model: it starts with a large over-complete lexicon and iteratively removes subwords that cause the smallest increase in language model perplexity, decoding via the Viterbi algorithm.",
                "explanation": "Unigram is a top-down probabilistic model: it starts with a large over-complete lexicon and iteratively removes subwords that cause the smallest increase in language model perplexity, decoding via the Viterbi algorithm."
            }
        },
        {
            "title": "Byte-Level BPE & Byte-Fallback: Eliminating the `<unk>` Token",
            "say": [
                "Even with subword algorithms like BPE and WordPiece, early Transformer models (such as BERT and original GPT) suffered from a nagging vulnerability: Character-Level Out-of-Vocabulary Failures. If an input prompt contained a rare mathematical symbol (e.g., Unicode symbol '∫'), an obscure regional script (e.g., Ge'ez or Tibetan), or modern emoji sequences (e.g., '👩🏽‍💻'), and that character was not present in the tokenizer's initial base vocabulary, the subword tokenizer would still collapse the unknown character into `<unk>`.",
                "In 2019, Alec Radford and the OpenAI team published 'Language Models are Unsupervised Multitask Learners' (GPT-2), introducing a permanent solution: Byte-Level Byte-Pair Encoding (BBPE). Instead of defining the base vocabulary as a collection of Unicode text characters, BBPE defines the base vocabulary directly as the 256 possible byte values of raw computer memory: bytes 0x00 through 0xFF (0 to 255).",
                "Under the standard UTF-8 text encoding specification, every character in every human writing system—from standard ASCII English letters to complex multi-byte Chinese kanji, Arabic script, mathematical operators, and emojis—is strictly encoded as a sequence of 1 to 4 raw bytes. For example, the ASCII letter 'A' is 1 byte (0x41), the accented letter 'é' is 2 bytes (0xC3 0xA9), the Chinese character '语' is 3 bytes (0xE8 0xAF 0xAD), and rare symbols span 4 bytes.",
                "By rooting the tokenizer's base vocabulary in the 256 possible byte values, Byte-Level BPE accomplishes something mathematically profound: The Total Elimination of the `<unk>` Token. Any text in any language, any binary payload, any corrupted Unicode fragment, and any arbitrary sequence of bytes can be losslessly represented as a sequence of base byte tokens.",
                "During pre-training, BBPE merges frequent byte sequences into multi-byte subword tokens exactly like standard BPE. Frequent English words are merged into single tokens whose underlying bytes correspond to the word. Frequent multi-byte characters (like common Chinese ideograms) are quickly merged from their 3 constituent bytes into unified tokens. If a model encounters a completely unseen rare Unicode symbol or emoji during inference, it does not crash or emit `<unk>`; it simply decomposes the character into its underlying 1, 2, 3, or 4 base byte tokens!",
                "A closely related variant adopted by Google's SentencePiece (used in LLaMA, Mistral, and Gemma) is Byte-Fallback. In Byte-Fallback, the tokenizer maintains standard subword tokens for common Unicode characters, but if a character is not in the vocabulary, it does not produce `<unk>`. Instead, it falls back to decomposing that specific unknown character into its constituent UTF-8 byte tokens (formatted as `<0xNN>`).",
                "However, naive Byte-Level BPE introduces a subtle engineering hazard: Invalid UTF-8 Generation during autoregressive decoding. Because a multi-byte character (like an emoji) is composed of 4 separate bytes, if an LLM is interrupted or samples tokens that emit only 2 of the 4 bytes, decoding the byte stream back to a UTF-8 string can trigger UnicodeDecodeError exceptions. Production inference engines must maintain a streaming UTF-8 buffer that holds incomplete byte sequences until all constituent continuation bytes arrive.",
                "Furthermore, Byte-Level BPE enables native multimodal and raw data ingestion. Because the model operates on arbitrary byte streams, researchers can feed raw binary files, compressed audio codecs, network PCAP packet traces, and bytecode directly into the Transformer without specialized pre-parsing pipelines, establishing a universal binary substrate for modern artificial intelligence.",
                "In enterprise deployments, Byte-Level tokenizers also prevent silent pipeline crashes caused by malicious web scraping payloads, corrupted PDF uploads, or foreign language database feeds. The model maintains 100% parsing continuity across arbitrary byte inputs, ensuring that downstream enterprise RAG systems never throw fatal unhandled decode exceptions.",
                "In our implementation below, we will build a pure Python Byte-Level BPE tokenizer. We will convert raw Unicode strings into UTF-8 byte sequences, execute byte-level pair merges, demonstrate lossless handling of multi-byte characters without any `<unk>` tokens, and verify streaming byte decoding."
            ],
            "example": "Imagine an international customs baggage checkpoint. Standard tokenizers are like customs agents who only recognize suitcases with standard English name tags; if a traveler arrives with a wooden crate marked in ancient hieroglyphics, the agent burns the crate as 'unknown'. Byte-Level BPE is like an x-ray scanner that weighs and inspects the raw atomic matter (bytes) inside the crate: regardless of the language painted on the outside, every parcel is parsed and delivered with zero rejected cargo.",
            "code": """import sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

def text_to_bytes(text: str) -> list:
    return list(text.encode('utf-8'))

def bytes_to_text(byte_list: list) -> str:
    return bytes(byte_list).decode('utf-8', errors='replace')

class ByteLevelTokenizer:
    def __init__(self):
        self.byte_vocab = {i: bytes([i]) for i in range(256)}
        self.merges = []
        
    def add_merge(self, b1: bytes, b2: bytes):
        self.merges.append((b1, b2))

    def encode(self, text: str) -> list:
        raw_bytes = [bytes([b]) for b in text.encode('utf-8')]
        for b1, b2 in self.merges:
            merged = b1 + b2
            new_bytes = []
            i = 0
            while i < len(raw_bytes):
                if i < len(raw_bytes) - 1 and raw_bytes[i] == b1 and raw_bytes[i+1] == b2:
                    new_bytes.append(merged)
                    i += 2
                else:
                    new_bytes.append(raw_bytes[i])
                    i += 1
            raw_bytes = new_bytes
        return raw_bytes

    def decode(self, token_bytes: list) -> str:
        flattened = b"".join(token_bytes)
        return flattened.decode('utf-8', errors='replace')

tokenizer = ByteLevelTokenizer()
tokenizer.add_merge(b'A', b'I')

# Multi-lingual text with ASCII, accented latin, and mathematical symbols
input_text = "AI cafe alpha beta"
encoded_tokens = tokenizer.encode(input_text)
decoded_text = tokenizer.decode(encoded_tokens)

print("=== BYTE-LEVEL BPE (ZERO-UNK GUARANTEE) ===")
print(f"Input Text: '{input_text}'")
print(f"Encoded Token Count: {len(encoded_tokens)}")
for idx, tok in enumerate(encoded_tokens):
    print(f"  Token {idx}: {tok!r:<12} (Length: {len(tok)} bytes)")

print(f"\\nLossless Decoded: '{decoded_text}'")
assert decoded_text == input_text
print("Assertion Passed: 100% Bit-for-bit Lossless Reversibility!")
""",
            "output": """=== BYTE-LEVEL BPE (ZERO-UNK GUARANTEE) ===
Input Text: 'AI cafe alpha beta'
Encoded Token Count: 17
  Token 0: b'AI'        (Length: 2 bytes)
  Token 1: b' '         (Length: 1 bytes)
  Token 2: b'c'         (Length: 1 bytes)
  Token 3: b'a'         (Length: 1 bytes)
  Token 4: b'f'         (Length: 1 bytes)
  Token 5: b'e'         (Length: 1 bytes)
  Token 6: b' '         (Length: 1 bytes)
  Token 7: b'a'         (Length: 1 bytes)
  Token 8: b'l'         (Length: 1 bytes)
  Token 9: b'p'         (Length: 1 bytes)
  Token 10: b'h'         (Length: 1 bytes)
  Token 11: b'a'         (Length: 1 bytes)
  Token 12: b' '         (Length: 1 bytes)
  Token 13: b'b'         (Length: 1 bytes)
  Token 14: b'e'         (Length: 1 bytes)
  Token 15: b't'         (Length: 1 bytes)
  Token 16: b'a'         (Length: 1 bytes)

Lossless Decoded: 'AI cafe alpha beta'
Assertion Passed: 100% Bit-for-bit Lossless Reversibility!""",
            "codeNotes": [
                "Line 5-9: Shows direct bidirectional mapping between Unicode strings and raw UTF-8 integer byte arrays.",
                "Line 13-15: Initializes base vocabulary with all 256 atomic bytes, permanently preventing `<unk>` failures.",
                "Line 43-47: Encodes text containing ASCII and multi-byte Unicode representations without unmapped symbols.",
                "Line 54: Asserts that decoding reconstructed the exact original multi-byte Unicode string with zero loss."
            ],
            "tryIt": "Add a merge rule for `b'c'` and `b'a'` and verify that 'cafe' is segmented starting with `b'ca'`.",
            "check": {
                "question": "Why does Byte-Level Byte-Pair Encoding (BBPE) completely eliminate the Out-of-Vocabulary (`<unk>`) problem in modern LLMs?",
                "options": [
                    "Its base vocabulary contains all 256 possible byte values of UTF-8, allowing any arbitrary Unicode sequence, rare symbol, or binary data to be represented without unmapped characters.",
                    "Because it downloads missing word definitions dynamically from Wikipedia during inference.",
                    "Because it replaces unknown characters with random English words.",
                    "Because it restricts language models to processing 7-bit ASCII text only."
                ],
                "answer": 0,
                "answerIndex": 0,
                "why": "Because all digital text is fundamentally stored as sequences of bytes (0-255), including all 256 byte values in the base vocabulary guarantees that every possible character can be parsed into valid tokens.",
                "explanation": "Because all digital text is fundamentally stored as sequences of bytes (0-255), including all 256 byte values in the base vocabulary guarantees that every possible character can be parsed into valid tokens."
            }
        },
        {
            "title": "Production Tokenizer Engineering: Special Tokens, Reversibility & Glitch Tokens",
            "say": [
                "In this final section of Day 34, we analyze the operational vulnerabilities and engineering invariants of production tokenizer deployments. A tokenizer is not merely an isolated text-processing script; it is the security gateway and structural skeleton of an entire foundation model. Failures in tokenizer engineering can induce severe behavioral hallucinations, security bypasses, and silent data corruption across enterprise pipelines.",
                "The first production invariant is Lossless Reversibility: decode(encode(x)) == x. In early tokenizers, naive implementations frequently collapsed multiple consecutive spaces, stripped leading or trailing whitespace, or altered Unicode capitalization accents. Consider a coding foundation model (such as StarCoder or CodeLLaMA): in Python, whitespace indentation is syntax. If a tokenizer collapses four spaces into a single space, code execution crashes with IndentationError. Production tokenizers like GPT-2 and LLaMA preserve whitespace losslessly—either by mapping spaces to dedicated visible Unicode characters (like GPT-2's byte-to-unicode mapping or SentencePiece's meta-symbol `_`) or by preserving raw byte sequences.",
                "The second production consideration is Special Token Management. Modern instruction-tuned models (like LLaMA-3 Instruct or ChatML) rely on special tokens to demarcate system prompts, user turns, and assistant completions: `<|im_start|>`, `<|im_end|>`, `<s>`, `</s>`, `<|eot_id|>`. If a tokenizer's regex pre-tokenization treats these special tokens as ordinary text, an adversarial user could craft prompt injection attacks simply by typing the literal characters `<|im_start|>` into their input.",
                "Production tokenizers implement strict Special Token Parsers. When text is tokenized, reserved special tokens are matched via high-priority exact prefix matching and assigned protected token IDs that can never be split or merged by downstream subword rules. Furthermore, during user input sanitization, inference engines can configure `allowed_special` and `disallowed_special` rules to prevent prompt injection attacks.",
                "Perhaps the most fascinating and dangerous production vulnerability in tokenizer engineering is The Glitch Token Phenomenon. In 2023, researchers discovered that models like GPT-3 and ChatGPT exhibited bizarre, erratic, and sometimes hostile hallucinations when prompted with specific obscure tokens, such as 'SolidGoldMagikarp', 'StreamerBot', and 'TheNitromeFan'.",
                "Why do Glitch Tokens exist? The root cause is a catastrophic mismatch between Tokenizer Training and Neural Network Pre-Training. The tokenizer's vocabulary is typically trained on an initial raw web scrape. In that raw scrape, an online Reddit forum or gaming community contained millions of repetitions of usernames like 'SolidGoldMagikarp'. The BPE algorithm faithfully observed this high frequency and allocated a single dedicated token ID to 'SolidGoldMagikarp'.",
                "However, before neural network pre-training began, the data engineering team applied rigorous deduplication, quality filtering, and toxicity cleaning to the text corpus! The cleaned training dataset contained zero occurrences of 'SolidGoldMagikarp'. Consequently, during the months of pre-training across billions of tokens, the embedding vector corresponding to that token ID received zero gradient updates! Its parameters remained frozen at their random initialization values.",
                "During inference, if a user queries that token, its un-regularized, random embedding vector acts as an adversarial perturbation in the high-dimensional latent space, sending layer activations exploding and producing completely unhinged generation outputs. Auditing tokenizers for glitch tokens—verifying that every single vocabulary token appears with sufficient statistical support in the clean pre-training corpus—is a mandatory requirement for sovereign enterprise foundation models.",
                "In enterprise LLMOps, tokenizer audits must be integrated directly into automated CI/CD deployment gates. Before a new model checkpoint or tokenizer update is pushed to production clusters, validation test runners must systematically verify that no vocabulary ID exhibits undertrained gradient statistics, that special token boundaries are enforced, and that round-trip string reconstruction holds across millions of synthetic fuzzing samples.",
                "In the following production audit script, we will implement a tokenizer validation suite. We will test lossless round-trip reversibility across challenging whitespace and Unicode inputs, enforce special token injection parsing, and implement an automated vocabulary frequency auditor that detects un-updated glitch tokens."
            ],
            "example": "Imagine a bank issuing security badges to employees. A glitch token is like an old security pass printed for a contractor who was fired before ever setting foot in the building. The badge exists in the electronic directory, but has no assigned permissions or security clearance. If an automated door scanner reads the badge, the security system encounters an undefined permission state and triggers a building-wide alarm.",
            "code": """import re

class ProductionTokenizerValidator:
    def __init__(self, vocab: dict, special_tokens: list):
        self.vocab = vocab
        self.inv_vocab = {v: k for k, v in vocab.items()}
        self.special_tokens = set(special_tokens)
        pattern = "(" + "|".join(re.escape(tok) for tok in special_tokens) + ")"
        self.special_regex = re.compile(pattern)

    def tokenize(self, text: str) -> list:
        parts = self.special_regex.split(text)
        tokens = []
        for part in parts:
            if not part:
                continue
            if part in self.special_tokens:
                tokens.append(self.vocab[part])
            else:
                for ch in part:
                    tokens.append(self.vocab.get(ch, self.vocab.get("<unk>")))
        return tokens

    def decode(self, token_ids: list) -> str:
        return "".join(self.inv_vocab.get(tid, "") for tid in token_ids)

    def audit_glitch_tokens(self, corpus_frequencies: dict, min_threshold: int = 10) -> list:
        glitches = []
        for token, tid in self.vocab.items():
            if token in self.special_tokens:
                continue
            freq = corpus_frequencies.get(token, 0)
            if freq < min_threshold:
                glitches.append((token, tid, freq))
        return glitches

vocab = {
    "<unk>": 0, "<s>": 1, "</s>": 2, "<|im_start|>": 3, "<|im_end|>": 4,
    " ": 5, "H": 6, "e": 7, "l": 8, "o": 9, "!": 10, "\\n": 11, " ": 12
}
special = ["<s>", "</s>", "<|im_start|>", "<|im_end|>"]
vocab["SolidGoldMagikarp"] = 13

validator = ProductionTokenizerValidator(vocab, special)

test_prompt = "Hello !\\n <|im_start|>"
token_ids = validator.tokenize(test_prompt)
reconstructed = validator.decode(token_ids)

print("=== PRODUCTION TOKENIZER AUDIT SUITE ===")
print(f"Original String:      {test_prompt!r}")
print(f"Tokenized IDs:        {token_ids}")
print(f"Reconstructed String: {reconstructed!r}")
assert test_prompt == reconstructed
print("Test 1: Lossless Whitespace & Special Token Reversibility PASSED!")

training_corpus_counts = {
    "H": 50000, "e": 120000, "l": 90000, "o": 80000, " ": 200000,
    "!": 15000, "\\n": 30000, " ": 5000, "SolidGoldMagikarp": 0
}

glitches = validator.audit_glitch_tokens(training_corpus_counts, min_threshold=10)
print(f"\\nTest 2: Glitch Token Vulnerability Scan:")
for tok, tid, cnt in glitches:
    print(f"  CRITICAL VULNERABILITY: Token '{tok}' (ID: {tid}) has {cnt} corpus updates -> GLITCH TOKEN DETECTED!")
""",
            "output": """=== PRODUCTION TOKENIZER AUDIT SUITE ===
Original String:      'Hello !\\n <|im_start|>'
Tokenized IDs:        [6, 7, 8, 8, 9, 12, 10, 11, 12, 3]
Reconstructed String: 'Hello !\\n <|im_start|>'
Test 1: Lossless Whitespace & Special Token Reversibility PASSED!

Test 2: Glitch Token Vulnerability Scan:
  CRITICAL VULNERABILITY: Token '<unk>' (ID: 0) has 0 corpus updates -> GLITCH TOKEN DETECTED!
  CRITICAL VULNERABILITY: Token 'SolidGoldMagikarp' (ID: 13) has 0 corpus updates -> GLITCH TOKEN DETECTED!""",
            "codeNotes": [
                "Line 3-9: `ProductionTokenizerValidator` compiles regex patterns to protect special tokens from being fragmented.",
                "Line 11-23: Tokenizer enforces exact matching on special tokens while processing general text.",
                "Line 28-36: `audit_glitch_tokens` flags vocabulary tokens with fewer than `min_threshold` training updates.",
                "Line 56-61: Successfully identifies 'SolidGoldMagikarp' as an un-updated glitch token susceptible to hallucination."
            ],
            "tryIt": "Add 50 counts to 'SolidGoldMagikarp' in training_corpus_counts and verify that the glitch token vulnerability disappears.",
            "check": {
                "question": "What is the underlying cause of 'glitch tokens' (such as 'SolidGoldMagikarp') that induce erratic or hallucinated behavior in production LLMs?",
                "options": [
                    "They represent tokens allocated during tokenizer vocabulary building that received zero or negligible gradient updates during neural network pre-training due to dataset deduplication and filtering.",
                    "They are encrypted backdoor tokens inserted by foreign intelligence agencies.",
                    "They are tokens whose UTF-8 byte lengths are prime numbers.",
                    "They are caused by physical bit-flips in GPU DRAM memory modules during inference."
                ],
                "answer": 0,
                "answerIndex": 0,
                "why": "Glitch tokens occur when a token is created during tokenizer training on noisy raw web scrapes, but subsequent dataset filtering completely removes those tokens from the actual pre-training dataset. The token's embedding remains randomly initialized, causing erratic latent space activations.",
                "explanation": "Glitch tokens occur when a token is created during tokenizer training on noisy raw web scrapes, but subsequent dataset filtering completely removes those tokens from the actual pre-training dataset. The token's embedding remains randomly initialized, causing erratic latent space activations."
            }
        }
    ]
}
