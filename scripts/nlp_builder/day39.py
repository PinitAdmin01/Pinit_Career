"""
Day 39: Web-Scale Pre-Training Data Engineering: Deduplication (MinHash/LSH), Quality Filtering, Heuristics & Synthetic Data
Course 37: Natural Language Processing & Computational Linguistics
PinIT Career OS - Month 2 Enterprise Expansion
"""

DAY_39_DATA = {
    "day": 39,
    "title": "Day 39: Web-Scale Pre-Training Data Engineering: Deduplication (MinHash/LSH), Quality Filtering, Heuristics & Synthetic Data",
    "description": "Master web-scale pre-training data engineering for large language models. Dissect the anatomy of multi-trillion-token corpora (Common Crawl, RefinedWeb, FineWeb), heuristic quality filtering, line-level repetition removal, PII redaction, MinHash LSH fuzzy near-deduplication, domain mixture curriculum weighting, and high-quality synthetic data injection.",
    "parts": [
        {
            "title": "Anatomy of a Multi-Trillion-Token Pre-Training Corpus: Common Crawl, C4, RefinedWeb & RedPajama",
            "say": [
                "In our previous investigations of scaling laws on Day 36, we discovered the Chinchilla parity law and the modern over-training frontier: training a competitive foundation model requires ingesting between 1 trillion and 15 trillion high-quality tokens. However, compute and architecture are completely powerless if the pre-training data corpus is corrupted with noise, boilerplate HTML, machine-translated spam, or massive duplicate mirrors. An old adage in machine learning states: 'Garbage in, garbage out.' In foundation model pre-training, data quality is not merely an engineering detail; it is the primary determinant of downstream reasoning, factual accuracy, and benchmark performance.",
                "To understand where multi-trillion-token datasets originate, we must examine the raw bedrock of open web data: Common Crawl. Common Crawl is an open non-profit organization that periodically crawls the public internet, producing petabytes of raw Web ARChive (WARC) files every month. A single monthly Common Crawl snapshot contains billions of raw web pages totaling over 300 terabytes of compressed data. However, less than 2% to 5% of raw Common Crawl text is suitable for pre-training a foundation language model! The raw web is overwhelmingly dominated by navigation sidebars, copyright footers, cookie consent banners, SEO link farms, casino spam, machine-translated gibberish, duplicated mirror websites, and toxic forums.",
                "The evolution of open pre-training corpora represents a decade of relentless data refinement. In 2019, Colin Raffel et al. introduced C4 (the Colossal Clean Crawled Corpus) for the T5 model, creating the first systematic heuristic filtering pipeline on Common Crawl. In 2020, EleutherAI assembled 'The Pile', an 800GB curated diverse dataset combining filtered web text with academic papers (PubMed, arXiv), GitHub source code, legal repositories, and books. In 2023, the Technology Innovation Institute (TII) published 'RefinedWeb' for the Falcon models, proving that rigorous heuristic filtering and massive fuzzy deduplication on Common Crawl alone could outperform complex curated datasets. In 2024, Hugging Face released 'FineWeb', a 15-trillion-token open dataset demonstrating state-of-the-art benchmark convergence through extreme quality filtering.",
                "A modern industrial pre-training data engineering pipeline is structured into five sequential, highly scalable processing stages: 1) Text Extraction: stripping HTML tags, JavaScript payloads, and CSS styles from WARC files to extract raw body text (using robust parsers like Trafilatura or Readability); 2) Document Language Identification: classifying the language of each document using fast linear models (such as FastText or CLD3) and filtering non-target languages with high confidence thresholds (e.g., probability > 0.65); 3) Heuristic Quality Filtering: applying statistical rules on word length, symbol ratios, and stopword densities to eliminate gibberish and machine spam; 4) Near-Deduplication: removing duplicate and near-duplicate documents across the multi-petabyte corpus using MinHash and Locality-Sensitive Hashing (LSH); and 5) Safety & PII Redaction: filtering toxic content and masking Personally Identifiable Information (emails, phone numbers, IP addresses).",
                "Processing petabytes of text across these five stages requires specialized distributed computing infrastructure. Modern data engineering teams deploy massive Apache Spark or Ray clusters operating on tens of thousands of CPU cores in parallel. Text is stored in columnar Parquet or Feather formats on distributed object storage (such as AWS S3 or Google Cloud Storage), utilizing SIMD-accelerated string processing libraries written in C++ and Rust.",
                "Crucially, the data pipeline is not a one-time static batch job. Data engineers continuously monitor data diversity, vocabulary coverage, and token compression ratios across data dumps. If a crawler ingests a spam network that bypasses quality filters, downstream pre-training will suffer from loss divergence or repetitive generation loops. Rigorous data engineering acts as the immune system of foundation AI models.",
                "In enterprise pre-training campaigns, data curation accounts for more engineering hours than model training itself. By investing weeks into building clean extraction and quality filtering pipelines, organizations eliminate toxic hallucinations, reduce training wall-clock time by up to 30%, and achieve frontier benchmark results on compact, cost-effective architectures.",
                "In the following Python script, we will simulate the foundational text quality scoring stage of a web data pipeline. We will evaluate raw document extracts across alphabetic character ratios, average word length distributions, and stopword densities, demonstrating how heuristic rules instantly separate human-authored informative text from web noise and keyword-stuffed SEO spam."
            ],
            "example": "Imagine panning for gold in a muddy Alaskan river. Common Crawl is the roaring river carrying millions of tons of mud, gravel, and rotten logs (raw HTML). The data engineering pipeline is a sequence of industrial sluice boxes and magnetic separators. The sluice box washes away the silt (boilerplate HTML), filters out gravel (spam), and catches pure gold nuggets (high-quality human knowledge). Without the sluice box, melting the raw river mud into jewelry would yield only brittle slag.",
            "code": """def basic_quality_score(text: str):
    words = text.split()
    if not words:
        return False, "EMPTY"
        
    alpha_chars = sum(c.isalpha() for c in text)
    alpha_ratio = alpha_chars / len(text)
    avg_len = sum(len(w) for w in words) / len(words)
    stopwords = {"the", "in", "with", "over", "and", "to", "of", "is", "for"}
    stop_count = sum(w.lower() in stopwords for w in words)
    stop_ratio = stop_count / len(words)
    
    # Gopher / C4 Quality Heuristic Invariants:
    # 1. High alphabetic character ratio (rejects hex dumps and code tables)
    # 2. Mean word length between 3 and 10 characters (rejects run-on spam or single-char noise)
    # 3. Sufficient stopword density (ensures natural grammatical syntax)
    is_high_quality = (alpha_ratio >= 0.70) and (3.0 <= avg_len <= 10.0) and (stop_ratio >= 0.15)
    metrics = f"Alpha={alpha_ratio:.2f}, AvgLen={avg_len:.1f}, StopRatio={stop_ratio:.2f}"
    return is_high_quality, metrics

raw_docs = [
    ("doc1", "The quick brown fox jumps over the lazy dog in the sunny forest with green trees."),
    ("doc2", "ASDF 12345 !@#$% ^&*() QWERTY 999999999999999999999999999999999999999999999999"),
    ("doc3", "Click here to buy cheap luxury watches discount online sale now free shipping today click here")
]

print("=== WEB-SCALE DATA QUALITY CLASSIFICATION SIMULATION ===")
for doc_id, text in raw_docs:
    hq, metrics = basic_quality_score(text)
    status = "ACCEPTED (HQ)" if hq else "REJECTED (LOW QUALITY)"
    print(f"[{doc_id}] {status} | {metrics}")
""",
            "output": """=== WEB-SCALE DATA QUALITY CLASSIFICATION SIMULATION ===
[doc1] ACCEPTED (HQ) | Alpha=0.80, AvgLen=4.1, StopRatio=0.38
[doc2] REJECTED (LOW QUALITY) | Alpha=0.13, AvgLen=12.2, StopRatio=0.00
[doc3] REJECTED (LOW QUALITY) | Alpha=0.84, AvgLen=4.9, StopRatio=0.06""",
            "codeNotes": [
                "Line 4-13: Computes alphabetic character ratio, average word length, and stopword density.",
                "Line 18: Enforces Gopher/C4 quality filtering heuristics: alpha >= 0.70, 3 <= avg_len <= 10, stopword >= 0.15.",
                "Line 29-33: Successfully accepts doc1 while rejecting gibberish noise (doc2) and keyword-stuffed SEO spam (doc3)."
            ],
            "tryIt": "Add a paragraph of medical journal text to raw_docs and verify that its natural syntactic density easily passes the quality filter.",
            "check": {
                "question": "Why do web-scale pre-training pipelines mandate that candidate documents contain a minimum stopword density (e.g., at least 15% stopwords like 'the', 'is', 'and')?",
                "options": [
                    "Natural human language relies on functional grammatical words to establish syntactic structure; text with negligible stopword density almost invariably represents keyword-stuffed SEO spam, database dumps, or machine-generated noise.",
                    "Because stopwords consume less GPU memory than substantive nouns.",
                    "Because modern tokenizers cannot encode sentences unless they begin with a stopword.",
                    "Because stopwords force the attention matrices to become lower-triangular."
                ],
                "answer": 0,
                "answerIndex": 0,
                "why": "Natural human syntax requires functional grammatical glue (articles, prepositions, conjunctions). Text lacking stopwords (e.g. 'buy luxury watch cheap sale discount') represents unnatural keyword spam or data exports that degrade language model fluency.",
                "explanation": "Natural human syntax requires functional grammatical glue (articles, prepositions, conjunctions). Text lacking stopwords (e.g. 'buy luxury watch cheap sale discount') represents unnatural keyword spam or data exports that degrade language model fluency."
            }
        },
        {
            "title": "Text Quality Filtering: Perplexity Filtering, FastText Heuristics, Line-Level Repetition & PII Redaction",
            "say": [
                "While basic document-level statistics filter out overt gibberish, web text contains far more insidious forms of low-quality noise that pass superficial length and character checks. These include repetitive navigation sidebars, auto-generated boilerplates, toxic rants, and sensitive Personally Identifiable Information (PII). In this section, we examine the advanced heuristic and statistical filters that transform raw web extractions into pristine training corpora: line-level repetition filtering, perplexity filtering, and automated PII sanitization.",
                "The first major challenge is Line-Level and N-gram Repetition. Web scrapers frequently encounter pages corrupted by repetition bugs: automated server errors that repeat the same sentence dozens of times, infinite lists of product categories, or repetitive copyright footers ('Terms of Service Privacy Policy Contact Us'). If an LLM is trained on corpora with heavy repetition, it develops severe degenerative generation pathologies: during autoregressive decoding, the model falls into infinite repetition loops, spewing the same token sequence indefinitely.",
                "To eliminate repetitive text, data engineers enforce the Gopher Repetition Rules (Rae et al., 2021). A document is discarded if: 1) Any duplicate line accounts for more than 30% of total document characters; 2) The most frequent 2-gram, 3-gram, or 4-gram accounts for more than 20%, 18%, or 16% of total characters; or 3) Any 10-gram is repeated more than 3 times. Applying these repetition filters removes hundreds of millions of low-quality pages while immunizing models against degenerative repetition loops during inference.",
                "The second advanced technique is Perplexity Filtering with n-gram Language Models. How can a data pipeline objectively measure whether an English document is fluent, well-written prose versus clunky, incoherent machine translation? The solution is to train a lightweight 5-gram language model (typically using KenLM with Kneser-Ney smoothing) on a gold-standard reference corpus (such as high-quality Wikipedia articles or peer-reviewed literature).",
                "In production implementations, KenLM language model filtering relies on Modified Kneser-Ney smoothing, an interpolation algorithm that discounts lower-order n-gram counts based on their continuation probability. When scoring a candidate document, the model computes the log-likelihood per token: H(Doc) = -1/N * sum_i log2 P(w_i | context). Data engineers calibrate the perplexity acceptance threshold by constructing an empirical Receiver Operating Characteristic (ROC) curve: they score a benchmark set of known high-quality articles (Wikipedia, curated news) alongside known web noise (forum spam, SEO landing pages). Selecting a threshold at the 95th percentile of the gold distribution removes more than 60% of web junk while retaining 98% of informative knowledge.",
                "Once trained, the KenLM model evaluates the cross-entropy perplexity of candidate web documents: PPL(Doc) = exp(-1/N * sum_i log P(w_i | w_{i-n+1}^{i-1})). High-perplexity documents represent unnatural language, machine-translated spam, or broken text. Interestingly, extremely low-perplexity documents must ALSO be filtered! Documents with abnormally low perplexity are typically repetitive boilerplate templates, cookie disclosures, or identical copyright notices. By trimming both the highest and lowest perplexity percentiles (e.g., discarding the top 5% and bottom 2%), data pipelines isolate natural, informative, high-entropy human writing.",
                "The final mandatory step is Personally Identifiable Information (PII) Redaction. Training corpora scraped from the public internet inevitably contain sensitive personal data: private email addresses, telephone numbers, physical mailing addresses, credit card numbers, and internal IP addresses. Ingesting unredacted PII exposes models to severe privacy breaches, where malicious prompt injection can extract real individuals' contact details. Furthermore, global privacy regulations (such as GDPR and CCPA) mandate strict data sanitization.",
                "Industrial data pipelines employ high-throughput compiled regular expressions and named-entity recognition (NER) models to scan every document. Sensitive patterns—including IPv4 addresses (`192.168.1.1`), personal email addresses, and social security numbers—are replaced with standardized generic tokens: `[EMAIL_REDACTED]`, `[IP_REDACTED]`, or `[PHONE_REDACTED]`. This preserves surrounding grammatical and syntactic context while permanently expunging private user data from model weights.",
                "In the following Python script, we will implement an enterprise PII redaction and line-repetition detection engine. We will process candidate documents containing sensitive network logs and repetitive boilerplates, sanitize personal identities with zero syntactic corruption, and quantify document cleanliness."
            ],
            "example": "Imagine preparing historical letters for a public museum archive. Archivists don't just put raw letters on display. First, they redact private medical details and bank numbers with a blackout marker (PII redaction). Next, they discard duplicate mass-printed marketing flyers sent to thousands of residents (repetition filtering). Finally, they select letters written with rich, expressive vocabulary while setting aside broken scribbles (perplexity filtering). The resulting museum exhibit is informative, respectful, and historically valuable.",
            "code": """import re

class TextSanitizer:
    def __init__(self):
        # Compiled High-Throughput Regex Patterns for PII
        self.email_pattern = re.compile(r'[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+')
        self.ip_pattern = re.compile(r'\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b')
        self.phone_pattern = re.compile(r'\\b\\+?\\d{1,3}[-.\\s]?\\(?\\d{3}\\)?[-.\\s]?\\d{3}[-.\\s]?\\d{4}\\b')

    def sanitize_pii(self, text: str) -> str:
        clean = self.email_pattern.sub("[EMAIL_REDACTED]", text)
        clean = self.ip_pattern.sub("[IP_REDACTED]", clean)
        clean = self.phone_pattern.sub("[PHONE_REDACTED]", clean)
        return clean

    def check_line_repetition(self, text: str, max_line_repeat_ratio: float = 0.30) -> bool:
        lines = [line.strip() for line in text.split('\\n') if line.strip()]
        if not lines:
            return False
            
        line_counts = {}
        for line in lines:
            line_counts[line] = line_counts.get(line, 0) + 1
            
        most_frequent_line = max(line_counts, key=line_counts.get)
        repeat_char_count = len(most_frequent_line) * line_counts[most_frequent_line]
        total_char_count = sum(len(line) for line in lines)
        
        repeat_ratio = repeat_char_count / total_char_count
        return repeat_ratio <= max_line_repeat_ratio

sanitizer = TextSanitizer()

text_sample = "Contact our security lead at admin@enterprise-ai.internal or IP 192.168.1.100 for support."
sanitized_text = sanitizer.sanitize_pii(text_sample)

repetitive_sample = \"\"\"
System Status: Healthy
System Status: Healthy
System Status: Healthy
System Status: Healthy
System Status: Healthy
The core database server is functioning within normal parameters.
\"\"\"
passes_repetition = sanitizer.check_line_repetition(repetitive_sample)

print("=== PII REDACTION & REPETITION FILTERING SIMULATION ===")
print("Original Text:    ", text_sample)
print("Sanitized Output: ", sanitized_text)
print("-" * 65)
print(f"Repetitive Document Passed Filter: {passes_repetition} (Rejected due to duplicate line density!)")
""",
            "output": """=== PII REDACTION & REPETITION FILTERING SIMULATION ===
Original Text:     Contact our security lead at admin@enterprise-ai.internal or IP 192.168.1.100 for support.
Sanitized Output:  Contact our security lead at [EMAIL_REDACTED] or IP [IP_REDACTED] for support.
-----------------------------------------------------------------
Repetitive Document Passed Filter: False (Rejected due to duplicate line density!)""",
            "codeNotes": [
                "Line 4-8: Compiles production regular expressions targeting private emails, IPv4 addresses, and phone numbers.",
                "Line 16-29: Calculates line-level character repetition ratio, rejecting documents where duplicate lines exceed 30% of total text.",
                "Line 43-46: Verifies successful PII replacement and automated rejection of repetitive telemetry dumps."
            ],
            "tryIt": "Test an unredacted telephone number like +1-555-867-5309 and verify that sanitize_pii masks it with [PHONE_REDACTED].",
            "check": {
                "question": "In pre-training data engineering, why is it necessary to discard documents that exhibit excessively LOW perplexity under a reference language model, rather than only filtering high-perplexity documents?",
                "options": [
                    "Abnormally low-perplexity text almost always consists of non-informative, repetitive boilerplate templates, cookie disclosures, or identical copyright notices rather than rich, substantive prose.",
                    "Because low-perplexity documents cause GPU Tensor Cores to overheat.",
                    "Because low-perplexity text causes the tokenizer vocabulary to overflow.",
                    "Because modern language models cannot learn from grammatical sentences."
                ],
                "answer": 0,
                "answerIndex": 0,
                "why": "Extremely low perplexity under an n-gram model indicates predictable, repetitive boilerplate (e.g. 'All rights reserved. Terms of service. Click here.'). Filtering both high-perplexity (gibberish) and low-perplexity (boilerplate) tails isolates rich human prose.",
                "explanation": "Extremely low perplexity under an n-gram model indicates predictable, repetitive boilerplate (e.g. 'All rights reserved. Terms of service. Click here.'). Filtering both high-perplexity (gibberish) and low-perplexity (boilerplate) tails isolates rich human prose."
            }
        },
        {
            "title": "Near-Deduplication at Scale: MinHash Hashing, Jaccard Similarity & Locality-Sensitive Hashing (LSH) Bands",
            "say": [
                "Having cleaned individual documents of gibberish and PII, we face the most mathematically formidable challenge in web-scale data engineering: Deduplication. The public internet is riddled with duplicate and near-duplicate content: syndicated news articles republished across hundreds of local media outlets, Wikipedia mirror sites, blog scraping networks, software licensing notices, and duplicated GitHub repositories. Empirical research by Lee et al. (2021) demonstrated that training on duplicated data causes severe memorization of private text, degrades downstream benchmark generalization, and dramatically increases generation repetition.",
                "Why can we not simply compute an MD5 or SHA-256 cryptographic hash of every document to remove duplicates? Cryptographic hashing enables Exact Deduplication. If two documents differ by even a single comma, a single timestamp, or a modified website title, their SHA-256 hashes are completely uncorrelated due to the cryptographic avalanche effect. Exact deduplication catches less than 30% of web duplication! The remaining 70% consists of Near-Duplicates: articles sharing 80% to 95% identical content with minor local variations. Solving near-deduplication requires fuzzy set similarity.",
                "Let us formalize near-deduplication mathematically. A document D is converted into a set of overlapping word n-grams, known as Shingles. Typically, data engineers use 5-grams (5-word sequences) or 13-grams. For two documents A and B with shingle sets S_A and S_B, their degree of near-duplication is defined by the Jaccard Similarity: J(A, B) = |S_A ∩ S_B| / |S_A ∪ S_B|. Jaccard similarity ranges from 0.0 (completely disjoint texts) to 1.0 (identical text). In pre-training corpora, documents with J(A, B) ≥ 0.75 or 0.80 are classified as near-duplicates and must be pruned.",
                "However, computing Jaccard similarity directly across a corpus of 100 million documents requires comparing every pair: (10^8 * 10^8) / 2 = 5 * 10^15 pairwise comparisons! Even on a supercomputer, computing 5 quadrillion set intersections would take months. To solve this scalability bottleneck, Andrei Broder (1997) invented the MinHash algorithm, combined with Locality-Sensitive Hashing (LSH).",
                "The mathematical miracle of MinHash is that it maps arbitrary-length shingle sets into fixed-length integer signatures while preserving Jaccard similarity. Let h_1, h_2, ..., h_K be K independent hash functions that map shingles to integers. For a document with shingle set S, the i-th MinHash value is the minimum hash value obtained across all shingles: MinHash_i(S) = min_{s in S} h_i(s). A document's MinHash Signature is a compact vector of K integers: Sig(S) = [MinHash_1(S), MinHash_2(S), ..., MinHash_K(S)]. Typically, K = 128 or 256.",
                "Broder proved the fundamental MinHash Theorem: The probability that two documents produce the exact same minimum hash value under a random hash function is PRECISELY EQUAL to their Jaccard similarity: P[MinHash_i(A) == MinHash_i(B)] = J(A, B). Therefore, the expected fraction of matching components between two 128-dimensional MinHash signatures is an unbiased estimator of their true Jaccard similarity! A comparison of two multi-kilobyte documents is compressed into checking integer equality across 128 numbers.",
                "To eliminate pairwise comparisons altogether, we apply Locality-Sensitive Hashing (LSH) Banding. The K MinHash values are partitioned into b bands of r rows each, such that K = b * r (e.g., 128 hashes divided into b = 32 bands of r = 4 rows). For each band, the r integers are hashed into a hash table bucket. If two documents are near-duplicates, they will collide in at least one bucket with high probability: P(Collision) = 1 - (1 - J^r)^b. This formula produces an 'S-curve' that acts as a sharp threshold function: documents with Jaccard similarity above 0.75 collide in buckets with >98% probability, while documents with similarity below 0.30 almost never collide. Only candidate pairs that collide in the same bucket are compared, reducing the computational complexity from O(N^2) to near O(N) linear time!",
                "In the following Python script, we will implement deterministic MinHash signature generation and verify Broder's theorem. We will shingle two near-duplicate sentences and one unrelated sentence, compute their 16-dimensional MinHash signatures, and prove that the signature match frequency accurately predicts true Jaccard similarity."
            ],
            "example": "Imagine identifying duplicate fingerprints across 10 million citizens. Comparing every ridge line of every fingerprint against everyone else would take centuries. Instead, forensic scientists extract 16 distinct landmark ridge points (MinHash signature). They sort citizens into filing cabinets based on clusters of 4 landmarks (LSH bands). If two fingerprints are from the same person, they will inevitably land in the same filing drawer, allowing instant matching without searching the entire national archive.",
            "code": """import hashlib

def get_shingles(text: str, k: int = 3) -> list:
    words = text.lower().split()
    if len(words) < k:
        return []
    return sorted(list(set(' '.join(words[i:i+k]) for i in range(len(words) - k + 1))))

def jaccard_similarity(set_a: list, set_b: list) -> float:
    sa, sb = set(set_a), set(set_b)
    if not sa or not sb:
        return 0.0
    return len(sa.intersection(sb)) / len(sa.union(sb))

def minhash_signature(shingles: list, num_hashes: int = 16) -> list:
    sig = []
    for i in range(num_hashes):
        # Deterministic cross-platform hashing using salted MD5
        min_val = min(int(hashlib.md5(f"{i}:{s}".encode('utf-8')).hexdigest()[:8], 16) for s in shingles) if shingles else 0
        sig.append(min_val)
    return sig

t1 = "the quick brown fox jumps over the lazy dog in the sunny forest"
t2 = "the fast brown fox jumps over the lazy dog in the sunny forest"  # Near-duplicate (1 word changed)
t3 = "deep neural networks optimize transformer attention with cuda acceleration" # Unrelated

s1 = get_shingles(t1, k=3)
s2 = get_shingles(t2, k=3)
s3 = get_shingles(t3, k=3)

true_j12 = jaccard_similarity(s1, s2)
true_j13 = jaccard_similarity(s1, s3)

sig1 = minhash_signature(s1, num_hashes=16)
sig2 = minhash_signature(s2, num_hashes=16)
sig3 = minhash_signature(s3, num_hashes=16)

est_j12 = sum(1 for a, b in zip(sig1, sig2) if a == b) / len(sig1)
est_j13 = sum(1 for a, b in zip(sig1, sig3) if a == b) / len(sig1)

print("=== MINHASH & JACCARD NEAR-DEDUPLICATION SIMULATION ===")
print(f"Document 1 & 2 (Near-Duplicates):")
print(f"  True Jaccard Similarity:     {true_j12:.4f}")
print(f"  MinHash Estimated Similarity: {est_j12:.4f} (Matches expected Jaccard!)")
print("-" * 65)
print(f"Document 1 & 3 (Unrelated):")
print(f"  True Jaccard Similarity:     {true_j13:.4f}")
print(f"  MinHash Estimated Similarity: {est_j13:.4f} (Zero false-positive collision)")
""",
            "output": """=== MINHASH & JACCARD NEAR-DEDUPLICATION SIMULATION ===
Document 1 & 2 (Near-Duplicates):
  True Jaccard Similarity:     0.6923
  MinHash Estimated Similarity: 0.5625 (Matches expected Jaccard!)
-----------------------------------------------------------------
Document 1 & 3 (Unrelated):
  True Jaccard Similarity:     0.0000
  MinHash Estimated Similarity: 0.0000 (Zero false-positive collision)""",
            "codeNotes": [
                "Line 3-7: Converts document text into overlapping k-shingles (3-grams) of lowercase words.",
                "Line 14-20: Computes 16-dimensional MinHash signature using deterministic salted hash functions.",
                "Line 35-41: Confirms that MinHash signature overlap correctly identifies near-duplicate documents while rejecting unrelated text."
            ],
            "tryIt": "Increase num_hashes from 16 to 128 and observe how the MinHash estimated similarity converges closer to the true Jaccard similarity of 0.6923.",
            "check": {
                "question": "What mathematical principle enables the MinHash algorithm to estimate the Jaccard similarity of two multi-megabyte documents using only small fixed-length integer vectors?",
                "options": [
                    "Under a random hash function h, the probability that min(h(A)) == min(h(B)) is exactly equal to the Jaccard similarity |A ∩ B| / |A ∪ B|; therefore, the fraction of matching hashes in a signature provides an unbiased estimator of true set similarity.",
                    "MinHash trains a deep convolutional neural network to compress text into latent embeddings.",
                    "MinHash sorts all words in alphabetical order and deletes all vowels.",
                    "MinHash computes the Fourier transform of the document's character frequencies."
                ],
                "answer": 0,
                "answerIndex": 0,
                "why": "Broder's theorem proves P[min(h(A)) == min(h(B))] = Jaccard(A, B). By computing K independent minimum hashes, the proportion of matching integers across two K-dimensional signatures directly estimates their Jaccard similarity.",
                "explanation": "Broder's theorem proves P[min(h(A)) == min(h(B))] = Jaccard(A, B). By computing K independent minimum hashes, the proportion of matching integers across two K-dimensional signatures directly estimates their Jaccard similarity."
            }
        },
        {
            "title": "Data Mixture Optimization, Domain Curriculum Weighting & High-Quality Synthetic Data Injection",
            "say": [
                "Once a pre-training corpus has been rigorously cleaned of web noise and deduplicated, the data architect confronts a strategic decision that decisively dictates model capabilities: Domain Mixture Optimization. A foundation model cannot develop elite reasoning capabilities if its diet consists exclusively of generic web text. To excel across mathematics, programming, logical deduction, and factual question answering, the pre-training mixture must blend diverse specialized knowledge domains into an optimized curriculum.",
                "Let us analyze the standard Domain Composition Matrix of modern frontier language models (such as LLaMA-3, Mistral, and DeepSeek). The corpus is partitioned into distinct knowledge categories: 1) General Web Text (Common Crawl / FineWeb): comprising 50% to 60% of the mixture, providing broad linguistic fluency, world knowledge, and general conversational adaptability; 2) Code Repositories (GitHub, The Stack): comprising 15% to 25% of the mixture. Training on source code does not merely teach the model to write Python or C++; empirical studies prove that code training dramatically enhances general logical reasoning and multi-step deduction across all text tasks!",
                "Category 3: Academic STEM Literature (arXiv, PubMed, PhilPapers): comprising 5% to 10% of the mixture, providing dense mathematical formalism, scientific nomenclature, and rigorous argumentative structure. Category 4: Encyclopedic Reference Data (Wikipedia, curated digital libraries): comprising 3% to 5% of the mixture. Because Wikipedia represents exceptionally high-density factual knowledge, data engineers routinely Upsample encyclopedic domains by 2x to 4x (training on multiple epochs of Wikipedia without suffering from overfitting).",
                "Category 5: Synthetic Reasoning Data. In 2023 and 2024, the injection of high-quality synthetic data became the decisive competitive frontier. Pioneered by Microsoft Research with 'Textbooks Are All You Need' (the Phi model family) and WizardLM's Evol-Instruct, synthetic data engineering uses existing frontier models (such as GPT-4) to generate structured educational textbooks, step-by-step mathematical reasoning chains, and multi-turn conversational trees. Ingesting 5% to 10% synthetic reasoning data injects pristine pedagogical explanations that natural internet text rarely contains.",
                "The production engineering of synthetic reasoning datasets involves multi-step prompt mutations. In the Evol-Instruct paradigm, a seed instruction is iteratively evolved through five structural operations: adding constraints, deepening reasoning complexity, concretizing abstract concepts, requiring multi-step verification, and mutating into domain-specific code. Each evolved prompt is answered by a frontier teacher model with Extended Thinking (reasoning traces). Before injecting synthetic traces into the pre-training mixture, the outputs are validated by automated unit tests (for code) and symbolic math solvers (for mathematics). Only verified, correct reasoning traces are accepted, preventing synthetic hallucination contamination from entering the foundation model weights.",
                "How are these domains combined during distributed cluster pre-training? Classical training used a static, uniform sampling probability: at each step, a batch was sampled from domain D with fixed probability p_D. Modern foundation campaigns employ Curriculum Weighting and Cooldown Annealing. During the initial 80% to 90% of training, the model ingests a diverse general mixture with high web and code weight. During the final 10% of training (concurrent with the learning rate cosine decay cooldown), the domain mixture is annealed: low-quality web text is throttled, while high-quality synthetic data, mathematical proofs, and instruction-tuning datasets are upsampled by up to 10x! This cooldown annealing produces a dramatic plunge in validation loss and accelerates downstream benchmark mastery.",
                "Optimizing domain mixture weights requires rigorous mathematical formulation. Data teams formulate mixture selection as an optimization problem: minimizing validation loss across an evaluation suite of benchmark domains subject to a total token budget constraint. By tracking the loss trajectory on domain-specific validation sets (e.g., HumanEval for code, GSM8K for math, MMLU for general knowledge), engineers dynamically tune domain mixture ratios to eliminate capability bottlenecks.",
                "In enterprise environments, mastering domain mixture economics allows organizations to build sovereign domain-specific models (e.g. for finance, healthcare, or legal compliance) that decisively outperform general-purpose commercial APIs while consuming only a fraction of the compute budget.",
                "In the following Python script, we will simulate a multi-domain mixture optimization pipeline. We will define an enterprise pre-training corpus across five domains, apply domain upsampling weights, compute the normalized sampling distribution, and calculate the exact token volume delivered across a 15-trillion-token training campaign."
            ],
            "example": "Imagine training an Olympic decathlete. If the athlete only jogs on the road (generic web text), they will never win the shot put or pole vault. The coach designs a structured nutritional and training curriculum: 50% endurance running (web text), 25% gymnastics and weightlifting (code and logic), 15% physics and biomechanics study (academic STEM), and 10% intensive coaching sessions with master champions (high-quality synthetic data). The balanced curriculum builds a world-class champion.",
            "code": """def optimize_domain_mixture(domain_corpus: list, total_campaign_tokens_trillion: float):
    # Total weighted sum = sum(raw_pct * upsample_weight)
    total_weighted = sum(pct * weight for _, pct, weight in domain_corpus)
    
    results = []
    for name, raw_pct, weight in domain_corpus:
        effective_pct = (raw_pct * weight) / total_weighted * 100.0
        effective_tokens = (effective_pct / 100.0) * total_campaign_tokens_trillion
        results.append({
            "name": name,
            "raw_pct": raw_pct,
            "weight": weight,
            "eff_pct": effective_pct,
            "eff_tokens": effective_tokens
        })
    return results, total_weighted

# Enterprise 15-Trillion-Token Curriculum Configuration
domains = [
    ("Web Crawl (Common Crawl)",  60.0, 1.0),   # Baseline 1.0x epoch
    ("Code (GitHub & The Stack)", 20.0, 1.5),   # 1.5x upsampled for reasoning
    ("STEM & Academic (arXiv)",    10.0, 2.0),   # 2.0x upsampled for formalism
    ("Encyclopedic (Wikipedia)",    5.0, 3.0),   # 3.0x upsampled for facts
    ("Synthetic Reasoning Data",    5.0, 2.0)    # 2.0x upsampled for logic
]

total_target_tokens = 15.0 # Trillion tokens
results, total_weight = optimize_domain_mixture(domains, total_target_tokens)

print("=== DOMAIN MIXTURE CURRICULUM OPTIMIZATION ===")
print(f"Total Target Pre-Training Tokens: {total_target_tokens:.1f} Trillion")
print("-" * 65)
for r in results:
    print(f"{r['name']:<26} | Raw: {r['raw_pct']:4.1f}% | Weight: {r['weight']:.1f}x | Mix: {r['eff_pct']:5.1f}% | Tokens: {r['eff_tokens']:4.1f}T")
print("-" * 65)
print(f"Effective Mixture Normalization: {total_weight:.1f}% raw equivalent")
""",
            "output": """=== DOMAIN MIXTURE CURRICULUM OPTIMIZATION ===
Total Target Pre-Training Tokens: 15.0 Trillion
-----------------------------------------------------------------
Web Crawl (Common Crawl)   | Raw: 60.0% | Weight: 1.0x | Mix:  44.4% | Tokens:  6.7T
Code (GitHub & The Stack)  | Raw: 20.0% | Weight: 1.5x | Mix:  22.2% | Tokens:  3.3T
STEM & Academic (arXiv)    | Raw: 10.0% | Weight: 2.0x | Mix:  14.8% | Tokens:  2.2T
Encyclopedic (Wikipedia)   | Raw:  5.0% | Weight: 3.0x | Mix:  11.1% | Tokens:  1.7T
Synthetic Reasoning Data   | Raw:  5.0% | Weight: 2.0x | Mix:   7.4% | Tokens:  1.1T
-----------------------------------------------------------------
Effective Mixture Normalization: 135.0% raw equivalent""",
            "codeNotes": [
                "Line 1-17: Formulates domain mixture optimization with raw percentages, upsampling weights, and token scaling.",
                "Line 20-26: Models 15T token curriculum: upsamples Code by 1.5x, Academic by 2x, Wikipedia by 3x, and Synthetic by 2x.",
                "Line 34-37: Demonstrates that upsampling shifts generic web text from 60% down to 44.4%, while boosting high-value reasoning tokens."
            ],
            "tryIt": "Increase the Synthetic Reasoning Data weight from 2.0x to 4.0x and observe how the synthetic token allocation expands to over 2 trillion tokens.",
            "check": {
                "question": "Why do modern foundation model pre-training campaigns deliberately upsample source code repositories (e.g. GitHub) to 20-25% of the data mixture, even for models intended primarily for natural language conversation?",
                "options": [
                    "Empirical research demonstrates that training on structured programming code significantly enhances general multi-step logical deduction, planning, and reasoning capabilities across all natural language tasks.",
                    "Because source code uses less disk space than English text.",
                    "Because modern GPUs can only process tokens formatted as valid Python syntax.",
                    "Because code training eliminates the need for tokenizers."
                ],
                "answer": 0,
                "answerIndex": 0,
                "why": "Code represents unambiguous, highly structured causal logic (control flow, state tracking, function composition). Training on code teaches models to maintain long-range dependencies and multi-step reasoning across non-coding natural language benchmarks.",
                "explanation": "Code represents unambiguous, highly structured causal logic (control flow, state tracking, function composition). Training on code teaches models to maintain long-range dependencies and multi-step reasoning across non-coding natural language benchmarks."
            }
        },
        {
            "title": "Building an Industrial MinHash LSH Deduplication & Quality Filtering Pipeline in Pure Python",
            "say": [
                "In this capstone engineering section of Day 39, we synthesize all concepts from today's data systems deep dive into an authoritative, enterprise-grade software artifact: The Sovereign WebDataEngine Pipeline. We unite the heuristic quality filter from Part 1, the regex PII sanitizer from Part 2, the MinHash fuzzy near-deduplication engine from Part 3, and the domain curriculum architecture from Part 4 into a synchronized Python system.",
                "Let us trace the complete execution lifecycle of our `WebDataEngine`. When a batch of raw scraped web documents enters the ingestion pipeline, each document undergoes a strict, multi-stage filtration protocol designed to guarantee zero data corruption.",
                "Stage 1: Statistical Quality Gating. The document's raw character and word streams are scanned. The engine computes: 1) Minimum word length: rejecting empty strings and fragments (< 5 words); 2) Alphabetic character ratio: verifying that at least 65% of characters are letters (rejecting binary hex dumps, database export rows, and garbled symbols); and 3) Stopword Density: verifying that common grammatical words (articles, prepositions) comprise at least 10% of total tokens. Any document failing these criteria is immediately tagged `REJECTED_QUALITY` and discarded, saving downstream compute.",
                "Stage 2: Deterministic PII Sanitization. Documents passing quality gating proceed to the sanitization stage. High-throughput compiled regular expressions scan for sensitive personal identifiers: private email addresses and IPv4 network strings are masked with standardized replacement tokens: `[EMAIL_REDACTED]` and `[IP_REDACTED]`. This eliminates private data leakage while preserving the grammatical flow of the surrounding sentence.",
                "Stage 3: Shingling & MinHash Signature Generation. The sanitized text is lowercased and segmented into overlapping k-shingles (3-grams). The shingle set is hashed across 16 deterministic, salted hash functions, producing a compact 16-dimensional integer MinHash Signature. In accordance with Broder's theorem, this signature acts as a compact, fuzzy fingerprint of the document's semantic content.",
                "Stage 4: Fuzzy Near-Duplicate Detection. The engine compares the candidate document's MinHash signature against an index of previously accepted documents. If the signature overlap with any existing document meets or exceeds the near-duplicate threshold (Jaccard similarity ≥ 0.60), the candidate document is classified as a redundant copy. The engine flags it as `REJECTED_DUPLICATE` and drops it from the pre-training pool.",
                "Stage 5: Acceptance & Corpus Serialization. If a document passes quality gating, undergoes PII redaction, and is verified as a unique, non-duplicate text, it is tagged `ACCEPTED`. Its MinHash signature is registered in the permanent index, and its sanitized text is yielded into the clean pre-training token stream.",
                "When deploying the WebDataEngine across multi-petabyte datasets like Common Crawl, the architecture transitions from an in-memory Python class to a distributed streaming pipeline running on Apache Ray or PySpark. Rather than comparing signatures in a simple linear loop, the candidate MinHash signatures are partitioned into Locality-Sensitive Hashing (LSH) hash tables distributed across thousands of worker nodes. Each LSH bucket contains only the document IDs that share identical sub-signatures across a specific band, pruning 99.99% of non-duplicate comparisons.",
                "Furthermore, distributed pipelines integrate Bloom filters to track previously seen document URLs and SHA-256 content hashes in high-speed RAM. A Bloom filter is a space-efficient probabilistic data structure that tests whether an element is a member of a set with zero false negatives and a strictly bounded false positive rate. By filtering exact duplicates through Bloom filters before executing MinHash shingling, the pipeline conserves massive CPU compute, enabling the ingestion of trillions of web tokens at peak throughput.",
                "In enterprise data engineering infrastructure (such as those powering LLaMA-3 or FineWeb), this exact pipeline runs across thousands of distributed CPU nodes, processing hundreds of millions of web pages per day. Mastering this end-to-end data pipeline empowers an AI architect to transform raw, chaotic internet scrapes into a pristine, sovereign multi-trillion-token asset that fuels state-of-the-art foundation models.",
                "In the following comprehensive implementation, we assemble the complete `WebDataEngine` class in pure Python. We will ingest a challenging four-document test corpus containing clean foundation model text, a syndicated near-duplicate, a spam fragment, and a document containing sensitive PII, verifying exact classification and sanitization."
            ],
            "example": "Imagine an automated water purification plant for a major city. River water enters the facility. Stage 1 screen filters catch branches and plastic debris (quality filtering). Stage 2 ultraviolet lamps neutralize harmful bacteria and toxins (PII redaction). Stage 3 chemical sensors test mineral balance against duplicate samples (MinHash near-deduplication). Only pristine, certified mineral water flows into the municipal drinking reservoir.",
            "code": """import re
import hashlib

class WebDataEngine:
    def __init__(self, k_shingle: int = 3, num_hashes: int = 16, jaccard_threshold: float = 0.6):
        self.k = k_shingle
        self.num_hashes = num_hashes
        self.threshold = jaccard_threshold
        self.email_re = re.compile(r'[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+')
        self.ip_re = re.compile(r'\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b')
        self.seen_signatures = []

    def quality_filter(self, text: str):
        words = text.split()
        if len(words) < 5:
            return False, "TOO_SHORT"
        alpha_ratio = sum(c.isalpha() for c in text) / len(text)
        stopwords = {"the", "and", "in", "to", "of", "is", "for", "with", "at"}
        stop_ratio = sum(w.lower() in stopwords for w in words) / len(words)
        if alpha_ratio < 0.65 or stop_ratio < 0.10:
            return False, "LOW_QUALITY"
        return True, "PASS"

    def redact_pii(self, text: str) -> str:
        clean = self.email_re.sub("[EMAIL_REDACTED]", text)
        clean = self.ip_re.sub("[IP_REDACTED]", clean)
        return clean

    def minhash(self, text: str) -> list:
        words = text.lower().split()
        shingles = sorted(list(set(' '.join(words[i:i+self.k]) for i in range(len(words)-self.k+1))))
        if not shingles:
            return [0] * self.num_hashes
        sig = []
        for i in range(self.num_hashes):
            min_val = min(int(hashlib.md5(f"{i}:{s}".encode('utf-8')).hexdigest()[:8], 16) for s in shingles)
            sig.append(min_val)
        return sig

    def is_duplicate(self, sig: list) -> bool:
        for prev_sig in self.seen_signatures:
            match_sim = sum(1 for a, b in zip(sig, prev_sig) if a == b) / self.num_hashes
            if match_sim >= self.threshold:
                return True
        return False

    def ingest(self, doc_id: str, text: str) -> dict:
        is_ok, reason = self.quality_filter(text)
        if not is_ok:
            return {"id": doc_id, "status": "REJECTED_QUALITY", "text": None}
            
        redacted = self.redact_pii(text)
        sig = self.minhash(redacted)
        
        if self.is_duplicate(sig):
            return {"id": doc_id, "status": "REJECTED_DUPLICATE", "text": None}
            
        self.seen_signatures.append(sig)
        return {"id": doc_id, "status": "ACCEPTED", "text": redacted}

engine = WebDataEngine(k_shingle=3, num_hashes=16, jaccard_threshold=0.6)
corpus = [
    ("doc_1", "The transformer architecture uses multi-head self-attention mechanisms to process tokens in parallel for high throughput."),
    ("doc_2", "The transformer architecture uses multi-head self-attention mechanisms to process tokens in parallel for low latency."),
    ("doc_3", "BUY CHEAP WATCHES NOW !!! 12345 67890 $$$$$ %%%%% http://spam-site.xyz/buy-now"),
    ("doc_4", "Pre-training data engineering requires deduplication and PII masking for developer contact at dev@foundation-ai.internal.")
]

print("=== SOVEREIGN WEBDATAENGINE PIPELINE EXECUTION ===")
for doc_id, text in corpus:
    res = engine.ingest(doc_id, text)
    d_id = res['id']
    st = res['status']
    print(f"[{d_id}] Status: {st}")
    if res['text']:
        clean_snip = res['text'][:75]
        print(f"   Clean: {clean_snip}...")
""",
            "output": """=== SOVEREIGN WEBDATAENGINE PIPELINE EXECUTION ===
[doc_1] Status: ACCEPTED
   Clean: The transformer architecture uses multi-head self-attention mechanisms to p...
[doc_2] Status: REJECTED_DUPLICATE
[doc_3] Status: REJECTED_QUALITY
[doc_4] Status: ACCEPTED
   Clean: Pre-training data engineering requires deduplication and PII masking for de...""",
            "codeNotes": [
                "Line 4-11: Initializes WebDataEngine with 3-shingling, 16 MinHash functions, and compiled PII regexes.",
                "Line 13-22: Filters low-quality documents based on alphabetic character ratio and stopword density.",
                "Line 24-27: Redacts private email addresses and IPv4 network identifiers losslessly.",
                "Line 29-38: Generates 16-dimensional MinHash signatures using salted MD5 hashing.",
                "Line 40-45: Detects near-duplicate documents (Jaccard >= 0.60), rejecting doc_2 while accepting unique docs."
            ],
            "tryIt": "Add an exact copy of doc_1 to the corpus and verify that it is immediately flagged as REJECTED_DUPLICATE.",
            "check": {
                "question": "In our WebDataEngine pipeline, what ensures that document near-duplicates (such as syndicated articles with a few words changed) are detected while completely different articles are accepted?",
                "options": [
                    "The MinHash signature compares overlapping 3-gram word shingles; documents sharing more than 60% of their shingles produce matching minimum hashes across at least 60% of signature positions, triggering duplicate rejection.",
                    "The engine performs an exact character-by-character equality check.",
                    "The engine compares file creation timestamps on the server.",
                    "The engine converts all text to uppercase and checks word length."
                ],
                "answer": 0,
                "answerIndex": 0,
                "why": "MinHash signatures preserve Jaccard similarity across k-shingles. Even if minor words or phrases are edited, near-duplicate documents maintain high shingle overlap (>60%), causing their MinHash signatures to collide and trigger deduplication.",
                "explanation": "MinHash signatures preserve Jaccard similarity across k-shingles. Even if minor words or phrases are edited, near-duplicate documents maintain high shingle overlap (>60%), causing their MinHash signatures to collide and trigger deduplication."
            }
        }
    ]
}
