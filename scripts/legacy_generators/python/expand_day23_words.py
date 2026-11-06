# scripts/expand_day23_words.py
import json

with open("scripts/iot_net_day23.json", "r", encoding="utf-8") as f:
    d = json.load(f)

expansions = {
    0: (
        "In modern multi-layer PCB stackups, grounded coplanar waveguides (CPWG) are frequently preferred over simple microstrips. "
        "A CPWG features continuous ground copper pours on both sides of the center RF trace, stitched with densely spaced ground vias "
        "connecting to the underlying reference plane. These side ground pours confine electromagnetic fringe fields laterally, "
        "preventing parasitic RF cross-talk into adjacent high-speed digital lines such as SPI bus clocks or I2C lines. "
        "When engineering CPWGs, the spacing gap between the center trace and the side ground coplanar pours directly lowers the "
        "characteristic impedance, requiring narrower trace geometries to maintain the mandatory 50-Ohm target."
    ),
    1: (
        "The practical consequence of high VSWR in battery-powered transmitters is severe thermal stress and premature battery brownout. "
        "When power is reflected back toward the transceiver output stage, the power amplifier (PA) transistor must dissipate the reflected "
        "energy as heat. In extreme cases of open or short circuits (such as an antenna snapped off an industrial sensor chassis), the standing "
        "wave peak voltage can exceed the semiconductor junction breakdown rating, permanently destroying the RF front-end. "
        "Furthermore, modern RF transceivers incorporate automatic power foldback circuits that detect high reflected power and throttle back "
        "the PA bias current, unintentionally degrading communication range to protect the internal silicon."
    ),
    2: (
        "Component parasitics in RF matching networks become increasingly dominant at gigahertz frequencies. "
        "A 0402-size 2.2-nanohenry chip inductor does not act as a pure inductance; it has equivalent series resistance (ESR) and parasitic shunt capacitance. "
        "Above its self-resonant frequency (SRF), the inductor transitions into a capacitor! Similarly, chip capacitors exhibit equivalent series inductance (ESL) "
        "arising from their end metallization terminations. Hardware engineers must utilize calibrated S-parameter touchstone files provided by component "
        "manufacturers (such as Murata or TDK) when simulating matching networks in RF CAD tools like Keysight ADS or open-source Qucs, "
        "ensuring that the fabricated hardware matches theoretical Smith Chart calculations precisely."
    ),
    3: (
        "In practical indoor industrial deployments, free-space path loss is only the baseline attenuation model. "
        "Real-world RF propagation is heavily influenced by multipath reflections off concrete walls, metallic pipework, and steel trusses, "
        "creating constructive and destructive interference known as Rayleigh and Rician fading. At 2.45 GHz, a spatial displacement of just "
        "6 centimeters (half a wavelength) can shift an antenna from a peak reception node into a deep -30 dB multipath null! "
        "To combat this physical reality, enterprise IoT gateways employ spatial antenna diversity, utilizing two distinct antennas separated by "
        "at least one wavelength and switching between them dynamically using an RF multiplexer IC based on packet preamble RSSI."
    ),
    4: (
        "During high-volume factory calibration of industrial IoT devices, automated test equipment (ATE) performs rapid single-point VSWR and "
        "output power measurements inside RF shielded test enclosures. If a manufactured unit fails the VSWR < 1.5 threshold, it is automatically "
        "routed to a rework station where solder bridges, missing matching components, or conformal coating thickness defects are inspected. "
        "Conformal coatings used to waterproof outdoor IoT enclosures have a dielectric constant (epsilon_r ~ 3.2) that loads the fringing fields "
        "of PCB trace antennas, detuning the resonant frequency downward by 50 to 100 MHz. Factoring this coating shift into the matching network "
        "ensures that the finished, fully potted industrial product delivers maximum RF range in harsh outdoor field environments."
    )
}

for idx, exp in expansions.items():
    d["parts"][idx]["say"].append(exp)

with open("scripts/iot_net_day23.json", "w", encoding="utf-8") as f:
    json.dump(d, f, indent=2)

print("Expanded scripts/iot_net_day23.json successfully.")
