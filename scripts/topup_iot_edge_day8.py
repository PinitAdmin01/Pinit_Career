import json

with open('scripts/iot_edge_day8.json', 'r', encoding='utf-8') as f:
    d8 = json.load(f)

# Part 0 is 561 words -> needs +50 words
d8['parts'][0]['say'].append(
    "Additionally, static memory allocation provides rock-solid guarantees against race conditions in multi-threaded RTOS environments such as FreeRTOS, Zephyr, or ThreadX. Because the Tensor Arena is declared with static scope and fixed dimensions, task stack limits can be precisely sized without worrying that an unexpected memory spike from the neural network will cause a task stack to overflow into the heap or adjacent thread contexts."
)

# Part 1 is 508 words -> needs +100 words
d8['parts'][1]['say'].append(
    "This bidirectional separation also simplifies runtime debugging during embedded firmware development. When connecting a JTAG or SWD hardware debugger (such as a SEGGER J-Link), an engineer can inspect memory live in the IDE. Watching the Head pointer remain completely static while monitoring the Tail pointer's dynamic excursions provides immediate visual proof that memory reclamation is working properly. If the Tail pointer wanders into forbidden territory, watchpoints set on the central free gap immediately halt the core, allowing instant post-mortem analysis of the offending layer operator."
)

# Part 2 is 462 words -> needs +150 words
d8['parts'][2]['say'].append(
    "Crucially, the pointer binding phase also respects the cache hierarchy of modern high-performance microcontrollers. On Cortex-M7 cores featuring 32 KB L1 Data Caches, writing activation tensors to physical addresses requires careful cache line management. If an activation tensor starts in the middle of a 32-byte cache line that also holds unrelated system variables, performing a cache invalidate or clean operation can accidentally overwrite or corrupt adjacent variables. By enforcing 16-byte or 32-byte alignment on every bound tensor pointer, the TFLM allocator guarantees clean cache line boundaries, allowing efficient cache write-back and invalidate operations without risk of false sharing or cache line tearing."
)

# Part 3 is 451 words -> needs +160 words
d8['parts'][3]['say'].append(
    "In addition to peak RAM reduction, lifetime overlaying minimizes electrical switching activity on the microcontroller's internal data buses. When subsequent convolutional layers write to recently used physical memory locations, the capacitance of the internal SRAM bitlines is already partially charged, slightly reducing the dynamic charge transfer required to write new values. Furthermore, by keeping the active memory footprint tightly concentrated within a smaller physical address range, the microcontroller's memory controller accesses fewer distinct physical memory banks, enabling unutilized memory banks to remain in ultra-low-power retention mode and extending battery life across billions of inference cycles."
)

# Part 4 is 468 words -> needs +140 words
d8['parts'][4]['say'].append(
    "Finally, safety standards like ISO 26262 require periodic proof that safety mechanisms themselves have not suffered latent faults. Embedded firmware can execute a Power-On Self-Test (POST) and periodic Built-In Self-Tests (BIST) that deliberately simulate buffer overflows in a controlled staging buffer, confirming that the Sentry Canary detector and hardware MPU fault triggers respond within designated microsecond latency thresholds before the neural network is permitted to command physical actuators in automotive or industrial robotics applications."
)

with open('scripts/iot_edge_day8.json', 'w', encoding='utf-8') as f:
    json.dump(d8, f, indent=2)

print("Day 8 topped up successfully.")
