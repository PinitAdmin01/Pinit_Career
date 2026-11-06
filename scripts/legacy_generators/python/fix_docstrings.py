import re

with open('scripts/make_month2_days41_42.py', 'r', encoding='utf-8') as f:
    text = f.read()

# In lines before 'd41_parts = [', find all occurrences of """ inside class definitions and replace with '''
# Let's inspect where d41_parts starts
split_idx = text.find('d41_parts = [')
code_section = text[:split_idx]
rest_section = text[split_idx:]

# In code_section:
# The pattern is: dXX_pY_code = """ ... """
# We want any inner triple quotes to be ''' instead of """
# Let's replace docstrings inside classes with single quotes '''

def fix_inner_triple_quotes(section):
    lines = section.split('\n')
    new_lines = []
    in_code = False
    for line in lines:
        if line.startswith('d4') and '_code = """' in line:
            in_code = True
            new_lines.append(line)
        elif in_code and line.startswith('"""') and not line.startswith('"""import') and not line.startswith('"""from'):
            # This is closing the code string
            in_code = False
            new_lines.append(line)
        elif in_code and '"""' in line:
            # This is an inner docstring!
            new_lines.append(line.replace('"""', "'''"))
        else:
            new_lines.append(line)
    return '\n'.join(new_lines)

fixed_code_section = fix_inner_triple_quotes(code_section)

with open('scripts/make_month2_days41_42.py', 'w', encoding='utf-8') as f:
    f.write(fixed_code_section + rest_section)

print("Inner docstrings replaced with '''!")
