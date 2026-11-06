# scripts/topup_day37.py
import json

with open("scripts/iot_net_day37.json", "r", encoding="utf-8") as f:
    d = json.load(f)

# Boost Part 1
p1_additions = [
    "From an antenna design perspective, communicating with LEO satellites from small form-factor IoT hardware requires careful polarization matching. Terrestrial cellular towers employ linear polarization (typically dual-slant +/- 45 degree cross-polarized antennas). However, as a radio signal traverses the ionized upper atmosphere (the ionosphere), the presence of Earth's geomagnetic field causes Faraday Rotation, rotating the polarization plane of linearly polarized radio waves by unpredictable angles.",
    "If a linearly polarized ground transmitter sends a signal to a linearly polarized satellite receiver with a 90-degree rotated polarization plane, polarization mismatch loss exceeds 20 dB, completely dropping the connection. To eliminate Faraday rotation losses, 3GPP NTN mandates Circular Polarization (typically Right-Hand Circular Polarization or RHCP) for both satellite and terminal antennas. An RHCP wave continuously rotates in a helical spiral as it propagates through space, ensuring consistent signal reception regardless of terminal orientation or ionospheric rotation."
]
d["parts"][0]["say"].extend(p1_additions)

# Boost Part 2
p2_additions = [
    "In operational software environments, satellite ephemeris updates must be carefully managed to avoid memory bloat and stale trajectory calculations. SIB19 ephemeris parameters are typically valid for a validity window of 2 to 4 hours. Because edge devices sleep in deep Power Saving Mode (PSM) between transmissions, a device waking up after 12 hours cannot assume its stored ephemeris vectors are still accurate. If the device attempts to calculate Doppler pre-compensation using 12-hour-old orbital data, cumulative gravitational perturbations (such as atmospheric drag and Earth's oblateness) will produce position errors exceeding several tens of kilometers.",
    "Therefore, an industrial NTN modem driver maintains an internal Ephemeris Expiration Timer. Upon waking from PSM, the driver first checks whether the stored SIB19 epoch has expired. If stale, the modem delays uplink transmission, opens its receiver to decode the fresh SIB19 broadcast from the current overhead satellite, updates its local Keplerian state matrices in non-volatile flash memory, and only then proceeds with the Doppler-compensated uplink burst.",
    "Additionally, orbital propagation on microcontrollers without hardware floating-point units (FPUs) requires fixed-point arithmetic optimization. Calculating square roots and trigonometric functions (sine, cosine, and arc-cosine) in double-precision 64-bit software floating-point consumes thousands of CPU clock cycles. Production embedded firmware utilizes look-up tables and CORDIC (Coordinate Rotation Digital Computer) algorithms to evaluate spatial coordinate transforms in under 200 microseconds, preserving precious battery microjoules."
]
d["parts"][1]["say"].extend(p2_additions)

# Boost Part 3
p3_additions = [
    "To validate Doppler pre-compensation in real-world deployments, cellular network operators and chipset manufacturers conduct rigorous hardware-in-the-loop (HIL) laboratory testing using multi-channel RF satellite constellation emulators (such as Spirent, Keysight, or Rohde & Schwarz). The emulator dynamically injects real-time Doppler shift profiles, path loss fading curves, and ionospheric scintillation onto the RF signal, verifying that the device's pre-compensated uplink carrier frequency remains within the 3GPP TS 38.101-5 specification limit of +/- 0.1 parts per million (PPM) at the base station antenna port.",
    "Furthermore, 3GPP Release 17 introduces Differential Doppler Pre-Compensation for multi-tone transmissions. In NB-IoT multi-tone mode (where 3, 6, or 12 subcarriers are transmitted simultaneously), each subcarrier experiences a slightly different absolute Doppler frequency shift due to its distinct carrier frequency ($f_k = f_0 + k \\cdot \\Delta f$). While the percentage shift remains identical across all subcarriers, high-precision baseband DSP algorithms apply an inverse phase ramp across the inverse fast Fourier transform (IFFT) modulator to prevent inter-carrier interference (ICI) across the multitone transmission block."
]
d["parts"][2]["say"].extend(p3_additions)

