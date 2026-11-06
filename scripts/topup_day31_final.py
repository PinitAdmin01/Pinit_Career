# scripts/topup_day31_final.py
import json

with open("scripts/iot_net_day31.json", "r", encoding="utf-8") as f:
    d = json.load(f)

p3_final = (
    "In addition to simple point-to-point bridging, enterprise edge bridges implement local cache acceleration and unsolicited change-of-value (COV) reporting. "
    "Rather than forwarding every single TCP read query directly to the slow RS-485 serial bus (which would saturate the 19,200 baud link if multiple SCADA dashboards query the gateway simultaneously), "
    "the gateway maintains an in-memory Redis or SQLite shadow cache of holding registers. "
    "The serial master background thread continuously polls the physical sensors, updating the local cache in milliseconds. "
    "When remote cloud clients issue Modbus TCP read requests, the gateway responds instantaneously from cache with sub-millisecond latency, "
    "reducing serial airtime contention and scaling concurrent client capacity by an order of magnitude."
)

p4_final = (
    "To handle catastrophic physical transceiver lockups where an electrical surge causes an RS-485 line driver to latch into continuous transmission (babbling idiot failure), "
    "industrial gateway hardware integrates dedicated watchdog circuitry. "
    "An external hardware timer monitors the DE pin; if the driver remains continuously asserted for more than 50 milliseconds (vastly exceeding the maximum transmission duration of a 256-byte Modbus frame at 9,600 baud), "
    "the hardware timer forces DE to ground and triggers a hardware interrupt. "
    "The microcontroller logs the physical fault, cycles the transceiver power rail using a high-side load switch, and resets the UART peripheral, "
    "ensuring that a single defective transceiver never permanently disables the shared industrial multi-drop bus."
)

p5_final = (
    "Comprehensive validation of industrial Modbus communication requires subjecting edge prototypes to rigorous physical and environmental testing. "
    "In specialized compliance laboratories, automated test fixtures inject common-mode voltage offsets, artificial cable reflections, and electrical fast transient (EFT) bursts "
    "specified under IEC 61000-4-4 into the RS-485 cable while verifying zero bit corruption in decoded telemetry. "
    "Gateways undergo 72-hour continuous multi-client saturation tests, confirming that serial-to-Ethernet translation queues operate without memory leaks or race conditions. "
    "By mastering the complete Modbus communication stack—from bare-metal CRC-16 polynomial math and microsecond-level DE/RE turnaround timing, "
    "to Modbus TCP MBAP encapsulation and resilient fault-tolerant polling engines—you establish the authoritative industrial IoT engineering skills "
    "required to connect the physical machinery of modern industry to enterprise cloud intelligence."
)

d["parts"][2]["say"].append(p3_final)
d["parts"][3]["say"].append(p4_final)
d["parts"][4]["say"].append(p5_final)

with open("scripts/iot_net_day31.json", "w", encoding="utf-8") as f:
    json.dump(d, f, indent=2)

print("Day 31 final topup complete.")
