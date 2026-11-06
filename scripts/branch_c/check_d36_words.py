with open('C:/Users/Admin/Desktop/projects/Present-Career-os-platform/scripts/branch_c/build_day36_prompt.py', 'r', encoding='utf-8') as f:
    text = f.read()

namespace = {}
code_to_exec = text[:text.find('assert w_count >= 600')]
code_to_exec += """
    print(f"Part {i+1}: {w_count} words")
    total_words += w_count
print(f"Total: {total_words}")
"""
exec(code_to_exec, namespace)
