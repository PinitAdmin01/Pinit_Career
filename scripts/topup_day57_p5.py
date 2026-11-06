"""
Top up Part 5 of Day 57 to reach >= 600 words.
"""
import os, sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from scripts.nlp_builder.day57 import DAY_57_DATA

p5_more = [
    "From an engineering telemetry perspective, ApexGuard exposes rich OpenTelemetry metrics detailing P90, P95, and P99 latency percentiles across every moderation stage. When an incoming user prompt hits the edge gateway, the request payload is hashed and distributed concurrently across the Regex Signature Filter and the distilled Llama Guard worker. By executing the guardrail forward pass asynchronously alongside the primary LLM's prompt prefill stage, the net latency penalty of safety filtering is reduced to near-zero for non-adversarial traffic. If the guardrail flags a critical violation (such as S1 violent crime or S2 cyber exploitation) during prefill, a cancellation token immediately interrupts the primary LLM's KV cache allocation, aborting generation before a single token can be emitted.",
    "Furthermore, ApexGuard integrates an active feedback loop with synthetic data generation pipelines like ApexSynthetic (studied on Day 56). Every fuzzed prompt that successfully penetrates the model's defenses is flagged as an active alignment regression. The exploit payload, its conversational context, and the breached policy taxonomy are formatted into a Constitutional AI critique-revision tuple. The resulting purified instruction-response pair is fed directly into the model's continuous post-training pipeline, enabling autonomous self-healing where the frontier model incrementally hardens its own weights against newly discovered adversarial vectors."
]

DAY_57_DATA["parts"][4]["say"].extend(p5_more)

import json
data_attr = "DAY_57_DATA"
file_path = "scripts/nlp_builder/day57.py"
title = DAY_57_DATA.get("title", "")
with open(file_path, "w", encoding="utf-8") as f:
    f.write(f'\"\"\"\nDay 57: {title}\nCourse 37: Natural Language Processing & Computational Linguistics\nPinIT Career OS - Month 2 Enterprise Expansion\n\"\"\"\n\n')
    f.write(f"{data_attr} = " + json.dumps(DAY_57_DATA, indent=4, ensure_ascii=False) + "\n")

print("Day 57 Part 5 topped up!")
