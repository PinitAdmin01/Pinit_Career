import json

with open('scripts/iot_edge_day13.json', 'r', encoding='utf-8') as f:
    d13 = json.load(f)

# Part 0 is 529 -> needs +60 words
d13['parts'][0]['say'].append(
    "Furthermore, this static memory architecture eliminates memory leaks entirely. In applications designed for continuous multi-year operation, even a microscopic memory leak of 4 bytes per hour would eventually exhaust available RAM after months in the field. Bounding all allocations within an immutable static arena provides an unbreakable mathematical guarantee of continuous, leak-free operational stability."
)

# Part 1 is 512 -> needs +75 words
d13['parts'][1]['say'].append(
    "In addition to 2D convolutions, this unified MAC core executes 1D temporal convolutions, depthwise spatial filters, and fully-connected dense layers with bit-identical arithmetic. By standardizing the core mathematical loop, embedded firmware developers can optimize and audit a single assembly kernel that accelerates every layer in the neural network architecture."
)

# Part 2 is 484 -> needs +105 words
d13['parts'][2]['say'].append(
    "To handle networks with skip connections—such as residual blocks in ResNet or MobileNet architectures—the ping-pong scheduler can be extended with a third residual scratchpad buffer. By reserving a dedicated memory slot for the residual branch while ping-ponging intermediate convolutional layers in the primary buffers, the engine executes complex residual topologies while preserving maximum SRAM compaction."
)

# Part 3 is 437 -> needs +150 words
d13['parts'][3]['say'].append(
    "Crucially, the energy efficiency gains achieved by SIMD acceleration allow edge devices to adopt smaller, lighter, and more economical power sources. Instead of requiring large rechargeable lithium-ion battery packs with complex charging circuitry, devices powered by our Milestone 1 engine can run for up to a decade on inexpensive primary lithium coin cells. This dramatic reduction in battery volume and weight enables the design of miniature, unobtrusive sensor nodes that can be embedded directly inside motor housings, structural bridge girders, and medical wearable patches."
)

# Part 4 is 434 -> needs +155 words
d13['parts'][4]['say'].append(
    "Finally, achieving Milestone 1 certification establishes a standardized software baseline for your entire engineering organization. With our sovereign zero-heap engine, data science teams can design new quantized neural network models with full confidence that the embedded engineering team can deploy them to production silicon without rewriting operator kernels or redesigning memory architectures. This seamless bridge between machine learning research and bare-metal embedded deployment represents the true pinnacle of modern TinyML systems engineering."
)

with open('scripts/iot_edge_day13.json', 'w', encoding='utf-8') as f:
    json.dump(d13, f, indent=2)

print("Day 13 topped up successfully.")
