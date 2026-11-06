# scripts/boost_iot_sec_day33.py
import json

def boost_day33():
    with open('scripts/iot_sec_day33.json', 'r', encoding='utf-8') as f:
        d = json.load(f)

    p1_add = [
        "In advanced semiconductor physics, carrier generation dynamics differ substantially between single-photon absorption (SPA) and two-photon absorption (TPA). In Single-Photon Absorption using 1064nm near-infrared lasers, each photon has sufficient energy (1.165 eV) to exceed the silicon bandgap (1.12 eV). However, because silicon absorbs 1064nm light linearly along the entire optical beam path, carriers are generated throughout the entire vertical thickness of the silicon substrate (typically 100 to 300 micrometers), potentially triggering bulk substrate currents that cause premature power-on resets.",
        "To achieve atomic-level vertical confinement, cutting-edge semiconductor failure analysis and penetration testing laboratories utilize Two-Photon Absorption (TPA) with ultra-short femtosecond pulsed lasers operating at 1300nm or 1550nm wavelengths. At 1300nm, individual photons have an energy of only 0.95 eV—strictly below the silicon bandgap. Linear absorption is zero; the silicon die is completely transparent to the beam.",
        "However, when a femtosecond laser pulse is focused through a high-numerical-aperture (NA > 0.8) microscope objective lens, the photon density at the focal point becomes so intense (exceeding gigawatts per square centimeter) that two photons are absorbed simultaneously by a single electron. Because TPA is a non-linear process that scales with the square of the optical intensity (I^2), carrier generation occurs exclusively within a microscopic 3D ellipsoid (the focal volume) measuring less than 1 micrometer in diameter and depth. This allows an attacker to inject faults into a specific buried transistor on Metal Layer 1 without affecting the overlying routing layers or underlying bulk substrate."
    ]

    p2_add = [
        "In Electromagnetic Fault Injection, the physical geometry of the magnetic coil determines the spatial distribution and depth of the induced B-field. Standard solenoidal coils produce a relatively diffuse magnetic field that spreads laterally across several square millimeters. To focus the flux into a sub-millimeter spot, researchers employ Sharpened Magnetic Core Probes utilizing high-permeability magnetic materials such as nickel-zinc (NiZn) or manganese-zinc (MnZn) ferrites.",
        "The ferrite core is micro-machined to an ultra-sharp conical tip with a radius of curvature under 50 micrometers. When a high-voltage current pulse discharges through the winding, the magnetic flux lines are concentrated through the sharp tip, creating an intense localized magnetic flux density (B > 5 Tesla) directly beneath the probe. When placed within 20 micrometers of the decapsulated silicon surface, the probe induces localized electric fields in on-chip copper interconnects that exceed the dielectric breakdown threshold of thin gate oxides if pulse amplitude is not carefully regulated.",
        "Furthermore, modern EMFI platforms incorporate Multi-Axis High-Speed Oscilloscopes with Real-Time RF Signal Acquisition. By attaching a high-bandwidth near-field magnetic snooping loop alongside the injection coil, the test station monitors both the injected pulse and the target chip's localized electromagnetic emissions simultaneously. This closed-loop feedback allows the automated system to measure the exact damping, resonance, and back-EMF of the silicon die, adapting pulse amplitude on-the-fly to maintain the target within the non-destructive fault injection sweet spot."
    ]

    p3_add = [
        "To appreciate the surgical precision of localized register bit-flipping, consider how modern microcontrollers implement hardware privilege levels and memory execution permissions. In an ARM Cortex-M33 or Cortex-M55 core with TrustZone, the security attribution of the executing code is governed by the Security Attribution Unit (SAU) and the internal processor core state register (specifically the Core Security State flag, which tracks whether the CPU is in Secure or Non-Secure state).",
        "Under normal execution, transitions between Non-Secure and Secure states are strictly mediated by Secure Gateway (SG) instructions and Non-Secure Callable (NSC) veneer memory regions. If non-secure software attempts to execute code located in secure flash or read secure SRAM, hardware bus arbiter logic intercepts the transaction and generates a SecureFault exception.",
        "However, if an attacker uses focused LFI or micro-EMFI to target the physical flip-flop holding the Core Security State flag while non-secure code is executing, the flag can be flipped from 0 (Non-Secure) to 1 (Secure). Instantly, the CPU core hardware switches its internal bus master privilege to Secure World! The non-secure application code—including any arbitrary payload injected by the attacker over a network socket—now executes with full Secure World privileges, completely bypassing all SAU boundaries, memory protection fences, and crypto-accelerator access restrictions without triggering a single bus fault."
    ]

    p4_add = [
        "In addition to active top-metal shield meshes and integrated photodiodes, high-security smartcards and automotive HSMs implement Substrate Noise Detection and Well-Current Balancing circuits. When a laser pulse or EMFI transient strikes a silicon junction, it injects millions of excess minority carriers into the p-type substrate or n-type well. These carriers must be collected by substrate tap contacts and well bias ties, creating a localized surge in substrate current (I_sub).",
        "Advanced secure silicon designs integrate Substrate Current Sensors (SCS) placed at regular intervals across the standard cell library. An SCS consists of a high-speed differential sense amplifier connected across two localized substrate taps. Under nominal operating conditions, substrate currents are balanced and generate negligible differential voltage. But when an LFI laser spot strikes anywhere within a 50-micrometer radius of an SCS, the localized carrier injection creates a sharp voltage gradient across the substrate resistance.",
        "The differential amplifier detects this transient within 500 picoseconds. Because the detection occurs in analog hardware directly within the substrate, the alarm does not rely on software interrupts, CPU execution, or clock distribution trees. The output of the SCS directly triggers an internal hardware crowbar circuit that shorts all volatile key storage registers to ground, guaranteeing that cryptographic secrets are completely destroyed before the optical pulse can affect the targeted register flip-flops."
    ]

    p5_add = [
        "In enterprise certification laboratories (such as those conducting Common Criteria AVA_VAN.5 assessments for banking smartcards or PSA Certified Level 3 evaluations), generating a comprehensive Spatial Fault Sensitivity Heatmap is a mandatory certification deliverable. The evaluation team mounts the device under test inside an automated environmental test chamber equipped with optical vibration isolation tables and motorized micrometer translation stages.",
        "The automated test framework sweeps hundreds of thousands of spatial grid points across the silicon floorplan, correlating the spatial coordinates with the physical IC layout (GDSII mask data). By superimposing the fault sensitivity heatmap directly onto the silicon layout artwork, security analysts can visually trace which specific standard cells, multiplexers, and flip-flop banks are susceptible to localized fault injection.",
        "If a specific block (such as an elliptic curve point adder or a secure boot flag register) lights up as 'Vulnerable' on the heatmap, the silicon design team applies targeted hardening in the next revision: replacing standard D-flip-flops with dual-interlocked storage cell (DICE) flip-flops, adding triple modular redundancy (TMR) with majority voting logic, or widening active top-metal shield routing over the vulnerable coordinate.",
        "Through this systematic synthesis of semiconductor physics, precision mechatronics, microarchitectural exploit analysis, and silicon-level shielding, the embedded security engineer establishes an empirical, data-driven methodology for building truly tamper-resistant computing appliances."
    ]

    d['parts'][0]['say'].extend(p1_add)
    d['parts'][1]['say'].extend(p2_add)
    d['parts'][2]['say'].extend(p3_add)
    d['parts'][3]['say'].extend(p4_add)
    d['parts'][4]['say'].extend(p5_add)

    with open('scripts/iot_sec_day33.json', 'w', encoding='utf-8') as f:
        json.dump(d, f, indent=2)

    print("Day 33 boosted successfully!")

if __name__ == '__main__':
    boost_day33()
