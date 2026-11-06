# scripts/boost_iot_sec_day39.py
import json

def boost_day39():
    with open('scripts/iot_sec_day39.json', 'r', encoding='utf-8') as f:
        d = json.load(f)

    # Fix p3 code escaping
    d['parts'][2]['code'] = d['parts'][2]['code'].replace('print("\nSpatial Leakage', 'print("\\nSpatial Leakage')
    d['parts'][2]['code'] = d['parts'][2]['code'].replace('print("\nInterpretation', 'print("\\nInterpretation')
    d['parts'][4]['code'] = d['parts'][4]['code'].replace('print("\nPackage-Level', 'print("\\nPackage-Level')

    p2_add = [
        "In addition to standard semi-rigid coaxial loop construction, micro-fabricated planar thin-film coils integrated directly onto silicon or ceramic probe tips represent the cutting edge of near-field instrumentation. Using photolithography and thin-film gold deposition, planar coils achieve loop diameters as small as 50 micrometers with multi-turn spiral geometry. These microscopic planar coils are often mounted on atomic force microscopy (AFM) or scanning tunneling microscopy (STM) cantilevers, allowing topographical height feedback that maintains a constant 10-nanometer gap above the active silicon channels without mechanical contact damage."
    ]

    p3_add = [
        "In complex System-on-Chip (SoC) architectures containing multiple heterogeneous processing cores, spatial cartography is frequently augmented with time-resolved 3D scanning (x, y, t). In a 3D spatiotemporal scan, the evaluator records the complete time-series waveform at each spatial coordinate, creating a volumetric data cube. By slicing through this data cube at specific temporal clock cycles (e.g., at t = 2.4 microseconds during the SubBytes phase), the evaluator watches the physical propagation of cryptographic data across the silicon die in animated 2D false-color video, revealing the exact path from register files to the ALU."
    ]

    p4_add = [
        "Furthermore, modern software-defined radio (SDR) platforms—such as the USRP X310 or HackRF One—are increasingly utilized to automate electromagnetic side-channel demodulation. By tuning the SDR's direct-conversion RF mixer directly to the microcontroller's 3rd or 5th clock harmonic and streaming digitized in-phase and quadrature (I/Q) baseband samples over 10 Gigabit Ethernet to a host workstation, the entire analog demodulation pipeline is implemented in pure software. This software-defined approach allows real-time adaptive filtering, dynamic carrier tracking, and polyphase channelization across multiple harmonic carriers simultaneously."
    ]

    p5_add = [
        "At the board-level design stage, IoT hardware engineers implement electromagnetic compatibility (EMC) ground stitching and buried stripline routing for all sensitive high-speed cryptographic buses. By sandwiching data buses between continuous solid copper ground planes on internal PCB layers (Layers 2 and 4 of a 6-layer board) and placing closely spaced ground vias (via stitching pitch < lambda / 20) along the trace perimeter, radiated emissions are trapped within the dielectric substrate and attenuated by more than 50 dB before reaching external air."
    ]

    d['parts'][1]['say'].extend(p2_add)
    d['parts'][2]['say'].extend(p3_add)
    d['parts'][3]['say'].extend(p4_add)
    d['parts'][4]['say'].extend(p5_add)

    with open('scripts/iot_sec_day39.json', 'w', encoding='utf-8') as f:
        json.dump(d, f, indent=2, ensure_ascii=False)

    print("Successfully boosted Day 39!")

if __name__ == '__main__':
    boost_day39()
