import json

with open('scripts/iot_edge_day27.json', 'r', encoding='utf-8') as f:
    d27 = json.load(f)

# Current word counts: [500, 442, 432, 443, 474] Total: 2291
# Need ~100-160 words per part to comfortably pass 580 words per part

expansions = [
    # Part 0: currently 500 -> add ~110 words to reach > 610
    (0, [
        "In production testing facilities, measuring these sub-millijoule energy bursts requires specialized test instruments. A standard digital multimeter cannot capture a 15-millisecond current spike because its internal integration ADC updates at only a few Hertz, displaying an inaccurate averaged blur.",
        "Instead, embedded test benches utilize dedicated precision DC power analyzers—such as the Keysight N6705 or the Nordic Semiconductor Power Profiler Kit II (PPK2). These instruments sample supply current at 100,000 samples per second or faster, with dynamic auto-ranging shunts that seamlessly transition from measuring microamps during sleep to tens of milliamperes during neural inference without introducing measurement-corrupting burden voltage drops."
    ]),

    # Part 1: currently 442 -> add ~170 words to reach > 612
    (1, [
        "The Race-to-Sleep principle also dictates how firmware architects configure microcontroller operating clock frequencies. A common novice intuition is to reduce the CPU clock frequency—for instance, running the Cortex-M4 at 16 MHz instead of 80 MHz—under the mistaken belief that lowering the clock saves power because instantaneous active current drops from 12 mA to 3 mA.",
        "However, when you calculate total energy: $E = V \\cdot I \\cdot t$, lowering the clock frequency slows down computation by a factor of five! The inference that previously completed in 15 ms at 80 MHz now takes 75 ms at 16 MHz! Multiplying 3.3V by 3 mA by 75 ms yields $742.5\\ \\mu\\text{J}$, compared to $594\\ \\mu\\text{J}$ at 80 MHz!",
        "Running slowly consumed 25 percent MORE total energy because the system remained awake five times longer, during which internal voltage regulators, clock trees, and peripheral biases continued to bleed energy. It is almost always more energy-efficient to run the CPU at maximum frequency, complete the neural inference as fast as physically possible, and drop instantly back into deep sleep."
    ]),

    # Part 2: currently 432 -> add ~175 words to reach > 607
    (2, [
        "Designing the gate drive circuit for the P-channel MOSFET requires careful attention to electrical transients. When the P-MOSFET suddenly turns on, the uncharged decoupling capacitors on the peripheral sensor rail act as a momentary short circuit to ground, drawing a massive inrush current spike that can pull down the main 3.3V supply rail and reset the microcontroller.",
        "To prevent inrush-induced brownouts, hardware designers place an RC slew-rate limiter on the MOSFET gate or select integrated load switches featuring built-in controlled soft-start turn-on slew rates. A 100-microsecond controlled ramp allows peripheral decoupling capacitors to charge smoothly without dipping the microcontroller's power supply rail.",
        "Additionally, firmware must respect sensor power-on reset (POR) stabilization times. Turning on the power rail is not instantaneous; analog sensor reference voltages and internal sigma-delta converters require several milliseconds to settle before outputting valid data. Reading sensor registers too quickly results in corrupted, noisy samples that produce false anomaly classifications."
    ]),

    # Part 3: currently 443 -> add ~165 words to reach > 608
    (3, [
        "Another crucial consideration when selecting lithium chemistries for remote edge AI nodes is temperature derating. In extreme winter temperatures reaching minus 30 degrees Celsius, electrolyte conductivity declines sharply across all chemical systems. While Lithium Thionyl Chloride retains superior low-temperature performance compared to lithium-ion cells, its internal resistance increases significantly.",
        "At sub-zero temperatures, the voltage sag during high-current neural network inference is amplified. If the supercapacitor buffer is undersized, the passivated voltage drop will cross the brownout threshold, halting operations until warmer spring weather arrives. Safety-critical edge engineering requires profiling battery voltage sag across the entire target thermal envelope (from minus 40 to plus 85 degrees Celsius) inside an environmental test chamber.",
        "Furthermore, firmware can implement dynamic temperature-aware clock scaling. When an onboard thermistor reports sub-zero temperatures, the microcontroller can reduce its peak clock frequency just enough to limit peak instantaneous current draw, staying comfortably above the passivated brownout threshold while the supercapacitor buffers each compute burst."
    ]),

    # Part 4: currently 474 -> add ~140 words to reach > 614
    (4, [
        "To ensure that deployed edge fleets maintain their multi-year autonomy without unexpected field failures, production firmware incorporates continuous Coulomb-counting health telemetry. The microcontroller maintains a non-volatile record in Flash of total wake cycles executed, cumulative active milliseconds, and minimum recorded supply rail voltages during inference bursts.",
        "Once a week, or whenever an industrial gateway polls the edge node via low-power wireless, the node transmits a compact State-of-Charge (SoC) and battery health diagnostic report. If an environmental anomaly or firmware bug causes the device to wake up more frequently than planned, maintenance engineers receive an automated predictive battery exhaustion alert months in advance.",
        "This level of disciplined, end-to-end energy engineering elevates TinyML from a fragile academic curiosity into a dependable, battle-hardened industrial technology ready for global deployment across critical infrastructure."
    ])
]

for idx, paras in expansions:
    d27['parts'][idx]['say'].extend(paras)

d27['minutes'] = 38

with open('scripts/iot_edge_day27.json', 'w', encoding='utf-8') as f:
    json.dump(d27, f, indent=2, ensure_ascii=False)

print("Enriched Day 27 successfully.")
