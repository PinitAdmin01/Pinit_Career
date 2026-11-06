#!/usr/bin/env python3
"""
build_iot_edge_day41.py
Course 18 Day 41: Ultra-Low-Power Wireless: BLE 5.4 Periodic Advertising & LE Audio Isochronous Channels
"""
import json

def get_day41():
    say_p1 = (
        "Welcome to Day 41 of Edge AI, DSP and TinyML Systems. As we transition from localized micro-acoustic "
        "inference and computer vision pipelines into networked edge intelligence, the wireless physical and link "
        "layer becomes our primary battery bottleneck. An inference engine consuming 1.8 milliwatts inside an ARM "
        "Cortex-M33 DSP core is completely wasted if a poorly designed 2.4 GHz radio transmission drains 25 milliamps "
        "continuously over a sluggish link. Today we deconstruct the Bluetooth Low Energy 5.4 core specification, "
        "focusing explicitly on Periodic Advertising with Response (PAwR) and Isochronous Channels (both Connected "
        "Isochronous Streams - CIS, and Broadcast Isochronous Streams - BIS). "
        "In legacy BLE 4.x and early 5.0 systems, a peripheral device intending to broadcast sensor telemetry or edge "
        "inference scores had two suboptimal choices: establish a formal bidirectional GATT connection, which requires "
        "continuous connection anchor point maintenance, heavy supervision timeouts, and high RAM overhead in the BLE "
        "controller stack; or transmit non-connectable undirected advertisements across the three primary advertising "
        "channels (37, 38, and 39). Primary advertising is uncoordinated, prone to severe radio frequency collisions "
        "in dense industrial factory floors, and forces scanning observers to keep their receivers energized at a 100% "
        "duty cycle to guarantee packet acquisition, burning through coin-cell batteries in a matter of days. "
        "BLE 5.0 introduced extended advertising, offloading large payloads onto the 37 secondary data channels. "
        "However, BLE 5.4 transforms this paradigm entirely through PAwR. Under PAwR, the central broadcaster divides "
        "periodic advertising trains into discrete sub-events and response slots. A fleet of thousands of edge sensor "
        "nodes no longer sleeps randomly or listens continuously. Instead, an edge node is assigned a specific sub-event "
        "and response slot. The node sleeps in ultra-low-power standby drawing less than 850 nanoamps, activates its "
        "high-frequency crystal oscillator (HFXO) exactly 300 microseconds prior to its scheduled sub-event, listens "
        "for a downlink packet containing updated model threshold parameters or an inference interrogation command, "
        "and immediately replies in its allocated uplink slot with its 4-byte quantized sensor inference score. "
        "This deterministic time-division access completely eliminates packet collisions and drops the average active "
        "radio duty cycle to below 0.05%, unlocking five to ten years of autonomous operation on a standard CR2032 battery. "
        "Simultaneously, for acoustic edge pipelines that need to stream compressed audio features or real-time wake-word "
        "snippets back to gateway nodes, LE Audio introduces Isochronous Channels. Using Isochronous Adaptation Layer "
        "(ISOAL), variable-length audio frames or MFCC feature vectors are segmented into deterministic isochronous "
        "protocol data units (PDUs) with guaranteed presentation timestamps and bounded transmission latency. Unlike "
        "asynchronous connection-oriented links (ACL) which retransmit indefinitely until TCP-like delivery, isochronous "
        "channels enforce a strict flush timeout (the Flush Timeout parameter, FT). If an acoustic packet is not "
        "successfully acknowledged before its presentation deadline expires, the radio buffer discards it rather than "
        "stalling the real-time DSP pipeline. "
        "To master low-power wireless edge architecture, you must understand the hardware physical layer: the radio "
        "state machine (STANDBY, RX, TX, INTER-FRAME SPACE - IFS of exactly 150 microseconds), DC-DC converter settling "
        "times, synthesizer ramp-up latencies, and how direct memory access (DMA) transfers packets directly between "
        "the radio peripheral FIFO and SRAM without waking the CPU pipeline. In this first part, we dissect the state "
        "machine and timing constraints of the BLE 5.4 radio, analyzing why legacy polling destroys power budgets and "
        "how deterministic time-slotted sub-events allow edge nodes to sleep for 99.95% of their operational life."
    )

    say_p2 = (
        "In Part 2, we dive straight into the protocol math and configuration mechanics of Periodic Advertising with "
        "Response (PAwR). Let us analyze the exact timing parameters specified in the Bluetooth Core Specification "
        "Version 5.4, Volume 6, Part B. A PAwR train is governed by four primary parameters: Periodic Advertising "
        "Interval (paInterval), Number of Sub-events (numSubevents), Sub-event Interval (subeventInterval), and "
        "Response Slot Delay (responseSlotDelay) alongside Response Slot Spacing (responseSlotSpacing). "
        "Consider an industrial monitoring scenario where a central gateway coordinates 128 edge acoustic nodes. "
        "The gateway sets paInterval to 1,280 milliseconds (1.28 seconds). Within this 1.28-second superframe, the "
        "gateway defines 16 sub-events, meaning subeventInterval is 80 milliseconds (1,280 ms / 16). Each sub-event "
        "is assigned to an edge group of 8 nodes. When Sub-event 3 fires, the broadcaster transmits an AUX_SYNC_SUBEVENT_IND "
        "packet on a secondary data channel selected by the Channel Selection Algorithm #2 (CSA #2). The packet header "
        "contains a bitmask indicating which of the 8 nodes in that group should transmit their telemetry. "
        "Following the gateway's packet transmission, the edge nodes calculate their exact response window: "
        "t_response = t_rx_end + T_IFS + responseSlotDelay + (slot_index * responseSlotSpacing). "
        "Here, T_IFS is the standardized Inter-Frame Space of 150 microseconds. If node 2 is addressed, it waits for "
        "slot_index 2. During this intermediate delay, the edge node's CPU remains in WFI (Wait For Interrupt) while a "
        "hardware timer (such as the ARM Cortex-M SysTick or a 32-bit RTC compare register) triggers the radio's "
        "frequency synthesizer ramp-up exactly 40 microseconds before transmission. "
        "The node then transmits an AUX_SYNC_SUBEVENT_RSP packet containing its INT8 anomaly score, ambient temperature, "
        "and battery millivolt reading. The total on-air time for an 8-byte payload at 2 Mbps PHY is a mere 72 microseconds! "
        "Let us calculate the exact electrical charge consumed during this single sub-event transaction: "
        "1. Synthesizer ramp-up: 40 microseconds at 3.2 milliamps = 0.128 microcoulombs. "
        "2. Receiver window: 120 microseconds listening for downlink at 4.6 milliamps = 0.552 microcoulombs. "
        "3. Radio turnaround (T_IFS): 150 microseconds in low-power idle at 1.1 milliamps = 0.165 microcoulombs. "
        "4. Slot delay wait: 250 microseconds sleeping at 1.5 microamps = 0.000375 microcoulombs. "
        "5. Transmitter burst: 72 microseconds at +0 dBm TX power consuming 4.9 milliamps = 0.3528 microcoulombs. "
        "The sum total charge per transaction is approximately 1.198 microcoulombs (1.2 uC). Over a 1.28-second interval, "
        "the average current contributed by radio operations is Q / T = 1.2 uC / 1.28 s = 0.9375 microamps! "
        "Compare this with legacy BLE GATT connections where connection supervision timeouts, empty packet exchanges "
        "(polling), and clock drift tracking force an average standby current of 35 to 80 microamps. PAwR achieves a "
        "fifty-fold power reduction, permitting edge inference nodes to report anomaly metrics indefinitely on ambient "
        "energy harvesting or tiny lithium button cells. "
        "Below, we examine the C data structures and register configuration necessary to initialize a BLE 5.4 PAwR "
        "sub-event schedule on an embedded radio controller."
    )

    say_p3 = (
        "Now that we have mastered deterministic sub-event scheduling with PAwR, let us examine the transmission of "
        "dense, time-sensitive edge streaming data using LE Audio Isochronous Channels (CIS and BIS). In Days 36 through "
        "40, we built micro-acoustic processing chains extracting log-mel filterbank energies and running 1D depthwise "
        "separable CNNs. When an acoustic event occurs—such as a critical bearing cage fracture or a confirmed keyword—the "
        "edge device must not only report a discrete classification flag; it frequently must stream raw 16 kHz audio "
        "snippets or 13-dimensional MFCC frames back to an acoustic diagnostic engineer or a higher-tier neural gateway. "
        "Standard BLE Asynchronous Connection-Oriented Logical Links (ACL) are fundamentally unsuited for streaming audio "
        "or synchronized sensor vectors. If an ACL packet suffers radio frequency interference from 2.4 GHz Wi-Fi or "
        "microwave noise, the link layer retransmits that packet repeatedly. In an audio stream, this retransmission creates "
        "unbounded jitter and latency accumulation, causing the receiver's audio playout or feature buffer to underflow. "
        "Isochronous Channels solve this through two architectural innovations: deterministic presentation timestamps "
        "and bounded Flush Timeouts (FT). An Isochronous Group (CIG or BIG) establishes isochronous streams divided into "
        "Isochronous Intervals (ISO_Interval), typically ranging from 5 milliseconds to 40 milliseconds (standard LE Audio "
        "uses 7.5 ms or 10 ms). Within each ISO_Interval, the stream consists of one or more sub-events. Sub-events allow "
        "immediate, rapid burst retransmissions within the current interval. "
        "However, once the ISO_Interval expires and the presentation deadline arrives, the radio controller's Flush "
        "Timeout mechanism instantly purges the stale frame from the transmit FIFO. The receiver does not stall; instead, "
        "the receiving DSP or neural decoder executes packet loss concealment (PLC) or skips the missed frame. "
        "Furthermore, LE Audio replaces the ancient, inefficient Sub-band Codec (SBC) with the Low Complexity "
        "Communication Codec (LC3). LC3 is a transform-based audio compression algorithm optimized specifically for "
        "fixed-point embedded microcontrollers. It operates on 10 ms or 7.5 ms frame sizes using a low-delay modified "
        "discrete cosine transform (MDCT) with temporal noise shaping and spectral quantization. LC3 delivers superior "
        "perceptual audio quality at 32 kbps or 64 kbps compared to SBC running at 192 kbps. For an edge microcontroller, "
        "compressing 16 kHz 16-bit PCM audio (256 kbps raw) down to 32 kbps with LC3 reduces radio on-air transmission time "
        "by 87.5%, directly cutting radio power consumption by almost an order of magnitude. "
        "In the code implementation below, we configure an embedded Isochronous Channel descriptor, establishing the "
        "ISOAL fragmentation parameters, maximum PDU payload size, transport latency bounds, and the exact packet loss "
        "concealment callback triggered when the hardware flush timeout expires."
    )

    say_p4 = (
        "In Part 4, we examine the critical relationship between low-power radio scheduling, sleep power domains, and "
        "crystal oscillator drift. On modern edge microcontrollers—such as the Nordic Semiconductor nRF5340 or the "
        "Silicon Labs EFR32MG24—the microcontroller contains two distinct execution domains: an Application Core "
        "(running our neural networks and DSP feature extraction) and a dedicated Network Core (running the real-time "
        "BLE controller timing and physical radio drivers). "
        "When the network core puts the radio to sleep between PAwR sub-events or isochronous intervals, the high-frequency "
        "crystal oscillator (typically 32 MHz or 40 MHz) is powered down to conserve energy. Timing during sleep is "
        "maintained by a 32.768 kHz low-frequency clock (LFXO) or internal low-frequency RC oscillator (LFRCO). "
        "However, crystal oscillators exhibit manufacturing tolerance and thermal drift, typically specified in parts per "
        "million (PPM), such as +/- 20 PPM or +/- 50 PPM. "
        "Consider an edge node sleeping for a PAwR interval of 1.28 seconds with a combined central-peripheral clock drift "
        "of 100 PPM. Over 1.28 seconds, the timing uncertainty window delta_t is: "
        "delta_t = 1.28 seconds * 100 * 10^-6 = 128 microseconds. "
        "If the edge node woke up at the nominal expected sub-event start time, it might wake up after the central "
        "gateway had already begun transmitting its synchronization packet, missing the packet entirely! "
        "Therefore, the BLE controller must implement 'window widening'. The node must wake up delta_t / 2 earlier and "
        "keep its radio receiver active for an extra delta_t duration. Every microsecond the receiver is turned on "
        "consumes 4.6 milliamps of current. If clock drift is severe (e.g., using an uncalibrated internal RC oscillator "
        "drifting by 500 PPM), window widening increases the required receiver listening window from 150 microseconds to "
        "over 1,400 microseconds, destroying battery life by a factor of ten! "
        "To mitigate this, high-reliability edge nodes implement temperature-compensated crystal oscillators (TCXO) or "
        "execute runtime hardware calibration routines where the low-frequency RC oscillator is periodically calibrated "
        "against the high-frequency crystal while the radio is active. "
        "Furthermore, the software architecture must utilize zero-copy circular DMA buffers between the DSP audio pipeline "
        "and the BLE radio packet RAM. When the DMA controller signals an event via a hardware event routing system "
        "(such as Nordic's DPPI or Silicon Labs' PRS), the radio peripheral starts autonomously without requiring CPU "
        "interrupt service routines (ISRs) to execute context saves and restores, eliminating dozens of microseconds "
        "of CPU wake time. "
        "Let us examine the complete driver code implementing hardware drift compensation and the low-power sleep state "
        "machine for a synchronized BLE 5.4 radio node."
    )

    say_p5 = (
        "In this final part of Day 41, we bring together PAwR sub-event scheduling, isochronous streaming, and power "
        "profiling into a production-grade, hardened embedded telemetry framework. We will synthesize an autonomous "
        "edge BLE transceiver driver that dynamically toggles between ultra-low-power PAwR beaconing (when sensor "
        "readings and ML inference anomaly scores remain below normal thresholds) and burst Isochronous Audio Streaming "
        "(when an anomaly or keyword trigger is detected by the local CMSIS-NN model). "
        "Let us trace the operational lifecycle of this combined system: "
        "During normal conditions (State 0: IDLE_MONITORING), the DSP inference pipeline samples the IMU or microphone "
        "at 16 Hz, calculates a fast energy metric, and classifies the signal using our INT8 model. The inference takes "
        "4.2 milliseconds and consumes 8 microjoules. The node then enters Deep Sleep (EM2/System OFF), waking only for "
        "its assigned PAwR sub-event every 2,560 milliseconds. At the sub-event, the node sends a 4-byte packet: "
        "[Status_Flags: 1B, Max_Anomaly_Score: 1B, Battery_V: 1B, Sequence_ID: 1B]. "
        "If Max_Anomaly_Score exceeds the dynamic warning threshold (e.g., score >= 75 out of 100), the edge state machine "
        "transitions to State 1: ANOMALY_ALERT. In the PAwR response packet, the node sets the ALERT bit flag. "
        "The central gateway immediately responds in the subsequent downlink slot with a CIG_ESTABLISH command, instructing "
        "the edge device to open a Connected Isochronous Stream (CIS). "
        "The node switches its radio stack to LE Audio mode, activates the LC3 encoder, and streams 500 milliseconds of "
        "pre-buffered raw audio and high-resolution spectrogram frames at 32 kbps directly to the gateway. "
        "Once the diagnostic transfer completes, the edge node sends a CIS_DISCONNECT, powers down the high-power radio "
        "synthesizer, returns to its 850 nanoamp sleep domain, and resumes passive PAwR sub-event listening. "
        "This dual-mode operational paradigm provides the holy grail of industrial IoT: microamp-level baseline power "
        "consumption capable of lasting years on a single coin cell, coupled with the instantaneous capability to deliver "
        "broadband, real-time diagnostic telemetry when anomalies emerge. "
        "Review the complete, hardened C99 embedded firmware implementation below. Observe how every timing parameter, "
        "state transition, and DMA register is explicitly managed to enforce deterministic execution and flawless "
        "low-power telemetry."
    )

    code_p1 = """// BLE 5.4 Radio State Machine & Primary Advertising vs PAwR Structure
#include <stdint.h>
#include <stdbool.h>

typedef enum {
    BLE_RADIO_STATE_DISABLED  = 0x00,
    BLE_RADIO_STATE_RXRU      = 0x01, // RX Ramp Up (40 us)
    BLE_RADIO_STATE_RXIDLE    = 0x02,
    BLE_RADIO_STATE_RX        = 0x03, // Active Receiving
    BLE_RADIO_STATE_RXDISABLE = 0x04,
    BLE_RADIO_STATE_TXRU      = 0x05, // TX Ramp Up (40 us)
    BLE_RADIO_STATE_TXIDLE    = 0x06,
    BLE_RADIO_STATE_TX        = 0x07, // Active Transmitting
    BLE_RADIO_STATE_TXDISABLE = 0x08
} ble_radio_state_t;

typedef struct {
    uint32_t access_address;      // 0x8E89BED6 for advertising or sync word
    uint8_t  channel_index;       // 0 to 39 (37, 38, 39 are primary ad channels)
    uint8_t  tx_power_dbm;        // 0 dBm, +4 dBm, -4 dBm
    uint16_t t_ifs_us;            // Standard Inter-Frame Space = 150 us
    volatile ble_radio_state_t state;
} ble_phy_config_t;

static inline void ble_phy_init(ble_phy_config_t *phy, uint8_t ch, int8_t pwr) {
    phy->access_address = 0x8E89BED6;
    phy->channel_index = ch;
    phy->tx_power_dbm = (uint8_t)pwr;
    phy->t_ifs_us = 150;
    phy->state = BLE_RADIO_STATE_DISABLED;
}
"""

    code_p2 = """// BLE 5.4 PAwR (Periodic Advertising with Response) Timing & Sub-event Engine
#include <stdint.h>
#include <stdbool.h>

#define BLE_PAWR_MAX_SUBEVENTS 128
#define BLE_T_IFS_US           150

typedef struct {
    uint16_t pa_interval_units;    // In units of 1.25 ms (e.g. 1024 = 1.28 s)
    uint8_t  num_subevents;        // e.g. 16 sub-events
    uint8_t  subevent_interval_ms; // e.g. 80 ms
    uint8_t  subevent_index;       // Assigned sub-event for this node group
    uint8_t  response_slot_delay;  // In units of 1.25 ms
    uint8_t  response_slot_spacing;// In units of 125 us
    uint8_t  assigned_slot_index;  // 0 to 7 within the sub-event
} ble_pawr_schedule_t;

typedef struct {
    uint8_t  status_flags;
    int8_t   model_anomaly_score;
    uint16_t battery_mv;
    uint32_t event_counter;
} __attribute__((packed)) pawr_telemetry_payload_t;

uint32_t calculate_response_delay_us(const ble_pawr_schedule_t *sched) {
    uint32_t slot_delay_us = (uint32_t)sched->response_slot_delay * 1250;
    uint32_t slot_spacing_us = (uint32_t)sched->assigned_slot_index * 
                               ((uint32_t)sched->response_slot_spacing * 125);
    return BLE_T_IFS_US + slot_delay_us + slot_spacing_us;
}
"""

    code_p3 = """// LE Audio Isochronous Channel (CIS/BIS) & Flush Timeout Handler
#include <stdint.h>
#include <stdbool.h>

typedef struct {
    uint32_t cig_id;              // Connected Isochronous Group ID
    uint32_t cis_id;              // Connected Isochronous Stream ID
    uint16_t iso_interval_us;     // Standard 10,000 us (10 ms) or 7,500 us (7.5 ms)
    uint8_t  flush_timeout_ft;    // Max retransmissions before packet flush (1 to 15)
    uint16_t max_pdu_size;        // Max payload bytes (e.g. 40 bytes for LC3 32kbps)
    uint32_t presentation_delay_us; // Playout sync timestamp (e.g. 40,000 us)
} le_audio_cis_config_t;

typedef struct {
    uint16_t sequence_number;
    uint32_t timestamp_us;
    uint8_t  payload[64];
    uint8_t  payload_length;
    bool     flushed_by_timeout;
} iso_packet_buffer_t;

void handle_isochronous_flush_timeout(iso_packet_buffer_t *pkt, uint32_t current_time_us) {
    // If packet presentation timestamp expired, discard to prevent pipeline stall
    if (current_time_us > pkt->timestamp_us + 15000) {
        pkt->flushed_by_timeout = true;
        pkt->payload_length = 0; // Trigger Packet Loss Concealment (PLC) at receiver
    }
}
"""

    code_p4 = """// High-Precision Hardware Clock Drift Calculation & Window Widening
#include <stdint.h>
#include <stdbool.h>

typedef struct {
    uint16_t master_sca_ppm;    // Sleep Clock Accuracy of Gateway (e.g. 50 PPM)
    uint16_t slave_sca_ppm;     // Sleep Clock Accuracy of Edge Node (e.g. 50 PPM)
    uint32_t sleep_duration_us; // Microseconds spent in deep sleep
} clock_drift_tracker_t;

typedef struct {
    uint32_t window_widening_us;// Extra time receiver must remain open
    uint32_t rx_start_early_us; // How early radio must start RX ramp-up
} rx_listen_window_t;

rx_listen_window_t calculate_rx_window(const clock_drift_tracker_t *drift) {
    rx_listen_window_t win;
    uint32_t total_ppm = (uint32_t)drift->master_sca_ppm + (uint32_t)drift->slave_sca_ppm;
    // delta_t = (sleep_duration * total_ppm) / 1,000,000
    uint32_t drift_us = (uint32_t)(((uint64_t)drift->sleep_duration_us * total_ppm) / 1000000ULL);
    
    // Add 16 us radio jitter margin
    win.window_widening_us = (drift_us * 2) + 16;
    win.rx_start_early_us = drift_us + 8;
    return win;
}
"""

    code_p5 = """// Production Ultra-Low-Power Edge BLE 5.4 PAwR & Isochronous Telemetry Node
#include <stdint.h>
#include <stdbool.h>
#include <string.h>

typedef enum {
    NODE_STATE_PAWR_IDLE = 0,
    NODE_STATE_PAWR_TX_REPLY,
    NODE_STATE_CIS_STREAMING,
    NODE_STATE_SLEEP
} edge_node_state_t;

typedef struct {
    edge_node_state_t current_state;
    uint32_t subevent_counter;
    int8_t   latest_anomaly_score;
    uint16_t battery_millivolts;
    bool     stream_requested;
} edge_device_context_t;

void edge_node_process_cycle(edge_device_context_t *ctx, uint8_t *radio_tx_buf, uint8_t *tx_len) {
    if (ctx->latest_anomaly_score >= 75) {
        // High anomaly detected: Set alert flag and prepare for CIS streaming transition
        ctx->stream_requested = true;
        radio_tx_buf[0] = 0x81; // Flag: Alert Active (Bit 7) | Telemetry Valid (Bit 0)
    } else {
        ctx->stream_requested = false;
        radio_tx_buf[0] = 0x01; // Normal Telemetry
    }
    
    radio_tx_buf[1] = (uint8_t)ctx->latest_anomaly_score;
    radio_tx_buf[2] = (uint8_t)(ctx->battery_millivolts >> 8);
    radio_tx_buf[3] = (uint8_t)(ctx->battery_millivolts & 0xFF);
    *tx_len = 4;
    
    ctx->subevent_counter++;
    if (ctx->stream_requested) {
        ctx->current_state = NODE_STATE_CIS_STREAMING;
    } else {
        ctx->current_state = NODE_STATE_SLEEP;
    }
}
"""

    parts = [
        {
            "part": 1,
            "title": "Low-Power Wireless Dilemma & BLE 5.4 Architecture",
            "say": say_p1,
            "code": code_p1,
            "codeNotes": [
                "BLE physical layer state machine enforces strict 150 us T_IFS inter-frame spacing between RX and TX modes.",
                "Ramp-up states (RXRU, TXRU) require high-frequency crystal stabilization before radio frequency synthesizers lock.",
                "Primary advertising channels (37, 38, 39) suffer severe packet collisions compared to synchronized secondary channels."
            ],
            "tryIt": "Modify the initial channel index from primary channel 37 to secondary channel 14 and verify frequency mapping.",
            "summary": [
                "Legacy BLE 4.x/5.0 polling and undirected advertising burn excessive energy via uncoordinated receiver listening windows.",
                "BLE 5.4 PAwR allows nodes to sleep for 99.95% of the time by assigning deterministic sub-events and response slots.",
                "Isochronous Channels provide bounded-latency packet streams with hardware flush timeouts replacing indefinite retries.",
                "Deterministic radio scheduling drops the average radio current draw from tens of microamps down to under 1 microamp."
            ],
            "projectStep": {
                "title": "Initialize BLE Physical Layer State Machine",
                "steps": [
                    "Define the standardized radio state machine covering ramp-up, idle, and active transceiver modes.",
                    "Set the standardized 150 us Inter-Frame Space (T_IFS) constant for deterministic hardware turnaround.",
                    "Configure primary access address 0x8E89BED6 and select initial transmit power level.",
                    "Verify radio disabled state before asserting high-frequency crystal oscillator startup."
                ]
            },
            "check": {
                "question": "What is the primary architectural cause of battery drain in legacy BLE undirected advertising compared to BLE 5.4 PAwR?",
                "options": [
                    "Receiving nodes must maintain continuous or high-duty-cycle scanning to catch asynchronous, uncoordinated advertising packets.",
                    "Legacy BLE uses 5 GHz frequency hopping which experiences three times higher attenuation in industrial environments.",
                    "Legacy advertising packets require 256-bit RSA hardware encryption on every transmitted advertising frame.",
                    "The legacy physical layer restricts transmit power to +20 dBm without support for low-power 0 dBm settings."
                ],
                "answer": 0,
                "why": "Uncoordinated advertising forces listening observers to keep their receivers energized almost continuously to avoid missing bursts, whereas PAwR synchronizes exact sub-events and response slots."
            }
        },
        {
            "part": 2,
            "title": "PAwR Sub-Event Scheduling & Microamp Power Budgets",
            "say": say_p2,
            "code": code_p2,
            "codeNotes": [
                "PAwR superframe is subdivided into discrete sub-events and fine-grained response slot offsets.",
                "Response delay is computed analytically using T_IFS, responseSlotDelay, and assigned slot spacing.",
                "On-air transmission for an 8-byte payload at 2 Mbps takes only 72 us, consuming ~1.2 uC per cycle."
            ],
            "tryIt": "Calculate the exact response delay in microseconds when assigned_slot_index is changed from 0 to 4.",
            "summary": [
                "paInterval and numSubevents establish a deterministic time-division access matrix for up to thousands of edge nodes.",
                "The central broadcaster transmits downlink synchronizations while addressed peripheral nodes reply in dedicated response slots.",
                "Short 2 Mbps radio bursts limit electrical charge consumption to ~1.2 microcoulombs per sub-event transaction.",
                "Average current draw over a 1.28-second reporting interval falls to ~0.94 microamps, enabling multi-year coin cell operation."
            ],
            "projectStep": {
                "title": "Configure Deterministic PAwR Sub-Event Schedule",
                "steps": [
                    "Specify the periodic advertising superframe interval in standard 1.25 ms base units.",
                    "Divide the superframe into discrete sub-event slots and allocate node groups to specific indices.",
                    "Calculate exact response slot timing incorporating standardized T_IFS and hardware slot offsets.",
                    "Pack edge telemetry payload with packed structure attributes to prevent compiler struct padding overhead."
                ]
            },
            "check": {
                "question": "How does BLE 5.4 PAwR prevent radio packet collisions among dozens of edge sensor nodes reporting to the same gateway?",
                "options": [
                    "By assigning each edge node a unique deterministic sub-event and response slot index within the periodic advertising interval.",
                    "By utilizing CSMA/CD with collision detection wires physically connecting all edge microcontrollers.",
                    "By increasing the transmit power so that the strongest node overrides all concurrent transmitters.",
                    "By forcing all nodes to perform 1,000 random back-off iterations before every single bit transmission."
                ],
                "answer": 0,
                "why": "PAwR divides the advertising train into time-slotted sub-events and response slots; each node only transmits during its explicitly assigned slot offset."
            }
        },
        {
            "part": 3,
            "title": "LE Audio Isochronous Channels & Flush Timeout Mechanics",
            "say": say_p3,
            "code": code_p3,
            "codeNotes": [
                "Isochronous streams enforce a strict presentation delay timestamp to guarantee synchronized sensor playout.",
                "Flush Timeout (FT) limits the number of retransmissions, discarding stale packets when the deadline arrives.",
                "LC3 audio compression compresses 256 kbps raw PCM to 32 kbps, slashing radio transmit time by 87.5%."
            ],
            "tryIt": "Increase flush_timeout_ft from 2 to 6 and evaluate how it impacts maximum allowable radio retry latency.",
            "summary": [
                "Asynchronous ACL links suffer unbounded latency accumulation due to indefinite retransmission loops.",
                "Isochronous Channels (CIS/BIS) bound latency through deterministic sub-events and hardware flush timeouts.",
                "When a packet deadline expires, the transmitter purges the FIFO and the receiver executes packet loss concealment (PLC).",
                "LC3 transform-based codec achieves high perceptual fidelity at low bitrates, drastically saving edge transmission power."
            ],
            "projectStep": {
                "title": "Implement LE Audio Isochronous Channel Descriptor",
                "steps": [
                    "Define the Connected Isochronous Group (CIG) and Stream (CIS) identifier parameters.",
                    "Set the isochronous interval to 10 ms matching standard LC3 audio framing periods.",
                    "Configure the hardware Flush Timeout (FT) threshold to bound packet retry latency.",
                    "Implement the timeout expiration callback to discard stale frames and flag receiver concealment."
                ]
            },
            "check": {
                "question": "What is the primary operational role of the Flush Timeout (FT) parameter in BLE LE Audio Isochronous Streams?",
                "options": [
                    "To discard unacknowledged packets whose presentation deadline has expired, preventing audio pipeline buffer stalls.",
                    "To completely erase the microcontroller flash memory if an invalid encryption key is detected.",
                    "To flush the high-frequency crystal oscillator capacitor bank during sleep transitions.",
                    "To force the receiving gateway to restart its operating system after every 100 received audio packets."
                ],
                "answer": 0,
                "why": "In streaming real-time applications like audio or live feature streaming, late packets are useless; the Flush Timeout prevents indefinite retries from stalling the stream."
            }
        },
        {
            "part": 4,
            "title": "Hardware Clock Drift, Sleep Domains & Window Widening",
            "say": say_p4,
            "code": code_p4,
            "codeNotes": [
                "Sleep clock accuracy (SCA) is quantified in PPM; master and slave drift tolerances sum together.",
                "Window widening extends receiver active time: (drift_us * 2) + jitter margin.",
                "Excessive clock drift forces wider listening windows, linearly increasing the 4.6 mA RX power consumption."
            ],
            "tryIt": "Simulate an uncalibrated 500 PPM internal RC oscillator and observe the resulting window widening overhead.",
            "summary": [
                "During deep sleep, the high-frequency crystal is halted and timing is preserved by a 32.768 kHz oscillator.",
                "Thermal drift and manufacturing tolerances accumulate timing error over long sleep intervals.",
                "Window widening ensures the peripheral wakes early enough to guarantee packet capture despite timing jitter.",
                "Periodic hardware calibration or TCXO components prevent wide listening windows and preserve battery life."
            ],
            "projectStep": {
                "title": "Construct Sleep Clock Drift & Window Widening Calculator",
                "steps": [
                    "Aggregate the sleep clock accuracy (SCA) specifications of both central gateway and edge peripheral.",
                    "Calculate cumulative timing drift in microseconds over the full programmed sleep duration.",
                    "Compute the early receiver ramp-up offset and expanded reception window with safety jitter margins.",
                    "Verify that the calculated listening window fits within the allocated sub-event margin."
                ]
            },
            "check": {
                "question": "Why does an uncalibrated internal RC sleep oscillator drifting by 500 PPM degrade edge battery life during PAwR operation?",
                "options": [
                    "It forces the radio to wake up much earlier and keep its 4.6 mA receiver active for a widened window to avoid missing packets.",
                    "It causes the radio transmitter frequency to shift directly into the microwave radar band.",
                    "It doubles the CPU instruction execution cycle count for all CMSIS-NN convolutional kernels.",
                    "It causes the flash memory cells to leak charge during sleep mode."
                ],
                "answer": 0,
                "why": "High timing uncertainty requires 'window widening', which extends the active duration of the energy-expensive radio receiver prior to packet arrival."
            }
        },
        {
            "part": 5,
            "title": "Autonomous Dual-Mode PAwR & Isochronous Telemetry Node Lab",
            "say": say_p5,
            "code": code_p5,
            "codeNotes": [
                "State machine dynamically transitions between low-power PAwR beaconing and high-bandwidth CIS streaming.",
                "Anomaly score thresholding (>= 75) automatically activates the alert flag in the sub-event uplink payload.",
                "Big-endian packing of battery millivolts and status bytes ensures cross-platform gateway compatibility."
            ],
            "tryIt": "Simulate an anomaly score of 82 and verify that current_state transitions to NODE_STATE_CIS_STREAMING.",
            "summary": [
                "Dual-mode telemetry combines sub-microamp baseline beaconing with instantaneous high-throughput streaming.",
                "Normal sensor telemetry is transmitted inside 4-byte packed PAwR response packets once every 1 to 2 seconds.",
                "Threshold crossings trigger an alert flag that prompts the central gateway to establish a Connected Isochronous Stream.",
                "The edge device streams diagnostic audio or dense feature maps before gracefully returning to deep sleep."
            ],
            "projectStep": {
                "title": "Build Autonomous Edge BLE Telemetry Controller",
                "steps": [
                    "Instantiate the edge device operational context and state machine tracker.",
                    "Implement the threshold decision logic mapping INT8 neural anomaly scores to alert flags.",
                    "Assemble the 4-byte packed PAwR response packet with status, anomaly score, and battery voltage.",
                    "Trigger the state transition into isochronous streaming mode when critical anomalies occur."
                ]
            },
            "check": {
                "question": "In the dual-mode edge telemetry architecture, what operational event triggers the transition from PAwR beaconing to CIS streaming?",
                "options": [
                    "An on-device ML anomaly score exceeding the alert threshold (e.g. >= 75), which flags the central gateway to open a stream.",
                    "The battery voltage dropping below 1.8 volts.",
                    "The edge microcontroller reaching 1,000,000 elapsed CPU clock cycles.",
                    "A manual physical button press on the edge node circuit board."
                ],
                "answer": 0,
                "why": "The local ML model continuously monitors the environment; when an anomaly exceeds threshold, it alerts the gateway to establish a broadband isochronous stream for deep diagnostics."
            }
        }
    ]

    return {
        "day": 41,
        "title": "Ultra-Low-Power Wireless: BLE 5.4 Periodic Advertising & LE Audio Isochronous Channels",
        "description": "Master BLE 5.4 Periodic Advertising with Response (PAwR) and LE Audio Isochronous Channels (CIS/BIS). Implement sub-event scheduling, microamp energy budgets, LC3 audio compression, clock drift window widening, and autonomous dual-mode edge telemetry engines.",
        "minutes": 38,
        "parts": parts
    }

if __name__ == "__main__":
    d = get_day41()
    print("Day 41 generated. Parts:", len(d["parts"]))
    for p in d["parts"]:
        print(f"Part {p['part']}: {len(p['say'].split())} words in say")
    with open("scripts/iot_edge_day41.json", "w", encoding="utf-8") as f:
        json.dump(d, f, indent=2)
    print("Saved scripts/iot_edge_day41.json")
