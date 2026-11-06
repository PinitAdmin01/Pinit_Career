import json

with open('scripts/iot_edge_day9.json', 'r', encoding='utf-8') as f:
    d9 = json.load(f)

# Part 1 is 510 -> needs +80 words
d9['parts'][1]['say'].append(
    "In addition to memory safety, avoiding heap allocation protects against long-term memory leaks in systems intended to run continuously for years without rebooting. In industrial smart meters or remote environmental monitors, a single memory leak during intermittent re-initialization could slowly exhaust SRAM after months of operation. The static C-array design of MicroMutableOpResolver completely removes this failure mode, guaranteeing that operator registrations never leak a single byte over the lifetime of the product."
)

# Part 2 is 537 -> needs +55 words
d9['parts'][2]['say'].append(
    "Moreover, the automated script can be configured to produce comprehensive build-time documentation, generating a human-readable Markdown summary of all registered operators, their Flash footprints, and the model's structural topology. This report provides immediate verification for firmware audits and compliance reviews without manual documentation overhead."
)

# Part 3 is 511 -> needs +80 words
d9['parts'][3]['say'].append(
    "When integrating third-party libraries or proprietary sensor algorithms alongside TFLM, compiler section flags provide clean architectural isolation. Each software component resides in its own discrete ELF section, ensuring that unused third-party helper routines do not hitchhike into the final firmware image, maintaining a lean, minimal binary footprint across all production software releases."
)

# Part 4 is 548 -> needs +45 words
d9['parts'][4]['say'].append(
    "Ultimately, by combining selective MicroMutableOpResolver registration with CMSIS-NN hardware-accelerated kernels, embedded engineers achieve the holy grail of TinyML: blazing fast inference execution speed paired with minimal non-volatile Flash silicon utilization."
)

with open('scripts/iot_edge_day9.json', 'w', encoding='utf-8') as f:
    json.dump(d9, f, indent=2)

print("Day 9 finalized.")
