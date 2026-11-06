import json

with open('scripts/iot_edge_day7.json', 'r', encoding='utf-8') as f:
    d7 = json.load(f)

# Part 1 is 578 words -> needs +20 words
d7['parts'][1]['say'].append(
    "In addition to forward compatibility, FlatBuffers enforces strict little-endian data layout regardless of the host CPU's native endianness. Because ARM Cortex-M processors natively operate in little-endian mode, 16-bit and 32-bit offset values are read directly by the load instructions without byte-swapping overhead (REV instructions). This hardware-level symmetry between the on-disk file serialization format and the processor's native register layout is the secret behind the zero-cycle latency of FlatBuffers access."
)

# Part 2 is 525 words -> needs +80 words
d7['parts'][2]['say'].append(
    "To eliminate all hidden dynamic allocations, the TFLM runtime also bypasses standard C++ exception handling (try, catch, throw) and Run-Time Type Information (RTTI). In GCC-ARM, enabling C++ exceptions introduces large unwinding tables (.ARM.extab and .ARM.exidx) that bloat the Flash binary by 30 to 80 kilobytes and require heap allocation when throwing an exception. TFLM codebases are strictly compiled with the flags -fno-exceptions and -fno-rtti. Any runtime initialization error, such as a missing operator or undersized tensor arena, immediately reports an explicit TfLiteStatus error code (kTfLiteError or kTfLiteOk) and logs a descriptive diagnostic message to the serial debug console via the lightweight MicroErrorReporter."
)

# Part 3 is 525 words -> needs +80 words
d7['parts'][3]['say'].append(
    "Furthermore, the TFLM graph representation cleanly decouples operator logic from hardware-specific acceleration. In pure reference mode, operators execute straightforward C++ arithmetic loops. However, when compiled for advanced silicon featuring hardware DSP or vector engines—such as ARM Cortex-M4/M7/M33 with CMSIS-DSP, or Cortex-M55/M85 with CMSIS-NN and Helium M-Profile Vector Extension (MVE)—the build system replaces the reference operator implementations with hand-crafted assembly kernels. Because the underlying FlatBuffer tensor representation is standardized and invariant, the exact same serialized model file runs seamlessly across a $1 reference microcontroller or a high-end vector DSP, automatically utilizing hardware SIMD instructions wherever available."
)

# Part 4 is 491 words -> needs +110 words
d7['parts'][4]['say'].append(
    "Finally, in automated Continuous Integration and Continuous Deployment (CI/CD) pipelines, model export must be treated as a deterministic build artifact. Modern MLOps workflows integrate the C++ header export step directly into the build pipeline using CMake or Make rules. Whenever data scientists retrain or fine-tune an edge model—for example, updating a vibration anomaly detector after collecting new factory telemetry—the automated pipeline invokes the Python model exporter, generates the model_data.cc and model_data.h files, computes a cryptographic SHA-256 integrity hash, and triggers a target firmware build. The embedded firmware tests automatically execute against hardware emulators or real target test benches, verifying bit-exact inference outputs before the new model binary is approved for production deployment."
)

with open('scripts/iot_edge_day7.json', 'w', encoding='utf-8') as f:
    json.dump(d7, f, indent=2)

print("Day 7 topped up successfully.")
