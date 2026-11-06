with open(r'C:\Users\Admin\Desktop\projects\Present-Career-os-platform\scripts\branch_c\build_day34_prompt.py', 'r', encoding='utf-8') as f:
    text = f.read()

p3_extra = '''    "Automated noise variance calibration measures how background corpus density impacts needle salience across varying textual genres. Because technical documentation, conversational transcripts, and legal statutes exhibit distinct syntactic structures, distractor interference manifests differently across domains. In conversational logs, frequent topic shifts confuse temporal recency heads; in legal contracts, repetitive definitions induce semantic aliasing. The evaluation harness programmatically adjusts haystack lexical density, providing enterprise teams with actionable guidelines for document-specific context curation.",
    "Cross-attention heat map visualization tools convert abstract attention tensor weights into interpretable visual diagnostics for systems engineers. By extracting query-to-key attention matrices from open-weights models during benchmark runs, platform architects can visually observe attention dispersion across the middle valley in real time. These diagnostic heat maps clearly reveal whether failure cases stem from positional neglect, competing distractor attraction, or tokenization boundary fragmentation, providing empirical guidance for prompt refactoring.",
'''

p4_extra = '''    "Dynamic document indexing with hierarchical table of contents injection creates an overarching semantic map at the primacy frontier. By prepending a concise, structured index that lists every injected document alongside a brief summary and its explicit XML tag identifier, the prompt engineer equips the language model with an immediate topological guide. When answering complex queries, the model's early attention heads reference the structural index first, establishing direct coordinate targets before retrieving detailed data from deeper context locations.",
    "Context pruning filters powered by small local cross-encoders eliminate irrelevant sentences within individual documents prior to prompt assembly. While coarse chunk-level retrieval brings in relevant document sections, up to sixty percent of text within those chunks consists of contextual filler that adds zero informational value to the specific user inquiry. Running a lightweight cross-encoder over candidate chunks extracts solely the most salient sentences, preserving precious context window capacity while dramatically boosting downstream reasoning accuracy.",
'''

p5_extra = '''    "Real-time token rate limiting and dynamic concurrency management protect downstream enterprise inference clusters from GPU out-of-memory crashes during massive context bursts. Processing multiple concurrent prompts each exceeding one hundred thousand tokens places extreme pressure on GPU high-bandwidth memory and key-value cache allocations. The Python controller implements token-aware semaphore locks that dynamically throttle concurrent long-context requests, queuing jobs and routing overflow to secondary clusters to guarantee ninety-nine point nine percent service availability.",
    "Comprehensive synthetic regression testing suites run continuous automated checks across all production prompt templates to detect context drift. Every week, the evaluation runner dispatches thousands of parameterized synthetic prompts across the enterprise model fleet, tracking retrieval fidelity across all positional percentiles. If a foundation model provider updates its serving infrastructure—causing middle-valley retrieval degradation—the automated testing framework immediately flags the anomaly and alerts platform reliability engineers.",
'''

# Insert p3_extra into part3_say
idx_p3_end = text.find('part4_say = [')
text = text[:idx_p3_end-3] + p3_extra + text[idx_p3_end-3:]

# Insert p4_extra into part4_say
idx_p4_end = text.find('part5_say = [')
text = text[:idx_p4_end-3] + p4_extra + text[idx_p4_end-3:]

# Insert p5_extra into part5_say
idx_p5_end = text.find('parts_data = [')
text = text[:idx_p5_end-3] + p5_extra + text[idx_p5_end-3:]

with open(r'C:\Users\Admin\Desktop\projects\Present-Career-os-platform\scripts\branch_c\build_day34_prompt.py', 'w', encoding='utf-8') as f:
    f.write(text)

print("Enriched build_day34_prompt.py successfully!")
