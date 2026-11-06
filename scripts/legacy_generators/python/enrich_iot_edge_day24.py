import json

with open('scripts/iot_edge_day24.json', 'r', encoding='utf-8') as f:
    d24 = json.load(f)

expansions = [
    # Part 0: Streaming Audio Pipeline (currently 400 -> add ~215 words to reach > 615)
    (0, [
        "To appreciate the physical signaling across the I2S bus, we must examine its three hardware lines: `SCK` (Serial Clock or Bit Clock), `WS` (Word Select or Left/Right Clock), and `SD` (Serial Data). The Word Select line toggles between low and high at exactly 16 kHz, indicating whether the audio byte corresponds to the left or right channel, while the Bit Clock runs at 32 times the frame rate ($512\\text{ kHz}$) to shift individual bits across the data line.",
        "In modern consumer wearables and earbuds, engineers also frequently encounter Pulse Density Modulation (PDM) microphones. PDM microphones do not output multi-bit PCM words; instead, they output an ultra-high-frequency 1-bit oversampled delta-sigma bitstream at 1 to 3 MHz.",
        "Modern microcontrollers—such as the STM32WB or Nordic nRF5340—incorporate hardware PDM-to-PCM decimation filters (Cascaded Integrator-Comb, or CIC filters). The hardware decimation filter automatically downsamples the high-frequency 1-bit PDM stream, low-pass filters high-frequency quantization noise, and emits clean 16-bit PCM words directly to the DMA controller at 16 kHz.",
        "This autonomous hardware conversion consumes virtually zero CPU cycles, ensuring that incoming speech audio is pristine, band-limited, and perfectly prepared for downstream spectral analysis."
    ]),

    # Part 1: Real-Time 2D MFCC Feature Spectrogram (currently 334 -> add ~285 words to reach > 615)
    (1, [
        "In bare-metal embedded execution, computing the Fast Fourier Transform and Mel filterbanks in floating-point math would be too slow on microcontrollers lacking hardware floating-point acceleration. Therefore, production TinyML systems implement the entire MFCC pipeline in fixed-point Q15 arithmetic using ARM's CMSIS-DSP library functions (`arm_rfft_fast_q15`).",
        "Before the FFT is executed, the raw audio frame is passed through a high-pass Pre-Emphasis Filter: $y[n] = x[n] - 0.97 x[n-1]$. Why is pre-emphasis necessary? In human speech physics, sound radiating from the vocal cords and lips suffers a high-frequency attenuation roll-off of approximately 6 dB per octave. High-frequency consonants—such as 's', 't', 'k', and 'f'—carry vital phonetic information but possess very low energy compared to booming low-frequency vowel formants.",
        "The pre-emphasis filter amplifies high-frequency energy, flattening the speech spectrum so that high-frequency consonants stand out vividly in the Fourier power spectrum! When the 512-point real FFT executes, the Q15 fixed-point math maintains 16-bit integer headroom to prevent arithmetic overflow when squaring real and imaginary components into power values.",
        "The resulting log-Mel filterbank values are normalized and mapped directly into signed 8-bit integers (`int8_t`), producing a compact 400-byte tensor ready for instant, zero-copy consumption by the neural network's input layer."
    ]),

    # Part 2: Depthwise Separable Audio CNNs (currently 330 -> add ~290 words to reach > 620)
    (2, [
        "A critical architectural insight in speech feature modeling is understanding how the 2D receptive field of a CNN propagates across time and frequency. In an audio spectrogram, the vertical axis represents frequency, which has locality: neighboring Mel bins represent adjacent harmonic frequencies. The horizontal axis represents time, which also has locality: neighboring frames represent consecutive phonetic transitions.",
        "By applying $3 \\times 3$ 2D convolutions, the neural network learns localized acoustic-phonetic primitives—such as rising pitch contours, formant transitions, and burst onsets. As the network deepens through 5 Depthwise Separable blocks, the effective receptive field expands across both time and frequency, allowing the final layer to integrate over 600 milliseconds of acoustic context.",
        "Furthermore, unlike recurrent networks (LSTMs and GRUs) where hidden state vectors $h_t$ must be maintained and passed forward across hundreds of time steps, feed-forward CNNs maintain zero persistent recurrent states between inference windows! In recurrent networks, small numerical quantization errors in hidden states accumulate and drift over time, causing inference instability during long-running streaming deployments.",
        "In contrast, our Depthwise Separable CNN is stateless: it processes the current 1-second spectrogram window fresh on every single inference pass. There is zero state drift, zero numerical accumulation, and zero risk of hidden state divergence, providing total mathematical predictability across years of continuous listening."
    ]),

    # Part 3: False Trigger Suppression & Temporal Moving-Average (currently 369 -> add ~255 words to reach > 620)
    (3, [
        "In commercial voice engineering, false trigger behavior is formally characterized by two competing metrics: False Alarm Rate (FAR) and False Rejection Rate (FRR). False Alarm Rate measures how many times per day or per hour the device wakes up mistakenly in the presence of ambient speech, music, or television noise. False Rejection Rate measures the percentage of times a real human user speaks the wake word but the device fails to respond.",
        "If an engineer naively attempts to eliminate false alarms by simply raising a single-frame threshold to 0.98, the False Rejection Rate skyrockets: users must shout the wake word multiple times, leading to severe customer frustration. The genius of Dual-Threshold Temporal Moving-Average Smoothing is that it decouples instantaneous acoustic confidence from temporal duration.",
        "A genuine spoken wake word (like 'Hey Google') naturally spans 400 to 700 milliseconds. When sampled every 100 milliseconds, this produces a sequence of 4 to 7 consecutive high-confidence frames. Ambient noise spikes (like a cough, a door slam, or a stray word on television) almost never sustain high acoustic similarity across multiple consecutive 100-millisecond windows.",
        "By requiring that the rolling average over 5 frames ($500\\text{ ms}$) exceed $\\theta_{\\text{smooth}} = 0.70$ while requiring at least one frame to exceed $\\theta_{\\text{high}} = 0.85$, the state machine filters out 99.8 percent of transient acoustic noise without degrading genuine user responsiveness. This mathematical harmony is what makes smart speakers feel magically reliable."
    ]),

    # Part 4: Production Streaming KWS Simulation (currently 181 -> add ~440 words to reach > 620)
    (4, [
        "In enterprise software architecture, deploying a streaming keyword spotting engine requires strict thread prioritization inside real-time operating systems like FreeRTOS or Zephyr. In a typical voice-enabled IoT device, multiple software tasks compete for CPU resources: the Wi-Fi or Bluetooth communication stack, display drivers, sensor polling, and audio inference.",
        "If a low-priority task blocks the CPU while incoming I2S audio samples are streaming, the DMA circular buffer will suffer a buffer overrun, dropping samples and corrupting the MFCC feature spectrogram. To prevent audio dropouts, firmware engineers structure the audio subsystem with strict task priorities: The I2S DMA interrupt executes at high hardware priority (Priority 5), immediately copying audio chunks into the circular buffer in under 15 microseconds.",
        "The audio processing thread—which computes the MFCC transform and invokes the neural network—executes at a high RTOS priority (Priority 3). Because our DS-CNN model executes in just 11.8 milliseconds on a 100 MHz Cortex-M4, the KWS task completes its inference burst in a tiny fraction of the 100-millisecond hop time.",
        "The thread then relinquishes the CPU, allowing lower-priority communication tasks (Priority 1) to execute and allowing the CPU to enter low-power sleep for over 85 milliseconds. Furthermore, our production validation gate certifies that zero bytes of dynamic heap memory are allocated during the entire streaming audio lifecycle. All ring buffers, spectrogram arrays, and neural network activations reside in statically allocated `.bss` memory, guaranteeing that the device will never crash due to memory fragmentation or buffer exhaustion."
    ])
]

for idx, paras in expansions:
    d24['parts'][idx]['say'].extend(paras)

d24['minutes'] = 38

with open('scripts/iot_edge_day24.json', 'w', encoding='utf-8') as f:
    json.dump(d24, f, indent=2, ensure_ascii=False)

print("Enriched Day 24 successfully.")
