with open('scripts/branch_c/build_day31_prompt.py', 'r', encoding='utf-8') as f:
    text = f.read()

p4_add = '''    "Empirical complexity analyses confirm that Graph-of-Thoughts reduces token redundancy by orders of magnitude compared to parallel independent generation. By merging overlapping exploratory branches into shared intermediate synthesis vertices, the graph controller prevents duplicate downstream reasoning. In complex multi-document summarization and legal compliance reconciliation, this structural reuse decreases total required API calls by over sixty percent while generating demonstrably more cohesive and logically unified conclusions.",\n'''

p5_add = '''    "Seamless integration with enterprise identity providers and role-based access control frameworks ensures that non-linear reasoning controllers adhere strictly to institutional security boundaries. The Python controller validates user authorization scopes before scheduling tool invocations or accessing protected knowledge repositories, enforcing least-privilege principles across all generated thoughts. Furthermore, all intermediate prompts, evaluator verdicts, and final synthesis documents are encrypted both in transit and at rest using enterprise-managed keys, safeguarding proprietary organizational intelligence.",\n'''

# Insert p4_add into part4_say before the closing bracket of part4_say
idx_p5 = text.find('part5_say = [')
text = text[:idx_p5-3] + p4_add + text[idx_p5-3:]

# Insert p5_add into part5_say before parts_data
idx_parts = text.find('parts_data = [')
text = text[:idx_parts-3] + p5_add + text[idx_parts-3:]

with open('scripts/branch_c/build_day31_prompt.py', 'w', encoding='utf-8') as f:
    f.write(text)

print("Topped up Day 31 Part 4 and Part 5!")
