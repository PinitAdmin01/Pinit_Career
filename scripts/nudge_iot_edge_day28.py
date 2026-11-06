import json

with open('scripts/iot_edge_day28.json', 'r', encoding='utf-8') as f:
    d28 = json.load(f)

# Current counts: [595, 524, 535, 525, 496] Total: 2675
# Need: [0, 65, 55, 65, 90] words to pass 580 on all parts

nudges = [
    # Part 1: currently 524 -> add ~65 words
    (1, [
        "Furthermore, by maintaining a persistent circular history of the last three contiguous 1.0-second windows in SRAM, the synchronization manager supports retrospective fault verification. If a sudden transient triggers an anomaly alert, the classification engine can inspect the preceding and succeeding windows to confirm whether the event was an isolated impulse or the beginning of a sustained physical failure."
    ]),

    # Part 2: currently 535 -> add ~55 words
    (2, [
        "In addition, the feature extraction pipeline calculates the Crest Factor across each vibration axis—defined as the peak acceleration divided by the RMS acceleration. When combined with Kurtosis and MFCC energies, Crest Factor provides supplementary confirmation of impulsive impact dynamics, ensuring robust fault discrimination even in environments with fluctuating background vibrational noise."
    ]),

    # Part 3: currently 525 -> add ~65 words
    (3, [
        "To verify that the quantized dual-branch network executes with zero numeric drift, firmware developers run automated bit-exact validation tests on host simulations before flashing production silicon. Golden reference vectors generated in Python or TensorFlow Lite are compared against CMSIS-NN output tensors, ensuring that integer scaling factors produce identical classifications across development and bare-metal environments."
    ]),

    # Part 4: currently 496 -> add ~90 words
    (4, [
        "As railway systems transition toward fully autonomous train operation (ATO GoA4), edge-resident sensor intelligence will play an even more indispensable role. By performing multi-modal feature extraction and neural inference locally on the wheel carriage, trains can detect track fractures, bearing seizures, and wheel flat spots in real time, communicating critical safety alerts over low-bandwidth rail telemetry without relying on continuous trackside cellular coverage.",
        "This autonomous capability ensures passenger safety across tunnels, remote mountainous corridors, and desert routes where cloud connectivity is nonexistent."
    ])
]

for idx, paras in nudges:
    d28['parts'][idx]['say'].extend(paras)

d28['minutes'] = 38

with open('scripts/iot_edge_day28.json', 'w', encoding='utf-8') as f:
    json.dump(d28, f, indent=2, ensure_ascii=False)

print("Nudged Day 28 successfully.")
