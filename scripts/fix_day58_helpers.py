with open("scripts/build_iot_sec_day58.py", "r", encoding="utf-8") as f:
    text = f.read()

# Helper block for SymbolicTerm & DolevYaoKnowledgeBase
helper_defs = '''class SymbolicTerm:
    def __init__(self, name: str, args: list = None):
        self.name, self.args = name, args or []
    def __repr__(self):
        return f"{self.name}({', '.join(repr(a) for a in self.args)})" if self.args else self.name
    def __eq__(self, other):
        return isinstance(other, SymbolicTerm) and self.name == other.name and self.args == other.args
    def __hash__(self):
        return hash((self.name, tuple(self.args)))

class DolevYaoKnowledgeBase:
    def __init__(self, initial_knowledge: set = None):
        self.known_terms = set(initial_knowledge or [])
    def learn(self, term: SymbolicTerm):
        self.known_terms.add(term)
        if term.name == "pair" and len(term.args) == 2:
            self.known_terms.add(term.args[0])
            self.known_terms.add(term.args[1])
        if term.name == "senc" and len(term.args) == 2 and term.args[1] in self.known_terms:
            self.known_terms.add(term.args[0])
    def can_deduce(self, target: SymbolicTerm) -> bool:
        return target in self.known_terms
'''

# Insert helper into Part 2
pos2 = text.find('p2_code = """# Day 58 Part 2:')
insert_pos2 = text.find('class ProtocolEvent:', pos2)
text = text[:insert_pos2] + helper_defs + '\n' + text[insert_pos2:]

# Ensure Part 4 has imports
pos4 = text.find('p4_code = """# Day 58 Part 4:')
text = text[:pos4] + 'p4_code = """# Day 58 Part 4: Automated Counterexample Generation & Protocol Flaw Detection\nimport struct\nimport hashlib\n' + text[pos4 + len('p4_code = """# Day 58 Part 4: Automated Counterexample Generation & Protocol Flaw Detection\n'):]

# Insert helper into Part 5
pos5 = text.find('p5_code = """# Day 58 Part 5:')
insert_pos5 = text.find('class IndustrialProtocolFormalVerifier:', pos5)
text = text[:insert_pos5] + helper_defs + '\n' + text[insert_pos5:]

with open("scripts/build_iot_sec_day58.py", "w", encoding="utf-8") as f:
    f.write(text)

print("Patched standalone helpers into Day 58 snippets!")
