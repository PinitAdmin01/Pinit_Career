import json

with open('scripts/iot_edge_day7.json', 'r', encoding='utf-8') as f:
    d7 = json.load(f)

expansions = [
    # Part 0 (442 words) -> needs +160 words (target >= 600 words)
    (0, [
        "In production embedded engineering, the zero-copy philosophy dictates how firmware binaries interact with non-volatile memory controller peripherals. When a microcontroller executes code out of internal Flash (NOR flash) or through a high-speed Octal-SPI or Quad-SPI interface using Execute-in-Place (XIP) technology, the memory controller directly maps the external serial flash into the CPU's 32-bit linear physical memory map. This means memory addresses such as 0x08000000 (internal flash) or 0x90000000 (QSPI flash) can be read with standard LDR assembly instructions in single CPU clock cycles.",
        "Because FlatBuffers serializes data using internal offset pointers rather than memory-relative addresses, the entire .tflite model file can be placed at any arbitrary address in the flash map without requiring relocation patching. In contrast, Protocol Buffers or pickled Python formats rely on pointer swizzling and dynamic object graphs, forcing the embedded CPU to copy every tensor weight into precious SRAM. In ultra-low-power environmental monitoring sensors running on 64 KB of SRAM, reserving even 10 KB for a deserialization buffer would starve the acquisition pipeline. FlatBuffers guarantees that 100 percent of your SRAM remains dedicated to runtime activations, DMA ring buffers, and sensor math."
    ]),
    # Part 1 (384 words) -> needs +220 words (target >= 600 words)
    (1, [
        "To truly master the internal anatomy of FlatBuffers, you must examine how the format maintains backward and forward schema compatibility across firmware revisions. In industrial IoT fleets, sensor devices deployed in remote manufacturing plants or wind turbines often receive Over-The-Air (OTA) firmware updates. If a newer firmware version expects an additional metadata field—such as a model hash or temperature compensation coefficient—older firmware binaries reading a newly deployed model must not crash.",
        "FlatBuffers handles this via the vtable's 16-bit field table size. If the vtable size is 8 bytes, it can index up to two fields (since the header takes 4 bytes, leaving 4 bytes for two 16-bit offsets). If a new schema version introduces field 3, the compiler extends the vtable to 10 bytes. When an older firmware binary reads the model, its generated accessor only inspects offsets up to field 2. Conversely, if an older model is loaded by newer firmware, the accessor detects that the requested field offset lies beyond the vtable's table_size header. It immediately substitutes the schema-defined default value without reading invalid memory addresses. This elegant contract provides rock-solid, zero-overhead schema evolution without requiring runtime XML or JSON schema validation."
    ]),
    # Part 2 (346 words) -> needs +260 words (target >= 600 words)
    (2, [
        "When examining the internal implementation of the TFLM MicroInterpreter, we find an intentional absence of virtual method tables (vtables) and dynamic dispatch within the inner inference loop. In high-performance desktop C++, polymorphic class hierarchies rely on virtual function tables to resolve operator calls at runtime. However, on microcontrollers, virtual function calls introduce indirect branches that cause branch mispredictions, pipeline flushes, and pointer dereference penalties on modern ARM Cortex-M pipelines.",
        "Instead, the TFLM runtime resolves all kernel function pointers during the initial AllocateTensors() phase. Each operator registered in the MicroMutableOpResolver provides an immutable TfLiteRegistration struct containing C function pointers to Init, Prepare, and Eval functions. During the AllocateTensors() execution pass, the MicroInterpreter builds a static array of TfLiteNode structures inside the Tensor Arena. Each TfLiteNode contains direct pointers to its input and output tensors and the exact C function pointer to its Eval kernel. When Invoke() is called, the CPU executes a blazing fast flat for-loop: iterating through the array and calling node.Eval() directly via register-relative branch instructions (BLX). This zero-overhead execution pipeline extracts maximum throughput from every clock cycle."
    ]),
    # Part 3 (362 words) -> needs +240 words (target >= 600 words)
    (3, [
        "The static separation between Flash parameter storage and SRAM tensor arenas is the bedrock of TinyML determinism. In standard machine learning frameworks, tensors are mutable objects that can be reshaped, sliced, and reallocated on the fly. In TinyML on microcontrollers, dynamic reshaping is strictly prohibited. The shapes of all intermediate feature maps are frozen at compile time during the TensorFlow Lite FlatBuffer conversion process.",
        "This compile-time rigidity is an immense engineering advantage. Because the exact memory footprint of every convolution output, pooling buffer, and residual branch is statically known down to the single byte, the TFLM memory planner can compute a mathematically optimal packing schedule before the device boots. When the firmware calls AllocateTensors(), the allocator maps intermediate tensors into overlapping memory slots within the Tensor Arena, ensuring that tensors whose lifespans do not overlap share the exact same physical SRAM bytes. The Flash-resident model weights remain untouched in read-only memory, completely immune to buffer overflows or pointer corruption in the SRAM arena."
    ]),
    # Part 4 (254 words) -> needs +350 words (target >= 600 words)
    (4, [
        "When integrating the generated C++ header file into a commercial firmware repository, careful linker script configuration is essential. In GCC-ARM toolchains, constant arrays declared with `const uint8_t` are placed by default into the `.rodata` (read-only data) section. Linker scripts (`.ld` files) place `.rodata` into non-volatile Flash alongside the executable `.text` segment. However, if a developer mistakenly omits the `const` qualifier, the compiler will treat the model as mutable static data, placing it into the `.data` section. This catastrophic mistake causes the startup code (`Reset_Handler`) to copy the entire 200 KB model array from Flash into SRAM during boot, instantly depleting available RAM and triggering a hard fault!",
        "Furthermore, memory alignment must strictly adhere to the microcontroller's hardware requirements. Modern 32-bit and 64-bit ARM architectures require 32-bit words to be 4-byte aligned and 64-bit integers to be 8-byte aligned. When CMSIS-DSP vector extensions (such as Helium MVE on Cortex-M55) are enabled, vector load instructions (e.g., `VLD1.8`) require 16-byte alignment to achieve single-cycle throughput. If an unaligned model pointer is passed to an optimized vector kernel, the processor will either trigger an unaligned access HardFault exception or stall the pipeline for multiple penalty cycles.",
        "By enforcing `alignas(16)` on our exported C++ model array, we guarantee that the binary FlatBuffer starts at a 16-byte boundary in Flash. When tflite::GetModel() returns the root Model pointer, every sub-table, weight tensor, and quantization parameter maintains optimal SIMD alignment throughout the entire execution pipeline."
    ])
]

for idx, paras in expansions:
    d7['parts'][idx]['say'].extend(paras)

with open('scripts/iot_edge_day7.json', 'w', encoding='utf-8') as f:
    json.dump(d7, f, indent=2)

print("Enriched Day 7 successfully.")
