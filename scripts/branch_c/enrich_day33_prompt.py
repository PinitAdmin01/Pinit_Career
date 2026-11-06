with open(r'C:\Users\Admin\Desktop\projects\Present-Career-os-platform\scripts\branch_c\build_day33_prompt.py', 'r', encoding='utf-8') as f:
    text = f.read()

p2_extra = '''    "Formal validation of persona role stability requires continuous behavioral audit probes during live debate cycles. If an autonomous agent begins drifting from its assigned persona—such as a security auditor softening its posture under pressure from an aggressive product manager—the orchestration supervisor detects the semantic drift via embedding similarity against the baseline persona profile and instantly injects a supervisory reinforcement prompt, restoring the agent to its required skeptical stance.",
    "Multi-persona system prompt compilation utilizes Jinja templating engines to inject dynamic organizational context into immutable role definitions. By decoupling static persona archetypes from dynamic situational parameters such as regulatory jurisdictions, active cloud budgets, and system SLAs, enterprise teams can deploy standardized persona libraries across heterogeneous business units with guaranteed behavioral consistency.",
'''

p3_extra = '''    "Asymmetric information distribution protocols simulate realistic organizational decision environments where no single participant possesses omniscience. In high-fidelity enterprise simulations, the orchestrator provisions personas with distinct, non-overlapping subsets of the problem context: the finance persona receives budget ledgers and vendor licensing terms, while the systems architect receives infrastructure telemetry and service level agreements. This deliberate information asymmetry forces agents to cross-examine each other to uncover the complete factual landscape, unlocking authentic collaborative intelligence.",
    "Automated dialectical deadlock resolution prevents recursive debate loops where personas repeat identical arguments without moving toward compromise. When the orchestration harness detects that debate entropy has dropped below a critical threshold—signaling that personas are trapped in an ideological stalemate—the controller introduces an external Socratic Catalyst prompt that presents a novel compromise constraint, breaking the impasse and propelling the ensemble toward synthesis.",
'''

p4_extra = '''    "Statistical calibration of persona confidence scores counteracts cognitive bias and overconfidence anomalies across different foundation model families. Because different base LLMs exhibit varying degrees of inherent calibration error, the consensus arbiter applies Platt scaling and isotonic regression to raw persona confidence scores before computing weighted voting tallies. This empirical calibration ensures that a confidence score of ninety percent represents an authentic nine-in-ten probability of empirical correctness.",
    "Decentralized governance mechanisms integrate cryptographic proof-of-deliberation ledgers with smart contract execution layers. Once the consensus arbiter ratifies a weighted voting decision, the signed decision payload and its cryptographic debate trace are committed to a distributed ledger. This immutable publication guarantees that mission-critical operational decisions cannot be repudiated, altered, or wiped by rogue administrators.",
'''

p5_extra = '''    "Dynamic worker autoscaling on Kubernetes ensures that high-concurrency Socratic debate clusters maintain predictable response latencies during peak enterprise demand. When multi-agent deliberation requests spike, the orchestrator automatically provisions dedicated Ray worker pods equipped with local vLLM inference instances, isolating debate workloads from shared enterprise API gateways and eliminating queue contention.",
    "Comprehensive synthetic benchmark suites continuously evaluate ensemble accuracy against historical architectural decisions with known outcomes. By running automated regression tests across hundreds of historical engineering post-mortems and technology migrations, the platform engineering team empirically verifies that multi-persona Socratic ensembles consistently outperform isolated single-prompt completions before promoting new persona prompts to production.",
'''

# Insert p2_extra into part2_say
idx_p2_end = text.find('part3_say = [')
text = text[:idx_p2_end-3] + p2_extra + text[idx_p2_end-3:]

# Insert p3_extra into part3_say
idx_p3_end = text.find('part4_say = [')
text = text[:idx_p3_end-3] + p3_extra + text[idx_p3_end-3:]

# Insert p4_extra into part4_say
idx_p4_end = text.find('part5_say = [')
text = text[:idx_p4_end-3] + p4_extra + text[idx_p4_end-3:]

# Insert p5_extra into part5_say
idx_p5_end = text.find('parts_data = [')
text = text[:idx_p5_end-3] + p5_extra + text[idx_p5_end-3:]

with open(r'C:\Users\Admin\Desktop\projects\Present-Career-os-platform\scripts\branch_c\build_day33_prompt.py', 'w', encoding='utf-8') as f:
    f.write(text)

print("Enriched build_day33_prompt.py successfully!")
