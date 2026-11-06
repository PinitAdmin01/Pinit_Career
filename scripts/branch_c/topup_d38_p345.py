with open('C:/Users/Admin/Desktop/projects/Present-Career-os-platform/scripts/branch_c/build_day38_prompt.py', 'r', encoding='utf-8') as f:
    text = f.read()

p3_add = '''    "Empirical cross-entropy evaluations confirm that budgeted token pruning preserves critical reasoning chains without loss of inferential fidelity. When downstream foundation models are tested on complex mathematical reasoning and legal statutory interpretation using compressed contexts, accuracy scores remain within one percent of uncompressed baselines, demonstrating that information density is effectively preserved.",\n'''

p4_add = '''    "Continuous memory profiling across enterprise clusters demonstrates that smaller Key-Value cache allocations significantly reduce tail latency spikes during heavy inference concurrency. By preventing memory paging events and eliminating high-bandwidth memory bus saturation, context compression ensures that enterprise AI platforms deliver consistent, predictable sub-second response times across all operational tiers.",\n'''

p5_add = '''    "Enterprise dashboard integration exposes real-time context economics metrics directly to financial operations teams. Executives and engineering managers can track cumulative token volume reductions, estimated cloud billing savings, average compression ratios by business unit, and latency improvements across millions of daily transactions, validating the financial efficiency of the compression platform.",\n'''

# Insert p3_add before part4_say
idx_p4 = text.find('part4_say = [')
text = text[:idx_p4-3] + p3_add + text[idx_p4-3:]

# Insert p4_add before part5_say
idx_p5 = text.find('part5_say = [')
text = text[:idx_p5-3] + p4_add + text[idx_p5-3:]

# Insert p5_add before parts_data
idx_parts = text.find('parts_data = [')
text = text[:idx_parts-3] + p5_add + text[idx_parts-3:]

with open('C:/Users/Admin/Desktop/projects/Present-Career-os-platform/scripts/branch_c/build_day38_prompt.py', 'w', encoding='utf-8') as f:
    f.write(text)

print("Topped up Day 38 Parts 3, 4, 5!")
