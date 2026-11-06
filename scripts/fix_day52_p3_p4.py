with open('scripts/day52_builder.py', 'r', encoding='utf-8') as f:
    text = f.read()

# Replace the incorrect replacement in part 3 and 4
text = text.replace(
    r"elapsed_ms = 1.250 if flagged else 0.040\n        \n        return PIIAnonymizationResult",
    r"elapsed_ms = 0.850\n        \n        return PIIAnonymizationResult"
)
text = text.replace(
    r"elapsed_ms = 1.250 if flagged else 0.040\n        is_valid = (parsed is not None and invariants_ok)",
    r"elapsed_ms = 0.350\n        is_valid = (parsed is not None and invariants_ok)"
)

with open('scripts/day52_builder.py', 'w', encoding='utf-8') as f:
    f.write(text)

print("Fixed Part 3 and 4 elapsed_ms!")
