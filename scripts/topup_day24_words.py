# scripts/topup_day24_words.py
import json

with open("scripts/iot_net_day24.json", "r", encoding="utf-8") as f:
    d = json.load(f)

additions = {
    1: (
        "Furthermore, modern multi-socket applications require thread-safe URC event routing. "
        "When an IoT gateway runs concurrent threads communicating over multiple cloud sockets, an asynchronous '+QIURC: \"recv\",0' notification "
        "must be routed strictly to the specific thread managing socket descriptor 0, while leaving socket 1 unaffected. "
        "Our dispatcher architecture incorporates thread-safe message queues and mutex primitives, preventing race conditions "
        "and ensuring that asynchronous cellular events are resolved with zero latency across multi-threaded embedded firmware."
    ),
    2: (
        "In addition to basic signal strength reporting, cellular network diagnostics provide critical metrics such as Reference Signal Received Power (RSRP) "
        "and Reference Signal Received Quality (RSRQ). In LTE-M and NB-IoT systems, command 'AT+QENG=\"servingcell\"' returns precise physical cell IDs (PCI), "
        "carrier frequencies, and RSRP measurements in dBm. An RSRP value above -90 dBm represents excellent cell coverage, while values below -115 dBm "
        "warn firmware that transmission failure is imminent. Utilizing these granular radio metrics allows the state machine to dynamically adjust "
        "retransmission intervals and optimize transmit power, achieving maximum power efficiency in remote field conditions."
    ),
    3: (
        "Enterprise cloud integration frequently mandates mutual TLS (mTLS) authentication directly over cellular bearers. "
        "Rather than managing complex cryptographic X.509 certificate chains in host microcontroller flash memory, modern cellular modems feature "
        "onboard non-volatile secure storage for client certificates, private keys, and root Certificate Authorities (CAs). "
        "Commands such as 'AT+QFUPL' upload certificates into modem NVRAM, enabling hardware-accelerated TLS 1.3 handshakes directly inside the baseband chip. "
        "This offloading frees hundreds of kilobytes of code space on the host microcontroller, dramatically simplifying firmware maintenance and security audits."
    ),
    4: (
        "Finally, comprehensive watchdog monitoring must oversee all cellular modem interactions. "
        "If a cellular baseband processor freezes due to firmware bugs or electrostatic discharge (ESD) transients, "
        "the host microcontroller's AT parser will wait indefinitely for command responses. To prevent permanent field lockups, "
        "the modem driver maintains an independent hardware watchdog timer. If any AT command fails to return within a designated timeout window "
        "(typically 15 to 30 seconds for network operations), the driver asserts the modem's physical RESET or POWER_KEY pin, performing a clean "
        "hardware reboot and re-initiating the 3GPP attachment sequence autonomously."
    )
}

for idx, text in additions.items():
    d["parts"][idx]["say"].append(text)

with open("scripts/iot_net_day24.json", "w", encoding="utf-8") as f:
    json.dump(d, f, indent=2)

print("Topped up Day 24 words successfully.")
