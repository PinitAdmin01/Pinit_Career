import ast

with open("scripts/create_cyber_day53_data.py", "r", encoding="utf-8") as f:
    tree = ast.parse(f.read())

for node in tree.body:
    if isinstance(node, ast.Assign):
        for target in node.targets:
            if isinstance(target, ast.Name) and target.id.startswith("say_p"):
                words = 0
                if isinstance(node.value, ast.List):
                    for elt in node.value.elts:
                        if isinstance(elt, ast.Constant):
                            words += len(str(elt.value).split())
                print(f"{target.id}: {words} words")
