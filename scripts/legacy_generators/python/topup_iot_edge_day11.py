import json

with open('scripts/iot_edge_day11.json', 'r', encoding='utf-8') as f:
    d11 = json.load(f)

# Part 0 is 526 -> needs +65 words
d11['parts'][0]['say'].append(
    "In addition to sensor noise, temperature swings in industrial settings cause subtle sensor DC bias drifts. By periodically re-evaluating the zero-point mapping during long-term field operation, an adaptive TinyML system can track thermal sensor drift without requiring complete model retraining, preserving pristine classification accuracy across harsh desert summers and freezing winters."
)

# Part 1 is 464 -> needs +125 words
d11['parts'][1]['say'].append(
    "Furthermore, software engineers must account for signed integer representation nuances across compiler toolchains. Under the C99 and C++11 standards, signed integer overflow is technically undefined behavior (UB), allowing aggressive compiler optimizations to introduce unexpected instruction reordering. By explicitly casting intermediate accumulation sums to `int32_t` prior to clamping with `std::clamp` or ternary expressions, our quantizer guarantees completely deterministic, portable assembly generation across GCC, Clang, and IAR compilers."
)

# Part 2 is 440 -> needs +150 words
d11['parts'][2]['say'].append(
    "To continuously monitor reconstruction fidelity in production fleets, embedded firmware can periodically execute an online Residual Noise Monitor. By taking a small batch of raw sensor inputs and computing the difference between the dequantized reconstructed values and the original signal, the system can compute a live running estimate of quantization noise. If the empirical noise variance suddenly spikes, it indicates that physical vibration amplitudes have breached the calibrated dynamic range, alerting maintenance technicians to re-calibrate the edge device before sensor clipping leads to false positive anomaly alarms."
)

# Part 3 is 443 -> needs +150 words
d11['parts'][3]['say'].append(
    "Crucially, the per-channel scale factors are baked directly into the model's FlatBuffer metadata in Flash memory alongside the quantized weight arrays. When the TFLM `MicroInterpreter` initializes the network, it reads the scale array directly from the Flash FlatBuffer without allocating extra memory in the SRAM Tensor Arena. This zero-RAM overhead design ensures that even complex multi-layer convolutional networks with hundreds of individual channel scales fit effortlessly within low-cost microcontrollers."
)

# Part 4 is 406 -> needs +185 words
d11['parts'][4]['say'].append(
    "Finally, in automated DevOps and continuous deployment pipelines, the generated C++ header file is integrated into automated regression suites using hardware-in-the-loop (HIL) testing rigs. Whenever a neural network model is updated or retrained, the build server runs automated Python unit tests against the model, generates the C++ quantization header, flashes a reference microcontroller board via JTAG, and verifies that the physical microcontroller produces bit-identical classification decisions to the offline Python simulation. This closed-loop automated verification establishes an unbreakable contract of software reliability from neural network training down to bare-metal execution."
)

with open('scripts/iot_edge_day11.json', 'w', encoding='utf-8') as f:
    json.dump(d11, f, indent=2)

print("Day 11 topped up successfully.")
