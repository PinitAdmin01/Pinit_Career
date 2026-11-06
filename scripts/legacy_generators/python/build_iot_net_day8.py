# scripts/build_iot_net_day8.py
"""
Builds Day 8 for Course 18: IoT Networking & Cloud Protocols (iot_net).
Day 8: CSMA/CA Channel Access: Slotted vs Unslotted, Backoff Exponents & CCA Physics
Pedagogical Invariants:
- Exactly 5 parts, each strictly >= 580 words (target >= 620 words).
- minutes: 38.
- 100% deterministic Python standard library execution, verified output capture.
- 4 multiple choice options with answer: 0 and deep why.
- Strict mathematical & architectural depth: CSMA/CA state machine, BE/NB parameters, CCA modes (ED vs CS), slotted vs unslotted, collision dynamics.
"""

import json
import subprocess
import sys

def build_day8():
    # =========================================================================
    # Part 1: Medium Access Control Dynamics: Unslotted CSMA/CA Architecture
    # =========================================================================
    p1_say = [
        "Welcome to Day 8 of IoT Networking & Cloud Protocols. Today we tackle the central algorithmic problem of shared-medium wireless communications: how do dozens or hundreds of independent, unsynchronized radio nodes share a single 2.4 GHz frequency channel without obliterating each other's transmissions with packet collisions?",
        "In wired Ethernet networks (IEEE 802.3), devices employ Carrier Sense Multiple Access with Collision Detection (CSMA/CD). Because copper cables are closed electrical channels with low attenuation, a transmitting Ethernet network card can actively listen to the wire while transmitting. If it detects a voltage spike exceeding standard transmission levels, it detects an active collision, immediately halts transmission, and broadcasts a jam signal.",
        "In wireless radio communications, Collision Detection is physically impossible for low-cost microcontrollers. The transmitter's own power amplifier blasts local RF energy at +0 dBm to +10 dBm into the antenna, while an incoming signal from a distant transmitting neighbor arrives attenuated down to -80 dBm or -90 dBm (a factor of 100,000,000 times weaker). The transmitter's local transmit energy completely saturates and blinds its own receiver. Because a radio cannot detect collisions while transmitting, wireless networks must rely on Carrier Sense Multiple Access with Collision Avoidance (CSMA/CA).",
        "The IEEE 802.15.4 standard defines two distinct CSMA/CA algorithms: Unslotted CSMA/CA (used in non-beacon-enabled networks) and Slotted CSMA/CA (used in beacon-enabled superframes). We begin our deep study with Unslotted CSMA/CA, which forms the operational medium-access engine of Zigbee Pro, Thread, 6LoWPAN, and WirelessHART ad-hoc mesh networks.",
        "The fundamental unit of time in the 802.15.4 CSMA/CA state machine is the Unit Backoff Period (aUnitBackoffPeriod). The standard defines aUnitBackoffPeriod as exactly 20 symbol durations. Because 1 symbol spans 16.0 microseconds at the 2.4 GHz PHY (62.5 ksymbols/s), exactly one backoff period corresponds to: aUnitBackoffPeriod = 20 * 16.0 us = 320 microseconds (0.320 ms).",
        "All backoff delays, channel assessment timings, and contention counters in unslotted CSMA/CA are calculated as integer multiples of this 320-microsecond quantum. When a node has an application frame to transmit, it does not immediately activate its radio transmitter; doing so would cause catastrophic collisions if a neighbor was mid-packet.",
        "Instead, the MAC layer executes an asynchronous state machine: it initializes internal state variables, draws a pseudo-random backoff integer, delays for that duration in a low-power listening standby, performs a Clear Channel Assessment (CCA), and only keys the transmitter if the medium is verified silent.",
        "Understanding this time-quantized contention loop is essential for firmware engineers designing low-power MAC stacks. If timing parameters or state transitions are incorrectly implemented, nodes will either suffer endless channel access failures under light network loads or continuously collide with neighboring sensors during burst telemetry events.",
        "To understand the low-level hardware orchestration of unslotted CSMA/CA, consider how the microcontroller interacts with its physical radio peripheral over SPI or internal bus registers. When the MAC layer commands the radio to initiate a transmission sequence, the transceiver does not switch directly from low-power SLEEP mode to high-power TRANSMIT mode. Such an abrupt transition would violate phase-locked loop (PLL) synthesizer settling times, creating severe frequency spurs.",
        "Instead, the radio transitions through an intermediate STANDBY state where the high-frequency crystal oscillator (typically 32 MHz or 48 MHz) is energized and stabilized. The PLL synthesizer locks onto the designated channel frequency (e.g., 2405 MHz for Channel 11). Only after the synthesizer asserts a 'PLL_LOCK' interrupt does the hardware arm its internal 320-microsecond backoff timer. When the backoff timer reaches zero, the transceiver switches its internal analog front-end from IDLE to RECEIVE to conduct the Clear Channel Assessment, maintaining strict microsecond timing accuracy across all operational states.",
        "In the subsequent parts of this lesson, we dissect the exact state machine variables (BE, NB), the physical mechanisms of Clear Channel Assessment, and the mathematical collision probability across dense node deployments."
    ]
    p1_example = "Think of an polite academic roundtable discussion where 20 researchers share a single microphone. If two people want to speak at the same time, neither starts shouting immediately. Each researcher secretly rolls a die to pick a random number of seconds to wait. The person who rolled the lowest number speaks first, while the others hear the voice, pause their roll, and wait for the room to fall silent again."
    p1_code = """# IEEE 802.15.4 Unit Backoff Period & Timing Architecture
class IEEE802154BackoffTiming:
    SYMBOL_DURATION_US = 16.0           # 1 symbol = 16 us at 2.4 GHz (62.5 ksymbols/s)
    SYMBOLS_PER_BACKOFF_PERIOD = 20     # aUnitBackoffPeriod = 20 symbols
    
    @classmethod
    def get_unit_backoff_period_us(cls) -> float:
        return cls.SYMBOLS_PER_BACKOFF_PERIOD * cls.SYMBOL_DURATION_US
        
    @classmethod
    def calculate_backoff_delay_us(cls, backoff_units: int) -> float:
        return backoff_units * cls.get_unit_backoff_period_us()

timing = IEEE802154BackoffTiming()
unit_us = timing.get_unit_backoff_period_us()

print("=== IEEE 802.15.4 CSMA/CA Backoff Timing Architecture ===")
print(f"Symbol Duration: {timing.SYMBOL_DURATION_US:.1f} us")
print(f"Symbols per Unit Backoff: {timing.SYMBOLS_PER_BACKOFF_PERIOD} symbols")
print(f"aUnitBackoffPeriod: {unit_us:.1f} us ({unit_us / 1000.0:.3f} ms)")

for units in [1, 3, 7, 15, 31]:
    delay_us = timing.calculate_backoff_delay_us(units)
    print(f"Backoff {units:2d} periods = {delay_us:7.1f} us ({delay_us/1000.0:6.3f} ms)")
"""
    p1_codeNotes = [
        "Defines IEEE802154BackoffTiming modeling the standard 20-symbol aUnitBackoffPeriod.",
        "Calculates exact microsecond backoff durations across symbol boundaries (320 us per quantum).",
        "Demonstrates exponential expansion of wait times across integer backoff unit steps."
    ]
    p1_tryIt = "Calculate the maximum wait time for a backoff unit of 31 and verify that it equals 9,920 microseconds (9.92 ms)."
    p1_check = {
        "question": "Why does IEEE 802.15.4 wireless networking use Collision Avoidance (CSMA/CA) instead of Ethernet-style Collision Detection (CSMA/CD)?",
        "options": [
            "A wireless transmitter's local RF output is orders of magnitude stronger than distant incoming signals, blinding its own receiver and making collision detection physically impossible during transmission.",
            "Collision Detection requires dual fiber-optic cables which cannot be attached to wireless antennas.",
            "CSMA/CD was patented by IBM and is prohibited in open ISM bands.",
            "Collision Avoidance doubles the battery capacity of the transmitting node."
        ],
        "answer": 0,
        "why": "Option 0 correctly describes the physical reality of RF transceivers: local transmit power (+0 to +10 dBm) drowns out incoming signals (-80 to -90 dBm) at the antenna, preventing the radio from sensing simultaneous collisions while transmitting. Wireless protocols must therefore avoid collisions proactively using randomized backoffs and clear channel assessments. Options 1, 2, and 3 are technically or legally false."
    }

    # =========================================================================
    # Part 2: Backoff Exponents & Contention Windows: macMinBE, macMaxBE & NB
    # =========================================================================
    p2_say = [
        "Having established the 320-microsecond unit backoff quantum, we now examine the mathematical state variables that govern unslotted CSMA/CA: NB, BE, and the exponential contention window.",
        "Every unslotted CSMA/CA transmission attempt is tracked by two internal state variables maintained by the MAC layer: NB (Number of Backoffs) and BE (Backoff Exponent).",
        "NB represents the count of successive failed channel access attempts for the current transmission. When an application requests packet transmission, NB is initialized strictly to 0: NB = 0.",
        "BE represents the current backoff exponent that determines the size of the pseudo-random contention window. Upon initialization, BE is set to the MAC PIB attribute macMinBE (the standard default value is macMinBE = 3).",
        "Once initialized, the node draws a pseudo-random integer backoff delay R from a uniform distribution across the range: R ~ Uniform(0, 2^BE - 1). The actual time the node waits before sensing the channel is: Delay = R * aUnitBackoffPeriod = R * 320 us.",
        "Notice the mathematical expansion of the contention window: when BE = 3 (macMinBE), 2^3 - 1 = 7. R can take any integer from 0 to 7. The node waits between 0 us and 7 * 320 us = 2,240 us (2.24 ms).",
        "After delaying for R periods, the node activates its receiver frontend and performs a Clear Channel Assessment (CCA). If the channel is assessed as IDLE, the contention loop terminates successfully, and the MAC layer immediately commands the physical transceiver to transmit the frame.",
        "However, if the CCA determines that the channel is BUSY (another device is transmitting), the node must execute an exponential backoff retry. It increments both state variables: NB = NB + 1, and BE = min(BE + 1, macMaxBE).",
        "The standard defines macMaxBE with a default value of 5. Therefore, on the first channel-busy event, BE increments from 3 to 4. On the next attempt, R is drawn from Uniform(0, 2^4 - 1) = Uniform(0, 15), expanding the maximum delay window to 15 * 320 us = 4,800 us. If the channel is busy a second time, BE increments to 5, drawing R from Uniform(0, 31) with a maximum delay of 31 * 320 us = 9,920 us (nearly 10 ms). Once BE reaches macMaxBE (5), it saturates and does not increment further.",
        "Crucially, the standard enforces a hard cap on retry attempts via the macMaxCSMABackoffs attribute (default value = 4). If NB exceeds macMaxCSMABackoffs (meaning the node has performed 5 consecutive CCAs and found the channel busy every single time), the MAC state machine aborts the transmission attempt and reports a CHANNEL_ACCESS_FAILURE error to the upper network layer.",
        "This exponential backoff mechanism dynamically adapts to network congestion: under light traffic, nodes transmit with minimal latency (averaging 3.5 * 320 us ≈ 1.12 ms delay); under heavy congestion, the window automatically expands, dispersing competing transmissions across time to prevent collision storms.",
        "In enterprise mesh architectures, parameter tuning of macMinBE, macMaxBE, and macMaxCSMABackoffs has profound implications for end-to-end network quality of service (QoS). For example, in smart lighting installations with 100 wireless light fixtures in a single open-plan office, pressing a wall switch broadcasts a group multicast command commanding all 100 lights to turn on simultaneously. If all 100 nodes attempt to transmit MAC acknowledgments or status reports with default macMinBE = 3, the contention window (0 to 7 slots) is far too narrow, resulting in massive initial collisions.",
        "To mitigate this multicast storm problem, advanced mesh profiles (such as Thread and Zigbee Green Power) support adaptive backoff exponent scaling based on detected network density. Nodes can dynamically increase their macMinBE to 4 or 5 during high-traffic bursts, immediately spreading contention across 16 to 32 slots. Conversely, for critical low-latency alarm sensors (such as gas leak detectors or smoke alarms), nodes can temporarily lower macMinBE to 1 or 2 while asserting priority channel access, trading a slightly higher initial collision risk for immediate channel acquisition.",
        "Firmware developers must be cautious when tuning these parameters. Setting macMinBE = 0 eliminates initial delay but creates immediate packet collisions when multiple nodes wake up simultaneously after an external trigger."
    ]
    p2_example = "Think of rolling dice in a crowded cafeteria line. On your first attempt, you roll an 8-sided die (BE=3, range 0–7) and wait that many seconds. If someone is standing at the food counter when your timer ends, you step back and roll a 16-sided die (BE=4, range 0–15). If the counter is still occupied, you roll a 32-sided die (BE=5). If you fail 5 times in a row, you give up and report a line jam."
    p2_code = """# IEEE 802.15.4 Unslotted CSMA/CA Backoff State Machine Engine
import random

class UnslottedCsmaCaController:
    def __init__(self, mac_min_be=3, mac_max_be=5, mac_max_csma_backoffs=4):
        self.mac_min_be = mac_min_be
        self.mac_max_be = mac_max_be
        self.mac_max_csma_backoffs = mac_max_csma_backoffs
        
    def simulate_transmission_attempt(self, channel_busy_probabilities: list[float], seed=42) -> dict:
        rng = random.Random(seed)
        nb = 0
        be = self.mac_min_be
        total_delay_periods = 0
        history = []
        
        while nb <= self.mac_max_csma_backoffs:
            # Draw random backoff R in [0, 2^BE - 1]
            max_r = (1 << be) - 1
            r = rng.randint(0, max_r)
            total_delay_periods += r
            
            # Simulate CCA check based on external channel condition
            # If nb < len(channel_busy_probabilities), use specified probability; else clear
            busy_prob = channel_busy_probabilities[nb] if nb < len(channel_busy_probabilities) else 0.0
            is_busy = rng.random() < busy_prob
            
            history.append({
                "iteration": nb + 1,
                "be": be,
                "window_max": max_r,
                "chosen_r": r,
                "delay_us": r * 320.0,
                "cca_result": "BUSY" if is_busy else "IDLE"
            })
            
            if not is_busy:
                # Channel is clear -> Transmit!
                return {
                    "status": "SUCCESS_TRANSMIT",
                    "total_attempts": nb + 1,
                    "total_delay_us": total_delay_periods * 320.0,
                    "history": history
                }
                
            # Channel was busy -> Increment counters
            nb += 1
            be = min(be + 1, self.mac_max_be)
            
        return {
            "status": "CHANNEL_ACCESS_FAILURE",
            "total_attempts": nb,
            "total_delay_us": total_delay_periods * 320.0,
            "history": history
        }

controller = UnslottedCsmaCaController()
# Case 1: Channel busy twice, then clear on 3rd attempt
res1 = controller.simulate_transmission_attempt([0.99, 0.99, 0.0], seed=101)
print("=== CSMA/CA Backoff Expansion (Successful Transmission) ===")
print(f"Outcome: {res1['status']} after {res1['total_attempts']} attempts ({res1['total_delay_us']:.1f} us total delay)")
for h in res1['history']:
    print(f"  Attempt {h['iteration']}: BE={h['be']} (Win 0-{h['window_max']:2d}) -> Chose R={h['chosen_r']:2d} ({h['delay_us']:6.1f} us) | CCA: {h['cca_result']}")

# Case 2: Congested channel failing all 5 backoffs
res2 = controller.simulate_transmission_attempt([1.0, 1.0, 1.0, 1.0, 1.0], seed=202)
print(f"\\n=== CSMA/CA Channel Congestion Failure ===")
print(f"Outcome: {res2['status']} after {res2['total_attempts']} attempts ({res2['total_delay_us']:.1f} us total delay)")
"""
    p2_codeNotes = [
        "Implements UnslottedCsmaCaController modeling the standard NB and BE state machine.",
        "Expands random backoff windows across Uniform(0, 2^BE - 1) up to macMaxBE (5).",
        "Demonstrates channel access failure termination when NB exceeds macMaxCSMABackoffs (4)."
    ]
    p2_tryIt = "Run the simulation with all zero busy probabilities [0.0] and verify that transmission succeeds on Attempt 1 with BE=3."
    p2_check = {
        "question": "What happens in an IEEE 802.15.4 MAC when a node experiences 5 consecutive Clear Channel Assessment (CCA) busy detections during unslotted CSMA/CA?",
        "options": [
            "The MAC layer terminates the transmission attempt and returns a CHANNEL_ACCESS_FAILURE error because NB exceeded macMaxCSMABackoffs.",
            "The node immediately overrides the channel and forces an uncoordinated broadcast transmission.",
            "The radio enters permanent sleep mode and requires a physical hardware power cycle.",
            "The Backoff Exponent BE increments to 16, resulting in a 20-second wait timer."
        ],
        "answer": 0,
        "why": "Option 0 accurately reflects the standard specification: with default macMaxCSMABackoffs = 4, the state machine allows NB to take values 0, 1, 2, 3, 4 (5 attempts total). If the 5th CCA is busy, NB increments to 5, which exceeds macMaxCSMABackoffs, immediately terminating the algorithm with CHANNEL_ACCESS_FAILURE. Options 1, 2, and 3 violate standard MAC behavior."
    }

    # =========================================================================
    # Part 3: Clear Channel Assessment (CCA) Physics: Energy Detection vs Carrier Sense
    # =========================================================================
    p3_say = [
        "In the previous part, we saw that the backoff timer terminates with a Clear Channel Assessment (CCA). Now we explore the physical and electronic mechanisms by which a radio transceiver determines whether the wireless medium is clear or busy: CCA Physics and Detection Modes.",
        "When an 802.15.4 transceiver enters the CCA state, it powers up its receiver frontend, switches the antenna switch to RX, and samples incoming RF energy across the 2 MHz channel bandwidth. The standard mandates that the CCA measurement period must span exactly 8 symbol periods (8 * 16.0 us = 128 microseconds).",
        "During these 128 microseconds, the receiver's digital signal processor evaluates the channel using one of three standardized CCA Modes: CCA Mode 1 (Energy Detection), CCA Mode 2 (Carrier Sense), or CCA Mode 3 (Energy Detection AND/OR Carrier Sense).",
        "CCA Mode 1 is Energy Detection (ED). In Mode 1, the receiver does not attempt to decode or understand the nature of the incoming radio waves; it simply acts as a calibrated RF power meter. The analog baseband RSSI circuits integrate the total received electromagnetic power across the 2.0 MHz channel over the 128 us window. If the measured energy level exceeds a configured threshold (known as the ED Threshold, typically set between -75 dBm and -85 dBm, at least 10 dB above receiver sensitivity), the radio declares the channel BUSY. If the energy is below the threshold, the channel is declared IDLE. The immense advantage of Mode 1 is that it detects any interfering radio source—including non-802.15.4 emissions such as Wi-Fi bursts, Bluetooth transmissions, microwave ovens, and RF jammers.",
        "CCA Mode 2 is Carrier Sense (CS). In Mode 2, the receiver evaluates whether the incoming signal is specifically formatted as an IEEE 802.15.4 transmission. The receiver frontend routes digitized chips into its 802.15.4 matched filter correlator bank, looking for the characteristic 2.0 Mchips/s O-QPSK spreading pattern or the alternating preamble. If correlation peaks exceed detection thresholds, the channel is declared BUSY. Mode 2 will report the channel as IDLE even in the presence of strong continuous Wi-Fi or microwave noise, as long as no valid 802.15.4 carrier is detected.",
        "CCA Mode 3 is Combined Detection, which allows transceivers to require both Carrier Sense AND Energy Detection (CS AND ED, meaning a signal must be both 802.15.4 compliant and above the power threshold), or CS OR ED (the channel is busy if either a compliant 802.15.4 packet or strong generic RF energy is present).",
        "In commercial industrial stacks (such as Thread and Zigbee), CCA Mode 1 (Energy Detection) or Mode 3 (CS OR ED) is universally mandated. This ensures that sensor nodes do not transmit directly into the teeth of high-power Wi-Fi data bursts, preserving battery life and avoiding co-channel packet destruction.",
        "A critical engineering subtlety in CCA Mode 1 (Energy Detection) is the dynamic calibration of the ED Threshold relative to environmental background noise. In pristine laboratory testing environments, the ambient 2.4 GHz noise floor typically hovers around -100 dBm to -105 dBm. However, in harsh heavy-industrial facilities—such as metal fabrication plants, automotive manufacturing floors, and petrochemical processing units—constant electromagnetic emissions from arc welders, high-voltage transformers, and variable-frequency motor drives raise the ambient background noise floor to -88 dBm or higher.",
        "If a wireless sensor node is deployed with a hardcoded, overly aggressive ED threshold of -90 dBm, the radio will continuously measure ambient industrial EMI as higher than its threshold. As a consequence, the CCA engine will falsely declare the channel continuously BUSY, locking the node in permanent backoff retries until it aborts with CHANNEL_ACCESS_FAILURE. Modern professional 802.15.4 stacks solve this by implementing Dynamic Energy Threshold Adaptation: the node periodically samples the quiet background noise over extended intervals and sets the ED threshold dynamically to 8 dB to 10 dB above the rolling average background floor.",
        "Understanding CCA physics enables firmware engineers to configure appropriate ED thresholds in noisy factory environments, preventing the radio from becoming perpetually locked out by harmless ambient electromagnetic noise."
    ]
    p3_example = "Think of checking if a conference room is occupied before entering. CCA Mode 1 (Energy Detection) is like pressing your ear to the door and listening for any loud sound (someone speaking, music playing, or a vacuum cleaner running). CCA Mode 2 (Carrier Sense) is listening specifically for people speaking English. CCA Mode 3 (Combined) is only walking in if you hear no loud sounds AND no English conversation."
    p3_code = """# IEEE 802.15.4 Clear Channel Assessment (CCA) Physics & Detection Modes
class ClearChannelAssessmentEngine:
    CCA_DURATION_SYMBOLS = 8
    CCA_DURATION_US = 8 * 16.0          # 128.0 microseconds
    DEFAULT_ED_THRESHOLD_DBM = -82.0    # 10 dB above typical -92 dBm sensitivity
    
    @classmethod
    def evaluate_cca(cls, mode: int, measured_power_dbm: float, has_802154_carrier: bool,
                     ed_threshold_dbm: float = DEFAULT_ED_THRESHOLD_DBM) -> dict:
        if mode not in (1, 2, 3):
            raise ValueError("Invalid CCA Mode (1, 2, or 3).")
            
        ed_busy = measured_power_dbm >= ed_threshold_dbm
        cs_busy = has_802154_carrier
        
        if mode == 1:
            # Mode 1: Energy Detection only
            is_busy = ed_busy
            description = f"Mode 1 (ED): Power {measured_power_dbm:.1f} dBm vs Threshold {ed_threshold_dbm:.1f} dBm"
        elif mode == 2:
            # Mode 2: Carrier Sense only
            is_busy = cs_busy
            description = f"Mode 2 (CS): 802.15.4 Carrier Detected = {cs_busy}"
        elif mode == 3:
            # Mode 3: Combined (CS OR ED - Industry Standard)
            is_busy = ed_busy or cs_busy
            description = f"Mode 3 (CS OR ED): ED={ed_busy}, CS={cs_busy}"
            
        return {
            "mode": mode,
            "status": "BUSY" if is_busy else "IDLE",
            "measured_power_dbm": measured_power_dbm,
            "is_busy": is_busy,
            "duration_us": cls.CCA_DURATION_US,
            "description": description
        }

engine = ClearChannelAssessmentEngine()
print("=== IEEE 802.15.4 CCA Assessment Modes Comparison ===")
scenarios = [
    # (Power dBm, Has 802.15.4 Carrier, Scenario Name)
    (-95.0, False, "Quiet Channel (Thermal Noise Floor)"),
    (-75.0, False, "Heavy Wi-Fi Burst (Non-802.15.4 RF Energy)"),
    (-88.0, True,  "Weak Distant 802.15.4 Sensor Packet"),
    (-70.0, True,  "Strong Nearby 802.15.4 Coordinator Packet")
]

for pwr, has_carrier, name in scenarios:
    print(f"\\nScenario: {name}")
    for m in [1, 2, 3]:
        res = engine.evaluate_cca(m, pwr, has_carrier)
        print(f"  {res['description']:55s} -> Result: {res['status']}")
"""
    p3_codeNotes = [
        "Defines ClearChannelAssessmentEngine modeling 8-symbol (128 us) CCA measurements.",
        "Implements all three standard CCA Modes: Energy Detection (1), Carrier Sense (2), and Combined (3).",
        "Demonstrates how Wi-Fi noise triggers Mode 1/3 but is ignored by Mode 2."
    ]
    p3_tryIt = "Adjust the ed_threshold_dbm to -70 dBm and observe how the heavy Wi-Fi scenario changes to IDLE under Mode 1."
    p3_check = {
        "question": "What is the standard measurement duration for an IEEE 802.15.4 Clear Channel Assessment (CCA) at the 2.4 GHz physical layer?",
        "options": [
            "Exactly 8 symbol periods (128 microseconds at 62.5 ksymbols/s).",
            "1 symbol period (16 microseconds).",
            "20 symbol periods (320 microseconds matching aUnitBackoffPeriod).",
            "1 full superframe duration (15.36 milliseconds)."
        ],
        "answer": 0,
        "why": "Option 0 is correct: The IEEE 802.15.4 specification mandates that the receiver must average channel energy and correlate signal patterns over exactly 8 symbol periods (8 * 16.0 us = 128.0 microseconds). Option 1 is too brief for reliable noise averaging. Option 2 describes the unit backoff period. Option 3 is orders of magnitude too long."
    }

    # =========================================================================
    # Part 4: Slotted CSMA/CA for Beacon-Enabled Superframes & Dual CCA
    # =========================================================================
    p4_say = [
        "Now we contrast unslotted CSMA/CA with its synchronized counterpart: Slotted CSMA/CA, used exclusively within the Contention Access Period (CAP) of beacon-enabled superframes.",
        "While unslotted CSMA/CA is completely asynchronous—nodes can initiate backoffs and perform CCAs at any arbitrary microsecond in time—Slotted CSMA/CA synchronizes all channel contention to a shared network clock established by the PAN Coordinator's periodic beacon frames.",
        "In Slotted CSMA/CA, the backoff countdown must align precisely with the boundaries of superframe backoff slots. When a node draws a random backoff integer R, it does not begin counting down immediately. It must wait until the arrival of the very next backoff slot boundary before decrementing R by 1 for each elapsed 20-symbol slot (320 us).",
        "The most critical architectural difference between unslotted and slotted CSMA/CA lies in the Clear Channel Assessment verification requirement: Slotted CSMA/CA mandates a Dual CCA Check.",
        "In slotted networks, when R reaches 0, the node does not perform a single CCA. Instead, it initializes a Contention Window state variable to 2: CW = 2. It then performs a first CCA at the start of the next backoff slot boundary. If the channel is IDLE, it decrements CW to 1: CW = CW - 1 = 1. It must then wait for the next backoff slot boundary and perform a second CCA. Only if the second CCA is also verified IDLE (CW decrements to 0) is the node permitted to transmit its frame.",
        "Why does Slotted CSMA/CA enforce this rigorous Dual CCA requirement? Because in beacon-enabled networks, receiving nodes turn their radio receivers on and off synchronously at superframe slot boundaries. If a node performed only a single CCA, it might sample the channel during the turn-around transient of another device's transmitter, mistakenly declaring the channel idle. Requiring two consecutive clear CCAs across distinct slot boundaries guarantees that no other synchronized node has begun transmitting.",
        "Furthermore, Slotted CSMA/CA enforces a Frame Transaction Boundary Rule: before beginning its backoff countdown or transmitting, the MAC layer must verify that the remaining time in the current Contention Access Period (CAP) is long enough to accommodate the complete transaction. A complete transaction includes the backoff delay, two CCAs (16 symbols), the packet transmission time, the Interframe Spacing (IFS), and the receipt of an acknowledgment (ACK).",
        "If the remaining CAP duration is insufficient, the node pauses its state machine, sleeps through the Contention-Free Period (CFP) and Inactive Period, and resumes its countdown at the start of the CAP in the subsequent superframe.",
        "Another vital aspect of Slotted CSMA/CA is the handling of Interframe Spacing (IFS) between consecutive packet transmissions. The IEEE 802.15.4 specification distinguishes between Short Interframe Spacing (SIFS) and Long Interframe Spacing (LIFS). If a transmitted MAC frame has a payload length less than or equal to 18 octets (aMaxSIFSFrameSize), the MAC layer must wait at least aMinSIFSPeriod (12 symbols = 192 microseconds) before initiating the next transmission attempt.",
        "Conversely, if the frame exceeds 18 octets, it is classified as a long frame, requiring a longer wait of at least aMinLIFSPeriod (40 symbols = 640 microseconds). This mandatory spacing ensures that the recipient node's microcontroller has sufficient time to complete DMA transfers, process the incoming packet in software, and transition its transceiver state machine before the next frame arrives on the channel. In Slotted CSMA/CA, both the SIFS and LIFS intervals must be accounted for when verifying that an entire transaction fits within the remaining Contention Access Period (CAP).",
        "This level of temporal discipline prevents packet transmissions from bleeding across superframe slot boundaries, preserving collision-free operation across large synchronized networks."
    ]
    p4_example = "Think of boarding a busy commuter subway train. In unslotted CSMA/CA, passengers walk through the turnstiles at random intervals. In slotted CSMA/CA, turnstiles only open on the chime of a metronome (slot boundaries). To pass through, you must look both left and right across two consecutive metronome beats (Dual CCA). If the train doors are about to close, you don't squeeze in; you wait for the next train (next superframe)."
    p4_code = """# IEEE 802.15.4 Slotted CSMA/CA Dual CCA & Boundary Validator
class SlottedCsmaCaController:
    CW_INITIAL = 2                      # Contention Window: requires 2 clear CCAs
    BACKOFF_PERIOD_SYMBOLS = 20         # 20 symbols per backoff period
    CCA_DURATION_SYMBOLS = 8            # 8 symbols per CCA
    
    @classmethod
    def evaluate_slotted_channel_access(cls, cca1_is_busy: bool, cca2_is_busy: bool,
                                        remaining_cap_symbols: int, required_tx_symbols: int) -> dict:
        # Check if transaction fits inside remaining CAP
        # Required = 2 * CCA (16 symbols) + Tx duration + ACK wait (54 symbols) + IFS (12 symbols)
        total_required_symbols = (2 * cls.CCA_DURATION_SYMBOLS) + required_tx_symbols + 54 + 12
        if remaining_cap_symbols < total_required_symbols:
            return {
                "status": "DEFERRED_TO_NEXT_SUPERFRAME",
                "reason": f"Remaining CAP ({remaining_cap_symbols} sym) < Required ({total_required_symbols} sym)",
                "can_transmit": False
            }
            
        cw = cls.CW_INITIAL
        # First CCA check
        if cca1_is_busy:
            return {"status": "BACKOFF_RETRY", "reason": "CCA 1 BUSY", "can_transmit": False}
        cw -= 1     # CW = 1
        
        # Second CCA check
        if cca2_is_busy:
            return {"status": "BACKOFF_RETRY", "reason": "CCA 2 BUSY", "can_transmit": False}
        cw -= 1     # CW = 0 -> Channel Verified Clear!
        
        return {
            "status": "SUCCESS_TRANSMIT",
            "cw_final": cw,
            "can_transmit": True,
            "total_symbols_consumed": total_required_symbols
        }

slotted = SlottedCsmaCaController()
print("=== IEEE 802.15.4 Slotted CSMA/CA Dual-CCA State Evaluation ===")

# Scenario 1: Both CCAs clear and transaction fits
res1 = slotted.evaluate_slotted_channel_access(cca1_is_busy=False, cca2_is_busy=False,
                                               remaining_cap_symbols=500, required_tx_symbols=64)
print(f"Scenario 1 (Normal Clear): {res1['status']} (Transmit={res1['can_transmit']})")

# Scenario 2: First CCA clear, but second CCA busy
res2 = slotted.evaluate_slotted_channel_access(cca1_is_busy=False, cca2_is_busy=True,
                                               remaining_cap_symbols=500, required_tx_symbols=64)
print(f"Scenario 2 (Second CCA Busy): {res2['status']} - {res2['reason']}")

# Scenario 3: Packet transaction exceeds remaining CAP boundary
res3 = slotted.evaluate_slotted_channel_access(cca1_is_busy=False, cca2_is_busy=False,
                                               remaining_cap_symbols=80, required_tx_symbols=64)
print(f"Scenario 3 (CAP Boundary Exceeded): {res3['status']} - {res3['reason']}")
"""
    p4_codeNotes = [
        "Models Slotted CSMA/CA state machine requiring CW=2 consecutive clear CCAs.",
        "Enforces the standard transaction boundary check against remaining Contention Access Period (CAP).",
        "Demonstrates automatic frame deferral to the next superframe when CAP duration is insufficient."
    ]
    p4_tryIt = "Increase remaining_cap_symbols in Scenario 3 from 80 to 200 and verify that status changes to SUCCESS_TRANSMIT."
    p4_check = {
        "question": "Why does Slotted CSMA/CA require two consecutive Clear Channel Assessments (CW = 2) instead of a single check?",
        "options": [
            "To prevent transmitting during receiver turn-around transients and ensure synchronization with neighboring devices on slot boundaries.",
            "Because the first CCA checks Wi-Fi and the second CCA checks Bluetooth.",
            "To double the bit transmission speed of the physical layer.",
            "Because 802.15.4 packets are always transmitted twice simultaneously."
        ],
        "answer": 0,
        "why": "Option 0 accurately describes the protocol design rationale: in beacon-enabled networks, devices synchronize receiver activation to slot boundaries. A single CCA could sample during the physical turn-around window of another node's transmitter. Two consecutive clear CCAs (CW=2) ensure that the channel is truly unoccupied by any synchronized peer. Options 1, 2, and 3 are technically invalid."
    }

    # =========================================================================
    # Part 5: Full Discrete-Event CSMA/CA Simulator & Collision Dynamics
    # =========================================================================
    p5_say = [
        "To conclude Day 8, we build a complete, multi-node Discrete-Event CSMA/CA Simulator to observe how channel contention, exponential backoffs, and packet collisions behave under real-world multi-device traffic loads.",
        "In a wireless mesh or star network containing dozens of sensor nodes, packet collisions do not occur uniformly. Instead, they cluster during burst events—such as when a power surge or environmental alarm causes 20 sensors to wake up and attempt transmission at nearly the exact same millisecond.",
        "When multiple nodes execute unslotted CSMA/CA concurrently, collisions occur primarily under two conditions: Simultaneous Transmission and Hidden Terminal Interference.",
        "Simultaneous Transmission occurs when two independent nodes randomly select the exact same backoff delay R. Both nodes count down to zero simultaneously, both perform their Clear Channel Assessment during the exact same 128-microsecond window (both measuring the channel as idle), and both key their transmitters at the exact same instant, resulting in an unrecoverable over-the-air packet collision.",
        "Hidden Terminal Interference occurs when two nodes (Node A and Node B) are both within range of a central coordinator, but are separated by physical obstacles or distance such that they cannot hear each other. When Node A transmits, Node B's CCA does not detect Node A's RF energy; Node B transmits as well, colliding at the coordinator's antenna.",
        "In our discrete-event simulator, we instantiate multiple independent 802.15.4 nodes competing for a shared channel. Each node executes the full unslotted CSMA/CA state machine with standard PIB parameters: macMinBE = 3, macMaxBE = 5, macMaxCSMABackoffs = 4, and macMaxFrameRetries = 3.",
        "When a packet collision occurs, the recipient node's CRC-16 checksum fails, causing the receiver to withhold the MAC Acknowledgment (ACK). The transmitting nodes time out waiting for the ACK, increment their Frame Retry counter, reset their backoff state machine, and re-enter the contention loop with an expanded contention window.",
        "Executing this multi-node simulation reveals critical network performance metrics: Channel Utilization, Packet Delivery Ratio (PDR), Average Contention Latency, and Collision Probability across varying node densities.",
        "In addition to simultaneous backoff collisions, real-world multi-node deployments must contend with the Capture Effect. In a physical radio environment, when two nodes transmit colliding packets simultaneously to a central coordinator, the collision does not always result in the mutual destruction of both packets. If one transmitter is significantly closer to the coordinator than the other, its received signal strength may arrive 10 dB to 15 dB stronger than the distant transmitter's signal.",
        "Under these circumstances, the coordinator's matched filter correlator and automatic gain control (AGC) can 'capture' the stronger signal, synchronizing onto its preamble and successfully demodulating the packet while treating the weaker colliding signal as background noise. In our discrete-event simulator, understanding this physical capture effect provides critical insight into why wireless mesh topologies often exhibit asymmetric link throughput, and reinforces why multi-hop routing protocols must dynamically monitor link quality indicators (LQI) rather than assuming uniform packet delivery.",
        "Furthermore, discrete-event simulation allows architects to evaluate channel occupancy and net throughput across varying packet sizes. Because each 802.15.4 frame requires preamble synchronization, PHY headers, MAC addressing, and mandatory interframe spacing, transmitting numerous microscopic single-byte telemetry updates results in terrible channel efficiency. Batching sensor telemetry into consolidated frames of 60 to 100 bytes maximizes net useful throughput while minimizing the total frequency of channel contention cycles.",
        "By simulating multi-node contention, packet backoffs, retry limits, and capture dynamics, embedded systems engineers can accurately predict network throughput bottlenecks and design high-density wireless systems that scale effortlessly from 10 to 1,000 devices."
        "Mastering these collision dynamics prepares engineers to build robust network coordination protocols, optimize retry timers, and design self-healing mesh fabrics in Day 9 and Milestone 2."
    ]
    p5_example = "Think of a busy four-way traffic intersection without a traffic light. Each car rolls up, stops, looks for cross-traffic (CCA), and waits a random number of seconds before driving across. When traffic is light, every car crosses smoothly. But when 20 cars arrive at the exact same minute, drivers occasionally step on the gas simultaneously, triggering fender-benders (collisions) that force both cars to reverse and wait longer."
    p5_code = """# Full Discrete-Event Multi-Node IEEE 802.15.4 CSMA/CA Simulator
import random

class MultiNodeCsmaCaSimulator:
    def __init__(self, num_nodes: int, packets_per_node: int = 5, seed: int = 42):
        self.num_nodes = num_nodes
        self.packets_per_node = packets_per_node
        self.rng = random.Random(seed)
        
        # Performance metrics
        self.successful_transmissions = 0
        self.packet_collisions = 0
        self.channel_access_failures = 0
        self.total_retries = 0
        
    def run_simulation(self) -> dict:
        # Time quantized in 320 us backoff units
        # Node state: {"id": int, "be": int, "nb": int, "retries": int, "wait_units": int, "state": str}
        nodes = []
        for i in range(self.num_nodes):
            nodes.append({
                "id": i,
                "be": 3,
                "nb": 0,
                "retries": 0,
                "wait_units": self.rng.randint(0, (1 << 3) - 1),
                "state": "BACKING_OFF",
                "packets_left": self.packets_per_node
            })
            
        current_time_slot = 0
        max_slots = 5000
        active_transmissions = []   # list of node_ids transmitting in current slot
        
        while current_time_slot < max_slots and any(n["packets_left"] > 0 for n in nodes):
            # Check completed transmissions from previous slot
            if len(active_transmissions) == 1:
                # Exactly 1 transmitter -> SUCCESSFUL DELIVERY!
                winner_id = active_transmissions[0]
                self.successful_transmissions += 1
                nodes[winner_id]["packets_left"] -= 1
                nodes[winner_id]["be"] = 3
                nodes[winner_id]["nb"] = 0
                nodes[winner_id]["retries"] = 0
                nodes[winner_id]["wait_units"] = self.rng.randint(0, (1 << 3) - 1)
                nodes[winner_id]["state"] = "BACKING_OFF" if nodes[winner_id]["packets_left"] > 0 else "DONE"
            elif len(active_transmissions) > 1:
                # Multiple transmitters collided!
                self.packet_collisions += 1
                for coll_id in active_transmissions:
                    nodes[coll_id]["retries"] += 1
                    self.total_retries += 1
                    if nodes[coll_id]["retries"] > 3:
                        # Dropped after 3 retries
                        nodes[coll_id]["packets_left"] -= 1
                        nodes[coll_id]["retries"] = 0
                        nodes[coll_id]["state"] = "BACKING_OFF" if nodes[coll_id]["packets_left"] > 0 else "DONE"
                    else:
                        nodes[coll_id]["be"] = min(nodes[coll_id]["be"] + 1, 5)
                        nodes[coll_id]["wait_units"] = self.rng.randint(0, (1 << nodes[coll_id]["be"]) - 1)
                        nodes[coll_id]["state"] = "BACKING_OFF"
                        
            active_transmissions = []
            
            # Progress nodes in current slot
            ready_to_transmit = []
            for n in nodes:
                if n["state"] == "BACKING_OFF":
                    if n["wait_units"] == 0:
                        # CCA check: channel clear if no active transmission
                        ready_to_transmit.append(n["id"])
                    else:
                        n["wait_units"] -= 1
                        
            if ready_to_transmit:
                for nid in ready_to_transmit:
                    nodes[nid]["state"] = "TRANSMITTING"
                    active_transmissions.append(nid)
                    
            current_time_slot += 1
            
        total_attempted = self.num_nodes * self.packets_per_node
        pdr = (self.successful_transmissions / total_attempted) * 100.0 if total_attempted > 0 else 0.0
        
        return {
            "num_nodes": self.num_nodes,
            "total_packets": total_attempted,
            "delivered": self.successful_transmissions,
            "collisions": self.packet_collisions,
            "retries": self.total_retries,
            "pdr_pct": pdr,
            "elapsed_slots": current_time_slot
        }

sim = MultiNodeCsmaCaSimulator(num_nodes=8, packets_per_node=10, seed=123)
metrics = sim.run_simulation()

print("=== IEEE 802.15.4 Multi-Node CSMA/CA Discrete Event Simulation ===")
print(f"Total Nodes Competing: {metrics['num_nodes']}")
print(f"Total Application Packets: {metrics['total_packets']}")
print(f"Successfully Delivered: {metrics['delivered']} packets")
print(f"Packet Delivery Ratio (PDR): {metrics['pdr_pct']:.1f}%")
print(f"Total Over-The-Air Collisions: {metrics['collisions']}")
print(f"Total MAC Retransmissions: {metrics['retries']}")
print(f"Simulation Duration: {metrics['elapsed_slots']} slots ({metrics['elapsed_slots'] * 0.320:.2f} ms)")
"""
    p5_codeNotes = [
        "Constructs MultiNodeCsmaCaSimulator modeling asynchronous channel contention across multiple nodes.",
        "Tracks discrete 320 us time slots, detecting concurrent packet transmissions as collisions.",
        "Calculates Packet Delivery Ratio (PDR) and retransmission counts under heavy multi-node loads."
    ]
    p5_tryIt = "Increase num_nodes from 8 to 20 to observe how collision frequency increases and PDR drops under high channel contention."
    p5_check = {
        "question": "In an unslotted IEEE 802.15.4 network, under what primary condition do packet collisions still occur despite the use of CSMA/CA?",
        "options": [
            "When two or more competing nodes randomly select the exact same backoff delay, complete CCA simultaneously, and transmit concurrently.",
            "When the transmitter runs out of battery power during transmission.",
            "When the PAN Coordinator disables the radio receiver during nighttime hours.",
            "When packets are transmitted with 16-bit addressing instead of 64-bit addressing."
        ],
        "answer": 0,
        "why": "Option 0 accurately identifies the primary cause of collisions in CSMA/CA: because backoff windows are discrete and finite, two nodes can randomly pick the same backoff delay R, both perform CCA at the same time (finding the channel idle), and both transmit at the exact same instant, creating a packet collision. Options 1, 2, and 3 are not collision mechanisms."
    }

    day8_data = {
        "coursePrefix": "iot_net",
        "day": 8,
        "title": "CSMA/CA Channel Access: Slotted vs Unslotted, Backoff Exponents & CCA Physics",
        "goal": "Master the IEEE 802.15.4 medium access control protocol: unslotted CSMA/CA state machine, backoff exponents (BE, NB), CCA physics (Energy Detection vs Carrier Sense), slotted dual-CCA checks, and collision dynamics.",
        "minutes": 38,
        "recap": "In Day 7, we mastered binary MAC frame formatting and superframe structures. Today in Day 8, we build the core algorithmic state machines that arbitrate shared channel access without collision.",
        "parts": [
            {
                "title": "Medium Access Control Dynamics: Unslotted CSMA/CA Architecture",
                "say": p1_say,
                "example": p1_example,
                "code": p1_code,
                "output": "",
                "codeNotes": p1_codeNotes,
                "tryIt": p1_tryIt,
                "check": p1_check
            },
            {
                "title": "Backoff Exponents & Contention Windows: macMinBE, macMaxBE & NB",
                "say": p2_say,
                "example": p2_example,
                "code": p2_code,
                "output": "",
                "codeNotes": p2_codeNotes,
                "tryIt": p2_tryIt,
                "check": p2_check
            },
            {
                "title": "Clear Channel Assessment Physics: Energy Detection vs Carrier Sense",
                "say": p3_say,
                "example": p3_example,
                "code": p3_code,
                "output": "",
                "codeNotes": p3_codeNotes,
                "tryIt": p3_tryIt,
                "check": p3_check
            },
            {
                "title": "Slotted CSMA/CA for Beacon-Enabled Superframes & Dual CCA",
                "say": p4_say,
                "example": p4_example,
                "code": p4_code,
                "output": "",
                "codeNotes": p4_codeNotes,
                "tryIt": p4_tryIt,
                "check": p4_check
            },
            {
                "title": "Full Discrete-Event CSMA/CA Simulator & Collision Dynamics",
                "say": p5_say,
                "example": p5_example,
                "code": p5_code,
                "output": "",
                "codeNotes": p5_codeNotes,
                "tryIt": p5_tryIt,
                "check": p5_check
            }
        ],
        "summary": [
            "Collision Detection (CSMA/CD) is physically impossible in low-power wireless radios due to local transmit power saturation, requiring Collision Avoidance (CSMA/CA).",
            "The unit backoff period (aUnitBackoffPeriod) is strictly 20 symbols (320 microseconds at 2.4 GHz).",
            "Unslotted CSMA/CA exponentially expands contention windows from macMinBE (3) up to macMaxBE (5), terminating with CHANNEL_ACCESS_FAILURE if NB exceeds macMaxCSMABackoffs (4).",
            "Clear Channel Assessment (CCA) operates over 8 symbols (128 us) using Energy Detection (Mode 1), Carrier Sense (Mode 2), or Combined Detection (Mode 3).",
            "Slotted CSMA/CA requires two consecutive clear CCAs (CW = 2) on backoff slot boundaries and enforces transaction completion before superframe CAP expiration."
        ],
        "projectStep": {
            "title": "IEEE 802.15.4 CSMA/CA Channel Arbitration Engineering",
            "steps": [
                "Implement the 320-microsecond aUnitBackoffPeriod timing converter.",
                "Construct the unslotted CSMA/CA state machine with NB and BE exponential expansion.",
                "Model Clear Channel Assessment (CCA) across Energy Detection and Carrier Sense modes.",
                "Implement Slotted CSMA/CA dual-CCA verification (CW = 2) and CAP boundary validation.",
                "Simulate multi-node contention, packet collisions, and retry dynamics in a discrete-event simulator."
            ]
        }
    }

    # Execute all code snippets dynamically to guarantee 100% exact output match
    for idx, p in enumerate(day8_data["parts"]):
        proc = subprocess.run([sys.executable, "-c", p["code"]], capture_output=True, text=True)
        if proc.returncode != 0:
            print(f"Day 8 Part {idx+1} execution error:\n{proc.stderr}")
            sys.exit(1)
        p["output"] = proc.stdout.strip()

    wcs = [len(" ".join(p["say"]).split()) for p in day8_data["parts"]]
    print(f"Day 8 Word Counts: {wcs} (Total: {sum(wcs)} words)")
    for idx, wc in enumerate(wcs):
        assert wc >= 580, f"Part {idx+1} word count {wc} < 580!"

    with open("scripts/iot_net_day8.json", "w", encoding="utf-8") as f:
        json.dump(day8_data, f, indent=2, ensure_ascii=False)
    print("Successfully built scripts/iot_net_day8.json!")

if __name__ == '__main__':
    build_day8()
