with open('scripts/branch_c/build_day32_prompt.py', 'r', encoding='utf-8') as f:
    text = f.read()

p1_extra = '''    "Self-attention mathematical mechanics explain why negative constraints consistently fail where directional stimulus succeeds. When an engineer specifies negative instructions like 'do not discuss financial liabilities,' the transformer's multi-head attention heads must attend to the tokens representing 'financial' and 'liabilities' to compute contextual representations. This paradoxical attention activation inadvertently elevates the activation energy of related concepts in vocabulary projection layers, causing the model to mention the forbidden topic. In sharp contrast, directional stimulus prompting introduces positive semantic anchors, directing query-key dot products toward target conceptual clusters and naturally displacing irrelevant topics without negative activation interference.",
    "Empirical case studies in legal contract discovery and financial prospectus auditing reveal the transformative power of directional stimulus. In regulatory compliance reviews spanning thousands of corporate filings, standard zero-shot summarization overlooks critical statutory penalty clauses buried in lengthy footnotes. When a directional stimulus containing specific regulatory citation anchors is injected into the prompt prefix, retrieval recall for non-compliant contractual terms increases from forty-eight percent to ninety-six percent, demonstrating surgical thematic focus in highly technical domains.",
    "Contextual entropy modulation further enhances the precision of directional stimulus prompting. By analyzing token probability distributions emitted during generation, software systems can observe that directional hints compress prediction entropy around target concepts, reducing stochastic hallucinations and accelerating generation speed across enterprise cloud endpoints.",
'''

p2_extra = '''    "The Policy-LM training mechanics utilize reinforcement learning with customized reward functions tailored to downstream task metrics. During policy training, the small language model generates candidate directional hints from training inputs. The target model ingests each hint and generates a completion, which is scored by an automated evaluation oracle using metrics such as ROUGE, factual consistency classifiers, and human preference rewards. The resulting reward gradient updates the Policy-LM via Proximal Policy Optimization, training the compact network to discover subtle hint formulations that elicit optimal reasoning from the frozen target model.",
    "Prompt placement topology dictates how directional stimuli interact with system instructions and user context. Empirical ablation studies demonstrate that prepending the directional stimulus directly before the user query yields superior attention salience compared to appending hints at the end of context. When positioned immediately prior to the user query, the stimulus acts as an active interpretive lens, pre-conditioning the self-attention weights that ingest the problem statement and establishing dominant semantic query vectors.",
    "Speculative hint generation enables near-zero latency overhead in production dual-model pipelines. While the user's incoming query is undergoing preprocessing and security sanitization, the edge Policy-LM concurrently computes candidate directional hints. By overlapping network I/O with speculative hint generation, the system injects the stimulus before the primary foundation model's first token prefill phase commences, delivering deep semantic guidance with zero perceptible user delay.",
'''

p3_extra = '''    "Semantic differential analysis allows meta-prompting optimizers to diagnose systemic reasoning deficiencies across batches of validation queries. When evaluating candidate prompts, the meta-optimizer does not examine single failures in isolation; it computes a matrix of failure patterns, categorizing errors into conceptual drift, formatting violations, and reasoning gaps. The optimizer then formulates targeted prompt mutations that systematically address the underlying failure clusters, introducing defensive clarifications and calibrated exemplars.",
    "Multi-objective Pareto optimization balances accuracy gains against prompt token length and API execution latency. An unconstrained prompt optimizer often generates bloated prompt instructions containing hundreds of redundant words, driving up operational costs and slowing down model response times. Hardened meta-prompting harnesses incorporate length penalty constraints into the fitness function, selecting candidate prompts that achieve maximal task accuracy with minimal token overhead on the Pareto efficiency frontier.",
    "K-fold prompt cross-validation prevents automated prompt rewriters from overfitting to the idiosyncrasies of specific validation samples. By partitioning historical task examples into rotating training and sequestered evaluation folds, the optimization harness verifies that prompt mutations generalize reliably to unseen customer queries, preventing brittle linguistic overfitting and guaranteeing long-term production stability.",
'''

p4_extra = '''    "Discrete natural language program synthesis treats prompt discovery as a formal search problem over semantic operational spaces. The Automatic Prompt Engineer (APE) framework conceptualizes prompts as natural language code instructions that program neural networks. By sampling diverse initial instructions from a meta-model, evaluating execution trajectories over test suites, and iteratively selecting top candidates for evolutionary mutation, APE explores vast linguistic combinatorial spaces that human engineers could never manually navigate.",
    "Evolutionary crossover operators synthesize novel prompt templates by recombining effective instructional components from divergent parent prompts. If one parent prompt excels at establishing a rigorous professional persona while another parent prompt excels at enforcing structured JSON output constraints, the crossover engine prompts a language model to merge the complementary strengths into an integrated hybrid prompt, discovering synergistic instructional combinations that outperform either parent in isolation.",
    "Soft prompt tuning versus discrete prompt discovery represents a fundamental architectural dichotomy in enterprise prompt engineering. While continuous prompt tuning trains dense embedding vectors prepended to model weights, soft prompts are completely unreadable to humans, non-transferable across different model architectures, and completely unusable on commercial black-box APIs. Discrete prompt optimization produces human-readable, auditable, and platform-agnostic natural language prompts that can be deployed across any commercial or open-source foundation model.",
'''

p5_extra = '''    "Enterprise-grade directional stimulus engines integrate thread-safe connection pooling and asynchronous non-blocking worker pools using Python's asyncio and aiohttp ecosystems. In high-concurrency environments processing thousands of transactions per second, the engine routes requests through non-blocking worker queues, ensuring that Policy-LM invocations and target model streaming connections operate with minimal thread contention and deterministic sub-second latency.",
    "Automated fallback circuit breakers protect production applications against transient Policy-LM degradation or network timeout events. If the policy hint generator fails to return a valid stimulus within a strict fifty-millisecond latency deadline, the circuit breaker instantly bypasses the policy layer, injects a pre-compiled static domain hint from local memory, and routes the query directly to the target model, maintaining seamless system availability without user disruption.",
    "End-to-end cryptographic audit trails log every prompt optimization iteration, generated hint, and model completion to immutable enterprise data lakes. Compliance officers can trace the exact lineage of every prompt mutation, review evaluator scoring rubrics, and certify that automated prompt tuning loops never introduce non-compliant language, privacy leaks, or regulatory violations into enterprise customer-facing interfaces.",
'''

# Inject p1_extra before "part2_say ="
idx_p2 = text.find('part2_say = [')
text = text[:idx_p2-3] + p1_extra + text[idx_p2-3:]

# Inject p2_extra before "part3_say ="
idx_p3 = text.find('part3_say = [')
text = text[:idx_p3-3] + p2_extra + text[idx_p3-3:]

# Inject p3_extra before "part4_say ="
idx_p4 = text.find('part4_say = [')
text = text[:idx_p4-3] + p3_extra + text[idx_p4-3:]

# Inject p4_extra before "part5_say ="
idx_p5 = text.find('part5_say = [')
text = text[:idx_p5-3] + p4_extra + text[idx_p5-3:]

# Inject p5_extra before "parts_data = ["
idx_parts = text.find('parts_data = [')
text = text[:idx_parts-3] + p5_extra + text[idx_parts-3:]

with open('scripts/branch_c/build_day32_prompt.py', 'w', encoding='utf-8') as f:
    f.write(text)

print("Enriched build_day32_prompt.py successfully!")