# Boost Part 4
p4_additions = [
    "To prevent ping-pong handover effects where a device rapidly oscillates between two satellites with near-equal elevation angles, 3GPP NTN incorporates Hysteresis Thresholds and Time-to-Trigger (TTT) timers. In terrestrial cellular networks, a 2 dB to 3 dB hysteresis margin is sufficient because base stations are stationary. In satellite NTN, because elevation angles change dynamically by several degrees per minute, hysteresis must be dynamically scaled based on the relative elevation velocity ($d\\theta / dt$).",
    "If satellite A is descending at -3.5 degrees per minute while satellite B is rising at +4.0 degrees per minute, the handover manager projects the elevation crossover point several minutes into the future. By scheduling the handover at the predicted mathematical crossover point, the state machine guarantees that the transition occurs at the exact instant of maximum aggregate signal-to-noise ratio (SNR), avoiding premature handovers to satellites with low horizon elevation angles that suffer from heavy tropospheric attenuation and multipath ground reflections.",
    "Moreover, in modern mega-constellations operating hundreds or thousands of satellites in overlapping orbital shells (such as Walker-delta constellations), an edge node often has 3 to 6 candidate satellites above its 10-degree horizon simultaneously. The handover selection algorithm evaluates multi-dimensional utility metrics: not merely peak elevation, but remaining pass duration, available beam capacity, feeder-link ground station availability, and predicted Doppler rates. Choosing a satellite with 10 minutes of remaining visibility over one with only 2 minutes remaining reduces total handover overhead by 80%."
]
d["parts"][3]["say"].extend(p4_additions)

# Boost Part 5
p5_additions = [
    "From an enterprise telecommunications infrastructure vantage point, the convergence of terrestrial cellular networks and satellite non-terrestrial networks under 3GPP Release 17 represents a monumental paradigm shift. For decades, satellite communications functioned as an isolated, proprietary silo with specialized hardware, exorbitant bandwidth fees, and fragmented application ecosystems. By folding satellite links directly into the global 3GPP 5G and NB-IoT standard, the entire global ecosystem of SIM cards, roaming agreements, cloud platforms, and billion-unit silicon manufacturing scales to outer space.",
    "A standard commercial eSIM card provisioned by an enterprise mobile network operator (MNO) can now contain terrestrial carrier profiles alongside satellite NTN carrier profiles. When an asset tracker or shipping container moves across a seaport, it connects to local private 5G or commercial LTE-M networks for high-bandwidth telemetry. The moment the vessel leaves port and sails beyond terrestrial cell tower range, the modem detects loss of terrestrial coverage, switches to its satellite NTN profile, activates SIB19 ephemeris tracking, applies Doppler pre-compensation, and continues transmitting telemetry to the cloud with zero application disruption.",
    "This hybrid architecture unlocks unprecedented visibility across planetary logistics, environmental monitoring, sovereign defense, and critical infrastructure resilience. By commanding the full stack of orbital ephemeris geometry, relativistic velocity projections, subcarrier frequency synthesis, and automated handover state machines, you possess the definitive engineering expertise to architect planetary-scale wireless systems that never lose connectivity."
]
d["parts"][4]["say"].extend(p5_additions)

with open("scripts/iot_net_day37.json", "w", encoding="utf-8") as f:
    json.dump(d, f, indent=2)

print("Applied topup to Day 37 parts 1, 2, 3, 4, and 5.")

# Check words
total_words = 0
for idx, p in enumerate(d["parts"]):
    wc = sum(len(s.split()) for s in p["say"])
    total_words += wc
    print(f"Part {idx+1}: {wc} words")
print(f"Total Spoken Words: {total_words} words")
