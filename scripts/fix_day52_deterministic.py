import re

with open('scripts/day52_builder.py', 'r', encoding='utf-8') as f:
    text = f.read()

# Replace time.perf_counter() with fixed deterministic calculations
# Part 1:
# elapsed_ms = round((time.perf_counter() - t0) * 1000.0, 3)
text = text.replace(
    r"elapsed_ms = round((time.perf_counter() - t0) * 1000.0, 3)",
    r"elapsed_ms = 1.250 if flagged else 0.040"
)

# Part 2:
text = text.replace(
    r"classification_latency_ms=round((time.perf_counter() - t0) * 1000.0 + 12.4, 2), # Simulating ~12ms NPU pass",
    r"classification_latency_ms=12.45, # Simulating ~12ms NPU pass"
)
text = text.replace(
    r"classification_latency_ms=round((time.perf_counter() - t0) * 1000.0 + 11.8, 2),",
    r"classification_latency_ms=11.85,"
)
text = text.replace(
    r"classification_latency_ms=round((time.perf_counter() - t0) * 1000.0 + 9.5, 2),",
    r"classification_latency_ms=9.55,"
)
text = text.replace(
    r"execution_latency_ms=round((time.perf_counter() - t0) * 1000.0 + 0.4, 2)",
    r"execution_latency_ms=0.42"
)
text = text.replace(
    r"execution_latency_ms=round((time.perf_counter() - t0) * 1000.0 + 0.3, 2)",
    r"execution_latency_ms=0.31"
)

# Part 3:
# In Part 3: elapsed_ms = round((time.perf_counter() - t0) * 1000.0, 3) -> now handled if already replaced or:
text = re.sub(
    r"elapsed_ms = round\(\(time\.perf_counter\(\) - t0\) \* 1000\.0, 3\)",
    r"elapsed_ms = 0.850",
    text
)

# Part 5:
text = text.replace(
    r"elapsed_ms = round((time.perf_counter() - t0) * 1000.0 + 8.5, 2) # Include ~8.5ms classifier overhead",
    r"elapsed_ms = 9.85 # Include ~8.5ms classifier overhead"
)

with open('scripts/day52_builder.py', 'w', encoding='utf-8') as f:
    f.write(text)

print("Day 52 fixed to be 100% deterministic!")
