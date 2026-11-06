import json

with open('scripts/iot_edge_day21.json', 'r', encoding='utf-8') as f:
    d21 = json.load(f)

# Part 1 (idx 1): 536 -> add ~60 words
d21['parts'][1]['say'].extend([
    "In multi-tenant microcontrollers running alongside real-time industrial communication stacks (such as EtherCAT or PROFINET), saving 600 kilobytes of Flash makes the difference between fitting inside internal Flash and being forced to add external SPI Flash chips. External Flash chips consume additional circuit board space, add 30 percent more power draw, and introduce latency wait states that degrade real-time performance."
])

# Part 4 (idx 4): 529 -> add ~65 words
d21['parts'][4]['say'].extend([
    "When integrating TFLM into real-time operating systems like Zephyr RTOS or FreeRTOS, the global Tensor Arena can also be mapped to specific fast-access memory regions—such as tightly-coupled data memory (DTCM). On ARM Cortex-M processors, accessing DTCM requires zero wait states, enabling the core to read weights and write activations at maximum CPU frequency without bus contention from other peripherals."
])

d21['minutes'] = 38

with open('scripts/iot_edge_day21.json', 'w', encoding='utf-8') as f:
    json.dump(d21, f, indent=2, ensure_ascii=False)

print("Topped up Day 21 successfully.")
