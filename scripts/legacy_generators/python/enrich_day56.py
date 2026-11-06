"""
Enrich Day 56 parts 3, 4, 5 to exceed 600 words per part.
"""
import os, sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from scripts.nlp_builder.day56 import DAY_56_DATA

p3_additions = [
    "To understand the mathematical rigor of MinHash deduplication, recall the fundamental theorem of Locality-Sensitive Hashing: for any two document shingle sets A and B, the probability that a random hash function h maps both sets to the identical minimum hash value is exactly equal to their Jaccard similarity, namely P(h(A) = h(B)) = J(A, B) = |A \u2229 B| / |A \u222a B|. By computing m independent hash signatures and banding them into b bands of r rows each such that m = b * r, the probability that two documents with Jaccard similarity s become candidate pairs equals 1 - (1 - s^r)^b. In enterprise pipelines ingesting hundreds of millions of synthetic tokens, tuning the parameters b and r creates an S-curve that sharply separates near-duplicate documents (s >= 0.8) from dissimilar texts, bounding false positives while reducing pairwise comparison time complexity from quadratic O(N^2) to near-linear O(N).",
    "Furthermore, in high-stakes regulatory environments, decontamination must extend beyond simple lexical matching to semantic paraphrase detection. Teacher models prompted with benchmark examples frequently rephrase questions using synonym substitutions or sentence inversions that escape naive 13-gram checks. To defeat adversarial contamination, advanced pipelines deploy dual-stage neural verification: candidate pairs passing an initial n-gram scan are embedded using dense bi-encoders, and cosine similarity is computed against an indexed vector database of all major evaluation sets. If cosine similarity exceeds 0.88, the candidate is routed to an automated judge LLM instructed to verify whether the underlying mathematical logic or deductive riddle is fundamentally identical. Only samples passing both lexical 13-gram independence and semantic non-entailment are certified for pre-training inclusion."
]

p4_additions = [
    "From a psychometric perspective, difficulty calibration in frontier synthetic data draws deeply upon modern Item Response Theory (IRT). Under the two-parameter logistic (2PL) model, the probability that an AI model with latent reasoning proficiency theta successfully solves a synthetic instruction i is expressed as P(Y_i = 1 | theta) = 1 / (1 + exp(-a_i * (theta - b_i))), where b_i represents the item difficulty parameter and a_i represents the item discrimination parameter. Items with steep discrimination curves cleanly distinguish between intermediate models and frontier reasoning engines, making them invaluable for benchmarking and specialized post-training. By evaluating synthetic prompts against an ensemble of models spanning different scale regimes (e.g., 7B, 14B, 32B, and 70B parameter checkpoints), the pipeline estimates empirical difficulty curves with statistical confidence intervals.",
    "Beyond scalar difficulty scoring, maintaining task diversity across high-dimensional semantic space requires active density sampling. In unconstrained generation, teacher models naturally gravitate toward high-probability modes in the latent distribution, producing tens of thousands of variations on common algorithms (such as binary search or merge sort) while entirely neglecting long-tail domain niches like compiler optimization passes or formal hardware verification languages like Verilog. To counteract this collapse, production taxonomy engines compute sentence embeddings of incoming instructions, clustering them into dynamic k-means or HDBSCAN centroids. The generation scheduler monitors cluster densities in real time, throttling prompts from saturated semantic clusters while boosting generation quotas for sparse clusters via targeted Evol-Instruct in-breadth mutations. This dynamic balancing ensures that the synthetic corpus forms a uniform covering of the target capabilities manifold."
]

p5_additions = [
    "Let us explore the operational systems architecture of ApexSynthetic when deployed at enterprise scale across distributed GPU clusters. In production environments processing billions of tokens monthly, the pipeline does not run as a monolithic script but rather as a resilient, asynchronous stream-processing topology orchestrated via Celery, Ray, or Apache Kafka. Seed records are partitioned across distributed worker nodes where generation, mutation, critique, and revision occur concurrently inside high-throughput vLLM inference engines configured with continuous batching and speculative decoding.",
    "Data provenance and compliance auditing form the backbone of the ApexSynthetic enterprise architecture. Under emerging international regulatory frameworks such as the European Union AI Act and ISO/IEC 42001, organizations deploying frontier models must demonstrate full transparency regarding training data lineage, copyright boundaries, and safety attestation. ApexSynthetic addresses this imperative by generating a cryptographic Merkle tree for every completed batch. Each synthetic instruction-response pair is assigned an immutable SHA-256 fingerprint computed across its seed identity, the exact constitutional principles invoked during critique, the decontamination hash verifying zero overlap with academic benchmarks, and the calibrated difficulty score. These fingerprints are persisted into append-only cryptographic audit logs, guaranteeing that every gradient step taken during downstream fine-tuning can be traced back to verified, constitutionally aligned synthetic origins.",
    "Finally, when formatting the output for downstream supervised fine-tuning or Direct Preference Optimization, ApexSynthetic implements intelligent token packing and loss masking. Because instruction-response pairs vary significantly in length, naive padding introduces excessive wasted computation. ApexSynthetic concatenates multiple independent interactions into contiguous sequences up to the maximum context window (e.g., 8,192 or 32,768 tokens) separated by end-of-turn delimiter tokens. Crucially, attention masks and cross-entropy loss computation are strictly masked over prompt and instruction tokens, ensuring that gradient updates backpropagate exclusively through the high-value, constitutionally aligned model responses."
]

DAY_56_DATA["parts"][2]["say"].extend(p3_additions)
DAY_56_DATA["parts"][3]["say"].extend(p4_additions)
DAY_56_DATA["parts"][4]["say"].extend(p5_additions)

import json
data_attr = "DAY_56_DATA"
file_path = "scripts/nlp_builder/day56.py"
title = DAY_56_DATA.get("title", "")
with open(file_path, "w", encoding="utf-8") as f:
    f.write(f'\"\"\"\nDay 56: {title}\nCourse 37: Natural Language Processing & Computational Linguistics\nPinIT Career OS - Month 2 Enterprise Expansion\n\"\"\"\n\n')
    f.write(f"{data_attr} = " + json.dumps(DAY_56_DATA, indent=4, ensure_ascii=False) + "\n")

print("Day 56 successfully enriched!")
