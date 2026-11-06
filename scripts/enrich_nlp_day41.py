import sys

if sys.stdout.encoding != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')

with open('scripts/nlp_builder/day41.py', 'r', encoding='utf-8') as f:
    content = f.read()

# Part 2 addition
p2_target = 'In the following Python script, we implement the complete ChatTemplateEngine class from first principles. We will implement both ChatML and LLaMA-3 tokenization formatters, serialize a multi-turn conversation, and mathematically verify header and boundary token placements.'
p2_new = '''"Tool-Calling and Structured JSON Generation in Modern Chat Templates introduces specialized functional syntax beyond standard human-assistant dialog. In enterprise agentic systems, conversational models do not merely generate prose; they must invoke external API endpoints, format database query arguments, and output strictly validated JSON schemas. Modern chat templates integrate specialized functional tokens such as tool_call and tool_response delimiters. During tokenization, system instructions and available tool declarations are rendered into distinct namespace headers, ensuring the transformer attends specifically to schema boundaries without confusing user queries with tool outputs.",
            "Security Vulnerabilities in Dynamic Template Ingestion warrant strict token-level sanitization. Naive template formatters evaluate user input strings directly against template engines without escaping control delimiters. If a user maliciously inputs end-of-turn or start-header tags, an unescaped formatter inadvertently splits the token stream into an attacker-controlled assistant turn, executing prompt injection. Production tokenizers neutralize this by mapping raw text strictly through subword lookup tables before applying template boundary tokens as non-splittable special IDs.",
            ''' + f'"{p2_target}"'
content = content.replace(f'"{p2_target}"', p2_new)

# Part 4 addition
p4_target = 'In the following Python script, we construct the complete SequencePackingEngine class. We will pack variable-length conversational examples into a fixed-length buffer, compute cumulative sequence length offsets (cu_seqlens), construct block-diagonal attention masks, and assert that cross-sample contamination is 100% prevented.'
p4_new = '''"FlashAttention VarLen and Block-Diagonal Packing Integration represents the cutting edge of GPU memory utilization during SFT. Rather than feeding padded matrices containing thousands of useless padding tokens into tensor cores—which wastes over 40% of hardware FLOPs—high-throughput training clusters concatenate multiple independent conversations into a contiguous 1D array. By passing a vector of cumulative sequence lengths (cu_seqlens) directly to custom CUDA kernels, the hardware computes attention exclusively within each conversation boundary, eliminating padding overhead entirely while preserving exact mathematical separation.",
            ''' + f'"{p4_target}"'
content = content.replace(f'"{p4_target}"', p4_new)

# Part 5 addition
p5_target = 'In the following Python script, we construct the complete RepetitionPenaltyEngine class. We will simulate an autoregressive generation step, detect repetitive logit loops, apply Keskar repetition penalties, and verify that diversity is restored.'
p5_new = '''"Validation Loss Divergence and Alignment Tax represent critical diagnostic indicators during supervised fine-tuning. When a model is fine-tuned too aggressively on narrow instruction sets, its pre-training capabilities degrade—a phenomenon known as the Alignment Tax, where mathematical reasoning, coding syntax, and broad factual recall regress. Production alignment teams continuously evaluate checkpoints against both instruction-following benchmarks and general capability test suites, employing early stopping and learning rate cosine decay to maintain foundational pre-training breadth.",
            ''' + f'"{p5_target}"'
content = content.replace(f'"{p5_target}"', p5_new)

with open('scripts/nlp_builder/day41.py', 'w', encoding='utf-8') as f:
    f.write(content)

print("Enriched scripts/nlp_builder/day41.py successfully!")
