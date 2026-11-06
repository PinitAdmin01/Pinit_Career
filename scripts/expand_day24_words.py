# scripts/expand_day24_words.py
import json

with open("scripts/iot_net_day24.json", "r", encoding="utf-8") as f:
    d = json.load(f)

expansions = {
    0: (
        "In production embedded systems, circular ring buffer sizing and direct memory access (DMA) integration dictate modem stability. "
        "A typical cellular modem receiving an incoming HTTP or CoAP payload can burst data at 115,200 to 921,600 baud. "
        "At 921,600 baud, bytes arrive every 10.85 microseconds. If the microcontroller relies purely on single-byte UART interrupts, "
        "the CPU spends nearly 40% of its clock cycles executing interrupt prologue and epilogue instructions, leading to interrupt starvation "
        "and dropped bytes. To eliminate CPU intervention, embedded developers configure circular DMA transfers with an idle-line interrupt. "
        "The DMA controller automatically transfers incoming UART bytes directly into the SRAM ring buffer without waking the CPU core. "
        "Only when the UART line goes silent for one character frame (an idle line event indicating the end of a command response) does an "
        "interrupt fire, prompting the line parser to process the freshly buffered lines in a single high-efficiency batch."
    ),
    1: (
        "Managing asynchronous URCs becomes particularly intricate when cellular modems enter and exit 3GPP Power Saving Mode (PSM) "
        "or extended Discontinuous Reception (eDRX). When PSM is active, the modem shuts down its RF transceiver and baseband processor, "
        "entering a deep sleep state drawing under 3 microamps while maintaining network registration in the carrier's Home Subscriber Server (HSS). "
        "When the modem wakes up to transmit, it emits specialized power-management URCs, such as '+PSMPOWER: 1' or '+CEDRXP: ...'. "
        "If the host application intends to transmit a telemetry burst while the modem is entering sleep, issuing AT commands will result in "
        "communication timeouts. The URC dispatcher intercepts these sleep notifications, updating power state flags and preventing the application "
        "layer from attempting socket transmissions until the modem fully re-establishes its active baseband clock."
    ),
    2: (
        "Cellular band scanning and network selection heuristics are critical for roaming IoT deployments such as international container shipping. "
        "When a device powers on in a foreign port, the SIM card's roaming profile dictates preferred Public Land Mobile Network (PLMN) IDs. "
        "If the modem fails to attach to the first scanned frequency band, issuing 'AT+COPS=?' initiates a full network scan. "
        "However, a full 3GPP frequency scan across LTE Bands 1, 2, 3, 4, 5, 8, 12, 13, 20, and 28 can take up to 15 minutes and drain over 150 milliamps, "
        "severely impacting battery life. Robust state machine implementations mitigate this by locking the modem to known regional bands using "
        "vendor commands (such as 'AT+QCFG=\"band\"' on Quectel modems). By pre-restricting the scan list based on recent GPS coordinates or last-known "
        "towers, network attachment time drops from 10 minutes to under 12 seconds."
    ),
    3: (
        "Beyond standard IPv4 and IPv6 PDP contexts, modern cellular LPWAN infrastructure supports Non-IP Data Delivery (NIDD) via 3GPP Cellular IoT EPS optimizations. "
        "In standard IP architectures, an IoT device transmitting a 10-byte telemetry reading must prepend 20 bytes of IPv4 header and 8 bytes of UDP header. "
        "Under 3GPP Release 13 NIDD (PDP type 'Non-IP'), the device transmits raw application bytes directly inside Control Plane NAS (Non-Access Stratum) "
        "signaling messages, completely bypassing IP header overhead! The carrier's Service Capability Exposure Function (SCEF) receives the raw payload "
        "and forwards it directly to the customer's cloud webhook over an enterprise REST API. Understanding both IP and Non-IP PDP context architectures "
        "allows embedded systems engineers to select the optimal cellular transmission mode for ultra-constrained metering sensors."
    ),
    4: (
        "The timing tolerances of the ITU-T V.250 Guard Time Escape Sequence demand high-precision hardware timer implementation in firmware. "
        "In many commercial RTOS environments, developer tasks rely on coarse millisecond software ticks that can drift under heavy interrupt loads. "
        "If the leading guard time is cut short to 980 milliseconds due to task scheduling jitter, the modem will interpret the '+++' characters as raw data "
        "and remain trapped in Data Mode. To guarantee absolute compliance, professional cellular modem drivers utilize hardware hardware timers or "
        "dedicated RTOS software timers configured with microsecond precision. Once the escape sequence succeeds, the driver immediately verifies Command Mode "
        "by issuing a synchronizing 'AT' command before executing any out-of-band diagnostics, ensuring that the control plane is 100% responsive."
    )
}

for idx, exp in expansions.items():
    d["parts"][idx]["say"].append(exp)

with open("scripts/iot_net_day24.json", "w", encoding="utf-8") as f:
    json.dump(d, f, indent=2)

print("Expanded scripts/iot_net_day24.json successfully.")
