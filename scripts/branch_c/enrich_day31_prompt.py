with open('scripts/branch_c/build_day31_prompt.py', 'r', encoding='utf-8') as f:
    text = f.read()

p1_extra = '''    "Autoregressive token sampling mathematically amplifies early probabilistic divergences across deep multi-step reasoning horizons. When a model selects an improbable token early in a chain, the conditional probability distribution for all subsequent tokens shifts dramatically to maintain narrative consistency with the erroneous choice. Token-level beam search cannot resolve this problem because individual tokens lack semantic completeness: an unpromising individual token may be necessary to begin an exceptional phrase, while an attractive initial token may lead into a logical cul-de-sac. Only by elevating search to the level of complete, atomic semantic thoughts can an external controller evaluate strategic trajectory promise before committing computational resources.",
    "Experimental cognitive architectures demonstrate that decoupling generation from evaluation mirrors the dual-process cognitive theories of human decision-making. System One operates through fast, intuitive, heuristic pattern recognitionanalogous to immediate autoregressive token generationwhile System Two engages slow, deliberate, analytical reasoning that simulates outcomes and backtracks upon encountering obstacles. By embedding large language models within explicit Tree-of-Thoughts controllers, we endow generative systems with artificial System Two deliberative capabilities, enabling robust performance on mission-critical enterprise workflows that confound raw autoregressive models.",
'''

p2_extra = '''    "Calibrating heuristic evaluation rubrics requires balancing quantitative discrimination with scoring stability across diverse prompt queries. When state evaluators output raw scalar numbers, models frequently suffer from grade inflation, assigning high scores to mediocre candidate thoughts due to sycophancy or default optimism. To eliminate this distortion, robust enterprise evaluators utilize comparative ranking prompts or multi-criteria rubric matrices: scoring candidate states across feasibility, constraint alignment, and residual risk independently before computing a normalized weighted composite score.",
    "State serialization formats dictate how intermediate reasoning nodes are represented and passed between generation and evaluation cycles. Production controllers represent each state node as an immutable JSON document containing a canonical snapshot of active variables, accumulated constraints, identified risks, and the explicit hypothesis history. This structured representation allows downstream evaluator prompts to audit the entire reasoning trajectory with zero contextual ambiguity, preventing the loss of critical background details as the search tree branches deeper.",
'''

p3_extra = '''    "Asynchronous parallel dispatching across distributed LLM worker pools eliminates wall-clock latency bottlenecks in wide tree exploration. When a parent node branches into four candidate thoughts, a naive synchronous controller would execute four sequential API round-trips, accumulating seconds of idle network waiting time. A hardened Python search harness employs asynchronous coroutines to dispatch all candidate thought generations and subsequent heuristic evaluations in parallel, saturating available API concurrency limits and compressing multi-stage tree search latencies into near-interactive timeframes.",
    "Dynamic beam width throttling adjusts search thoroughness in real time based on task difficulty and runtime budget metrics. When early heuristic evaluations reveal a single dominant path with exceptional confidence scores, the controller dynamically contracts the beam width to one, rapidly accelerating down the clear corridor. Conversely, when candidate scores are tightly clustered with high uncertainty, the controller automatically expands the beam width, exploring multiple parallel avenues until a decisive quality differentiator emerges.",
'''

p4_extra = '''    "Topological execution scheduling guarantees strict causal ordering and dependency resolution across complex reasoning graphs. In a Graph-of-Thoughts architecture, the controller maintains an active dependency graph using Kahn's algorithm, continuously monitoring in-degree counters for every thought vertex. Vertices whose prerequisites are fully evaluated are placed on the execution frontier, while blocked vertices remain dormant until all upstream ancestor nodes publish valid evaluation tokens, preventing race conditions or incomplete context injection.",
    "Dynamic graph re-writing allows the cognitive controller to restructure reasoning topologies on the fly in response to intermediate findings. If an exploratory branch discovers that an initial problem premise was flawed or underspecified, the graph controller can inject a clarifying prompt node, sever invalid downstream dependency edges, and re-route remaining sub-tasks to address the clarified objective, providing unprecedented cognitive adaptability in fluid enterprise environments.",
'''

p5_extra = '''    "Production-grade error handling and resilient retry strategies protect tree search controllers against intermittent API outages and rate limits. The Python execution harness wraps all network interactions in exponential backoff decorators configured with jittered retry intervals, gracefully handling HTTP 429 rate limit exceptions, socket timeouts, and transient cloud gateway drops. If a candidate thought generation repeatedly fails, the controller marks the individual node as unviable rather than crashing the entire search tree, preserving system uptime.",
    "Formal audit ledgers and cryptographic state hashing provide complete forensic provenance for every enterprise decision reached through non-linear reasoning. By computing SHA-256 hashes of input prompts, intermediate candidate thoughts, evaluator scores, and the final winning path, the Python harness constructs an immutable Merkle tree of the decision process. This comprehensive audit trail enables enterprise compliance officers and external regulators to inspect the exact deliberative path, verify human approvals, and certify compliance with regulatory governance standards.",
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

with open('scripts/branch_c/build_day31_prompt.py', 'w', encoding='utf-8') as f:
    f.write(text)

print("Enriched build_day31_prompt.py successfully!")
