with open("scripts/build_day24_full.py", "r", encoding="utf-8") as f:
    text = f.read()

extra_p3_more = """
Additionally, in enterprise batch processing and complex form validation, throwing an exception on the very first validation error is often undesirable. If a user fills out a loan application with ten fields and three are invalid, failing immediately on the first field forces the user to submit three times to discover all errors. To solve this, enterprise domain models utilize **Composite Validation Exceptions** (or validation result accumulators). The validator checks all fields, collects all error descriptors into an internal list, and if non-empty, throws a single `ValidationException` containing the full collection of field-level violations. This provides an optimal, user-friendly API experience while maintaining strict domain invariants.
"""

target = "strict architectural decoupling between core business rules and user-facing presentation logic.\n"
replacement = target + extra_p3_more + "\n"

text = text.replace(target, replacement)

with open("scripts/build_day24_full.py", "w", encoding="utf-8") as f:
    f.write(text)

print("Updated Part 3 with composite validation exception section")
